import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../interactions/commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, GameSubCommandNames} from '../../lib/constants.js';
import spinWheel from './spin.js';
import spinSlots from './slots.js';

commands.on(CommandNames.GAMES, (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case GameSubCommandNames.SPIN:
      spinWheel(interaction);
      break;
    case GameSubCommandNames.SLOTS:
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
