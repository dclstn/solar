import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import moment from 'moment';
import cron from 'node-cron';
import {CommandNames, CommandDescriptions, MessageComponentIds, CommandOptions} from '../../lib/constants.js';
import commands from '../../interactions/commands.js';
import Vote from '../../database/vote/index.js';
import {success, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../lib/sentry.js';
import components from '../../interactions/components.js';
import {emoteStrings} from '../../utils/emotes.js';
import {createToggleNotificationButton, VOTE_DBL, VOTE_TOPGG} from '../../utils/buttons.js';
import Cooldown from '../../database/cooldown/index.js';
import User from '../../database/user/index.js';

const VOTING_QUERY = {
  'voting.endDate': {$lte: new Date()},
  'voting.notified': false,
  'voting.shouldNotify': true,
};

const cronJob = cron.schedule('*/60 * * * * *', async () => {
  const readyCooldowns = await Cooldown.find(VOTING_QUERY);

  if (readyCooldowns.length === 0) {
    return;
  }

  await Cooldown.updateMany(VOTING_QUERY, {'voting.notified': true});

  for await (const cooldown of readyCooldowns) {
    const user = await User.findOne({discordId: cooldown.discordId});

    if (user == null) {
      continue;
    }

    await user.notify({embeds: [success('You can now vote again!')]});
  }
});

cronJob.start();

commands.on(CommandNames.VOTE, async (interaction: CommandInteraction) => {
  const discordUser = interaction.options.getUser('user') || interaction.user;
  const vote = await Vote.get(discordUser.id);
  const userCooldown = await Cooldown.get(discordUser.id);

  try {
    const embed = new MessageEmbed().setColor('GOLD').setAuthor({
      name: `${discordUser.username}'s Voting Status ${vote.rewardable}`,
      iconURL: discordUser.avatarURL(),
    });

    let minsLeft;
    if (!vote.rewardable) {
      minsLeft = moment(new Date()).diff(moment(vote.lastReward).add(12, 'hours'), 'seconds');
      embed.addField(
        'Next Reward',
        `${emoteStrings.neutral} Claimed! (Reward ready in ${moment.duration(minsLeft, 'seconds').humanize()})`
      );
    } else {
      minsLeft = moment(new Date()).diff(moment(vote.topGG.lastVoted).add(12, 'hours'), 'seconds');
      embed.addField(
        'Step 1: Vote onTop.GG',
        vote.topGG.hasVoted
          ? `${emoteStrings.success} Voted! (Vote again in ${moment.duration(minsLeft, 'seconds').humanize()})`
          : `${emoteStrings.neutral} Vote ready!`
      );

      minsLeft = moment(new Date()).diff(moment(vote.discordBotList.lastVoted).add(12, 'hours'), 'seconds');
      embed.addField(
        'Step 2: Vote on DiscordBotList.com',
        vote.discordBotList.hasVoted
          ? `${emoteStrings.success} Voted! (Vote again in ${moment.duration(minsLeft, 'seconds').humanize()})`
          : `${emoteStrings.neutral} Vote ready!`
      );

      embed.addField(
        `Step 3: Recieve Reward`,
        `${emoteStrings.neutral} Your reward is ready! (complete the other steps!)`
      );
    }

    embed.setFooter({
      text: "You must vote on each network before you can claim your reward!\nDidn't have space for a gift? do not fret! just click the button below!",
    });

    await interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          ...(!userCooldown.voting.shouldNotify ? [createToggleNotificationButton('voting')] : []),
          VOTE_TOPGG,
          VOTE_DBL
        ),
      ],
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({
        embeds: [warning(err.message)],
        ephemeral: true,
      });
      return;
    }

    Sentry.captureException(err);
  }
});

components.on(MessageComponentIds.VALIDATE_VOTES, async (interaction: ButtonInteraction) => {
  const vote = await Vote.get(interaction.user.id);

  try {
    await vote.validateVotes();
    await interaction.reply({embeds: [success('Successfuly confirmed vote!')]});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({
        embeds: [warning(err.message)],
        ephemeral: true,
      });
      return;
    }

    Sentry.captureException(err);
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.VOTE,
  description: CommandDescriptions[CommandNames.VOTE],
  options: CommandOptions[CommandNames.VOTE],
});
