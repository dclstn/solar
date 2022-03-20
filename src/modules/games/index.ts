import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../interactions/commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, GameSubCommandNames} from '../../constants.js';
import rollDice from './roll.js';
import spinSlots from './spin.js';

commands.on(CommandNames.GAMES, (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case GameSubCommandNames.ROLL:
      rollDice(interaction);
      break;
    case GameSubCommandNames.SPIN:
      spinSlots(interaction);
      break;
    default:
      break;
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.GAMES,
  description: CommandDescriptions[CommandNames.GAMES],
  options: CommandOptions[CommandNames.GAMES],
});
