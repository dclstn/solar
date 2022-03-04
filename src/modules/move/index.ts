import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../constants.js';
import commands from '../../commands.js';

commands.on(CommandNames.MOVE, (interaction: CommandInteraction) => {
  interaction.reply('WIP');
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.MOVE,
  description: CommandDescriptions[CommandNames.MOVE],
  options: CommandOptions[CommandNames.MOVE],
});
