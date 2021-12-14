import {CommandInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Command} from 'types/command';
import {Routes} from 'discord-api-types/v9';
import rest from './rest.js';
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

  async reload() {
    const commands = this.commands.map((command: Command) => ({
      name: command.name,
      description: command.description,
    }));

    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {body: commands});
  }
}

export default new Commands();
