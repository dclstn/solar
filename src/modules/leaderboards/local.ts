import {CommandInteraction} from 'discord.js';
import Mongoose from 'mongoose';
import Sentry from '../../sentry.js';
import {createLeaderboardEmbed, numberWithCommas, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Guilds from '../../database/guild/index.js';
import type {UserInterface} from '../../types/user';

export default async function localLeaderboard(interaction: CommandInteraction) {
  try {
    if (interaction.guildId == null) {
      throw new ResponseError('The command is only available in guilds');
    }

    const id: Mongoose.Schema.Types.Long = interaction.guild.id as unknown as Mongoose.Schema.Types.Long;
    const guild = await Guilds.findOne({id}).populate('users');
    const users = guild.users.sort((a: UserInterface, b: UserInterface) => b.money - a.money);

    // TODO: add a formatter for usernames/guild names
    const embed = createLeaderboardEmbed(
      ['#', 'Username', 'Gems'],
      users.map(({username, money}, index) => [(index + 1).toString(), username, numberWithCommas(money)])
    ).setTitle(`${guild.name} Leaderboard`);

    interaction.reply({
      embeds: [embed],
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
