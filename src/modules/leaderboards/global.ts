import {CommandInteraction, MessageActionRow} from 'discord.js';
import {TopUserMoneyModel, VirtualUserModel, TopCPHUserModel} from '../../database/user/aggregation-models.js';
import Sentry from '../../sentry.js';
import {createLeaderboardEmbed, numberWithCommas, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import User from '../../database/user/index.js';
import {LOCAL_LEADERBOARD_BUTTON} from '../../utils/buttons.js';
import {LeaderboardType} from '../../constants.js';

function aggregate() {
  User.aggregate([
    {
      $sort: {money: -1},
    },
    {
      $limit: 25,
    },
    {
      $project: {
        discordId: 1,
        username: 1,
        avatar: 1,
        money: 1,
      },
    },
    {
      $out: 'top_user_money',
    },
  ]).exec();

  VirtualUserModel.aggregate([
    {
      $sort: {cph: -1},
    },
    {
      $limit: 25,
    },
    {
      $project: {
        discordId: 1,
        username: 1,
        avatar: 1,
        cph: 1,
      },
    },
    {
      $out: 'top_user_cph',
    },
  ]).exec();
}

aggregate();
setInterval(() => aggregate(), 60 * 1000);

export default async function globalLeaderboard(interaction: CommandInteraction) {
  const type = interaction.options.getString('type', true);

  try {
    let embed;
    if (type === LeaderboardType.MONEY) {
      const users = await TopUserMoneyModel.find({}).lean().limit(10);

      // TODO: add a formatter for usernames/guild names
      embed = createLeaderboardEmbed(
        ['#', 'Username', 'Coins'],
        users.map(({username, money}, index) => [(index + 1).toString(), username, numberWithCommas(money)])
      ).setTitle(`🏆 Global Leaderboard`);
    }

    if (type === LeaderboardType.GPH) {
      const users = await TopCPHUserModel.find({}).lean().limit(10);

      // TODO: add a formatter for usernames/guild names
      embed = createLeaderboardEmbed(
        ['#', 'Username', 'CPH'],
        users.map(({username, cph}, index) => [(index + 1).toString(), username, numberWithCommas(cph)])
      ).setTitle(`🏆 Global Leaderboard`);
    }

    if (embed == null) {
      throw new ResponseError('Failed to find members');
    }

    await interaction.reply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(LOCAL_LEADERBOARD_BUTTON)],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
}
