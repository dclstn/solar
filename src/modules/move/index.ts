import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../constants.js';
import commands from '../../commands.js';
import client from '../../client.js';

client.on('typingStart', console.log);

commands.on(CommandNames.MOVE, (interaction: CommandInteraction) => {
  interaction.reply('replied');
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.MOVE,
  description: CommandDescriptions[CommandNames.MOVE],
  options: CommandOptions[CommandNames.MOVE],
});
