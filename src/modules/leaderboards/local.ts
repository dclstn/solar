import {CommandInteraction, MessageActionRow} from 'discord.js';
import Mongoose from 'mongoose';
import {GLOBAL_LEADERBOARD_BUTTON} from '../../utils/buttons.js';
import Sentry from '../../sentry.js';
import {createLeaderboardEmbed, numberWithCommas, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Guilds from '../../database/guild/index.js';
import type {UserInterface} from '../../types/user';
import {LeaderboardType} from '../../constants.js';
import {InventoryType} from '../../utils/enums.js';

export default async function localLeaderboard(interaction: CommandInteraction) {
  const type = interaction.options.getString('type', true);

  try {
    if (interaction.guildId == null) {
      throw new ResponseError('The command is only available in guilds');
    }

    const id: Mongoose.Schema.Types.Long = interaction.guildId as unknown as Mongoose.Schema.Types.Long;
    const guild = await Guilds.findOne({guildId: id}).populate('users');

    if (guild == null) {
      throw new ResponseError('Failed to find members');
    }

    let embed;

    if (type === LeaderboardType.MONEY) {
      const users = guild.users.sort((a: UserInterface, b: UserInterface) => b.money - a.money).slice(0, 10);

      // TODO: add a formatter for usernames/guild names
      embed = createLeaderboardEmbed(
        ['#', 'Username', 'Coins'],
        users.map(({username, money}, index) => [(index + 1).toString(), username, numberWithCommas(money)])
      ).setTitle(`🏆 ${guild.name} Leaderboard`);
    }

    if (type === LeaderboardType.GPH) {
      const users = guild.users
        .sort(
          (a: UserInterface, b: UserInterface) =>
            b.getInventory(InventoryType.Main).gph - a.getInventory(InventoryType.Main).gph
        )
        .slice(0, 10);

      // TODO: add a formatter for usernames/guild names
      embed = createLeaderboardEmbed(
        ['#', 'Username', 'GPH'],
        users.map((user, index) => [
          (index + 1).toString(),
          user.username,
          numberWithCommas(user.getInventory(InventoryType.Main).gph),
        ])
      ).setTitle(`🏆 ${guild.name} Leaderboard`);
    }

    interaction.reply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(GLOBAL_LEADERBOARD_BUTTON)],
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
