import {CommandInteraction} from 'discord.js';
import commands from '../commands.js';
import {Command} from '../types/command';

class Ping implements Command {
  id: string;
  name: string;
  description: string;

  constructor() {
    this.id = 'ping';
    this.name = 'Ping';
    this.description = 'replies with pong! 🏓';

    commands.on(this.id, this.run);
  }

  run(interaction: CommandInteraction): void {
    interaction.reply(`${this.id} Pong 🏓!`);
  }
}

commands.register(new Ping());
