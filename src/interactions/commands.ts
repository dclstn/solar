import {CommandInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Routes} from 'discord-api-types/v9';
import {Context} from '@sentry/types';
import Sentry from '../lib/sentry.js';
import rest from '../lib/rest.js';
import client from '../lib/client.js';

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
}

export default new Commands();
