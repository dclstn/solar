import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../interactions/commands.js';
import {CommandNames, CommandDescriptions} from '../../constants.js';

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.RAID,
  description: CommandDescriptions[CommandNames.RAID],
});
