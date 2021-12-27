import {CommandInteraction} from 'discord.js';
import {numberWithCommas, success, warning} from '../../utils/embed.js';

export default function rollDice(interaction: CommandInteraction) {
  const wager = interaction.options.getInteger('wager');
  const side = interaction.options.getInteger('side');

  const win = side === Math.floor(Math.random() * 6 + 1);

  if (win) {
    interaction.reply({
      ephemeral: true,
      embeds: [success(`You won ${numberWithCommas(wager)}!`)],
    });
  } else {
    interaction.reply({
      ephemeral: true,
      embeds: [warning(`You lost ${numberWithCommas(wager)}!`)],
    });
  }
}
