import commands from 'commands';
import {CommandInteraction} from 'discord.js';
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
    interaction.reply(this.id);
  }
}

commands.register(new Ping());
