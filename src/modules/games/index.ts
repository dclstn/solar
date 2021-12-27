import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, GameSubCommandNames} from '../../constants.js';
import rollDice from './roll.js';

commands.on(CommandNames.GAMES, (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case GameSubCommandNames.ROLL:
      rollDice(interaction);
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
