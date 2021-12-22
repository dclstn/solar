import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../constants.js';
import commands from '../../commands.js';

class Raid {
  constructor() {
    commands.on(CommandNames.RAID, this.startRaid);
  }

  startRaid(interaction: CommandInteraction): void {
    interaction.reply('raid started');
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.RAID,
  description: CommandDescriptions[CommandNames.RAID],
  options: CommandOptions[CommandNames.RAID],
});

export default new Raid();
