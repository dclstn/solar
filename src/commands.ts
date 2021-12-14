import {CommandInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Command} from 'types/command';
import client from './client.js';

class Commands extends EventEmitter {
  commands: Command[];

  constructor() {
    super();
    this.commands = [];

    client.on('interactionCreate', (interaction: CommandInteraction) => {
      this.emit(interaction.commandName, interaction);
    });
  }

  register(command: Command) {
    this.commands.push(command);
  }
}

export default new Commands();
