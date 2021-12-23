import type {CommandInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Routes} from 'discord-api-types/v9';
import Sentry from './sentry.js';
import rest from './rest.js';
import client from './client.js';

interface Command {
  type: number;
  name: string;
  description?: string;
  options?: Array<unknown>;
}

class Commands extends EventEmitter {
  commands: Map<string, Command>;

  constructor() {
    super();
    this.commands = new Map();

    client.on('interactionCreate', (interaction: CommandInteraction) => {
      if (!interaction.isApplicationCommand()) return;

      Sentry.configureScope((scope) => {
        scope.setUser({
          id: interaction.user.id,
          username: interaction.user.username,
        });

        scope.setTag('interaction', 'command');

        this.emit(interaction.commandName, interaction);
      });
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
      type: command.type,
      name: command.name,
      description: command.description,
      options: command.options,
    }));

    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {body: commands});

    Sentry.addBreadcrumb({
      category: 'commands',
      message: 'Application commands were reloaded',
      level: Sentry.Severity.Info,
    });
  }
}

export default new Commands();
