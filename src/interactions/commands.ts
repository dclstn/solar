import type {CommandInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Routes} from 'discord-api-types/v9';
import {Context} from '@sentry/types';
import Sentry from '../sentry.js';
import rest from '../rest.js';
import client from '../client.js';

export interface Command {
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

    setTimeout(() => {
      this.reloadApplicationCommands();
    }, 10000);

    client.on('interactionCreate', (interaction: CommandInteraction) => {
      if (!interaction.isApplicationCommand()) return;

      Sentry.configureScope((scope) => {
        scope.setUser({
          id: interaction.user.id,
          username: interaction.user.username,
        });

        scope.setTag('interaction_type', 'command');
        scope.setContext('interaction', interaction.toJSON() as Context);

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

  async reloadApplicationCommands(global = false): Promise<void> {
    const commands = Array.from(this.commands.values()).map((command: Command) => ({
      type: command.type,
      name: command.name,
      description: command.description,
      options: command.options,
    }));

    if (global) {
      await rest.put(Routes.applicationCommands(client.user.id), {body: commands});
    } else {
      await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {body: commands});
    }

    Sentry.addBreadcrumb({
      category: 'commands',
      message: 'Application commands were reloaded',
      level: Sentry.Severity.Info,
    });
  }
}

export default new Commands();
