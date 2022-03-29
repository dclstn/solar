import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed, User} from 'discord.js';
import commands from '../../interactions/commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import Raid from '../../database/raid/index.js';
import {createJoinRaidButton, createLeaveRaidButton, PROFILE_BUTTON, SHOP_BUTTON} from '../../utils/buttons.js';
import components from '../../interactions/components.js';
import {numberWithCommas, success, warning} from '../../utils/embed.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import type {RaidResultInterface} from '../../types/raid.js';
import redlock, {userLock} from '../../redis/locks.js';
import {emoteStrings} from '../../utils/emotes.js';
import webhook from '../../webhook.js';

const createInitialEmbed = (user: User, target: User) =>
  new MessageEmbed()
    .setAuthor({name: `${user.username} is raiding ${target.username}`, iconURL: user.avatarURL()})
    .setDescription(`${emoteStrings.loading} Raid in progress`)
    .setFooter({text: 'Raid will commence in a few seconds...'})
    .setColor('DARK_GREEN');

const createCompleteEmbed = (raidMeta: RaidResultInterface) => {
  const raidersUsernames = raidMeta.raiders.map((raider) => `**${raider.username}**`).join(', ');
  const midText = raidMeta.success ? 'has raided' : 'attempted to raid';
  const endText = raidMeta.success
    ? `${emoteStrings.gold} **${numberWithCommas(raidMeta.stolen)}** was split between all raiders!`
    : '';

  return new MessageEmbed()
    .setAuthor({name: raidMeta.success ? 'Successful Raid!' : 'Raid Failure!'})
    .setDescription(`${raidersUsernames} ${midText} **${raidMeta.target.username}**!\n${endText}`)
    .setColor(raidMeta.success ? 'GREEN' : 'RED');
};

async function handleRaidComplete(raidMeta: RaidResultInterface, interaction: CommandInteraction) {
  const embed = createCompleteEmbed(raidMeta);
  const mentions = [raidMeta.target, ...raidMeta.raiders].map((raider) => `<@${raider.discordId}>`).join(' ');

  await Promise.all([
    interaction.editReply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(PROFILE_BUTTON, SHOP_BUTTON)],
    }),
    webhook.send({content: mentions, embeds: [embed]}),
    raidMeta.target.notify({embeds: [embed]}),
  ]);
}

commands.on(CommandNames.RAID, async (interaction: CommandInteraction) => {
  const target = interaction.options.getUser('user', true);
  const lock = await redlock.acquire([userLock(target)], 1000);

  try {
    const sessionId = await Raid.createRaid({
      user: interaction.user,
      target,
      onComplete: (raidMeta) => handleRaidComplete(raidMeta, interaction),
    });

    await interaction.reply({
      embeds: [createInitialEmbed(interaction.user, target)],
      components: [
        new MessageActionRow().addComponents(createJoinRaidButton(sessionId), createLeaveRaidButton(sessionId)),
      ],
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    await lock.release();
  }
});

components.on(MessageComponentIds.JOIN_RAID, async (interaction: ButtonInteraction, sessionId) => {
  try {
    await Raid.joinRaid(sessionId, interaction.user);

    await interaction.reply({
      embeds: [success('Successfully joined raid!')],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
});

components.on(MessageComponentIds.LEAVE_RAID, async (interaction: ButtonInteraction, sessionId) => {
  try {
    await Raid.leaveRaid(sessionId, interaction.user);

    await interaction.reply({
      embeds: [success('Successfully left raid!')],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.RAID,
  description: CommandDescriptions[CommandNames.RAID],
  options: CommandOptions[CommandNames.RAID],
});
