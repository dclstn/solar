import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import moment from 'moment';
import Long from 'long';
import {CommandNames, CommandDescriptions, MessageComponentIds, CommandOptions} from '../../constants.js';
import commands from '../../interactions/commands.js';
import Vote from '../../database/vote/index.js';
import {success, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';
import components from '../../interactions/components.js';
import {emoteStrings} from '../../utils/emotes.js';
import {VALIDATE_VOTES_BUTTON, VOTE_DBL, VOTE_TOPGG} from '../../utils/buttons.js';

commands.on(CommandNames.VOTE, async (interaction: CommandInteraction) => {
  const discordUser = interaction.options.getUser('user') || interaction.user;
  const vote = await Vote.get(Long.fromString(discordUser.id));

  try {
    const embed = new MessageEmbed().setColor('GOLD').setAuthor({
      name: `${discordUser.username}'s Voting Status ${vote.rewardable ? '(REWARD READY)' : ''}`,
      iconURL: discordUser.avatarURL(),
    });

    let minsLeft;
    if (!vote.rewardable) {
      minsLeft = moment(new Date()).diff(moment(vote.lastReward).add(12, 'hours'), 'minutes');
      embed.addField(
        'Next Reward',
        vote.rewardable
          ? `${emoteStrings.success} Your reward is ready!`
          : `${emoteStrings.neutral} Reward ready in ${moment.duration(minsLeft, 'minutes').humanize()}`
      );
    } else {
      minsLeft = moment(new Date()).diff(moment(vote.topGG.lastVoted).add(12, 'hours'), 'minutes');
      embed.addField(
        'Top.GG',
        vote.topGG.hasVoted
          ? `${emoteStrings.neutral} Vote again in ${moment.duration(minsLeft, 'minutes').humanize()}`
          : `${emoteStrings.success} Vote ready!`
      );

      minsLeft = moment(new Date()).diff(moment(vote.discordBotList.lastVoted).add(12, 'hours'), 'minutes');
      embed.addField(
        'DiscordBotList.com',
        vote.discordBotList.hasVoted
          ? `${emoteStrings.neutral} Vote again in ${moment.duration(minsLeft, 'minutes').humanize()}`
          : `${emoteStrings.success} Vote ready!`
      );
    }

    embed.setFooter({
      text: "You must vote on each network before you can claim your reward!\nDidn't have space for a gift? do not fret! just click the button below!",
    });

    await interaction.reply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(VALIDATE_VOTES_BUTTON, VOTE_TOPGG, VOTE_DBL)],
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
  const vote = await Vote.get(Long.fromString(interaction.user.id));

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
