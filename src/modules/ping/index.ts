import type {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions} from '../../constants.js';
import commands from '../../commands.js';

class Ping {
  constructor() {
    commands.on(CommandNames.PING, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    interaction.reply('🏓 Pong!');
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.PING,
  description: CommandDescriptions[CommandNames.PING],
});

export default new Ping();
