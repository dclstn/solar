import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../commands.js';
import {Command} from '../../types/command';

class Ping implements Command {
  type: ApplicationCommandTypes.CHAT_INPUT;
  name: string;
  description: string;

  constructor() {
    this.name = 'ping';
    this.description = '🏓 replies with pong!';
    commands.on(this.name, this.run);
  }

  run(interaction: CommandInteraction): void {
    interaction.reply(`Pong 🏓!`);
  }
}

commands.registerCommand(new Ping());
