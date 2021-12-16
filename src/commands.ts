import {CommandInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Command} from 'types/command';
import {Routes} from 'discord-api-types/v9';
import rest from './rest.js';
import client from './client.js';

class Commands extends EventEmitter {
  commands: Map<string, Command>;

  constructor() {
    super();
    this.commands = new Map();

    client.on('interactionCreate', (interaction: CommandInteraction) => {
      this.emit(interaction.commandName, interaction);
    });
  }

  getCommands() {
    return this.commands;
  }

  registerCommand(command: Command): void {
    if (this.commands.has(command.name)) {
      throw new Error(`Command name '${command.name}' is already registered.`);
    }

    this.commands.set(command.name, command);
  }

  async reloadApplicationCommands(): Promise<void> {
    const commands = Array.from(this.commands.values()).map((command: Command) => ({
      name: command.name,
      description: command.description,
      options: command.options,
    }));

    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {body: commands});
  }
}

export default new Commands();
