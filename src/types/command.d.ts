import {CommandInteraction} from 'discord.js';

export interface CommandOptionChoice {
  name: string;
  value: string;
}

export interface CommandOption {
  name: string;
  type: number;
  description: string;
  required?: boolean;
  min_value?: number;
  max_value?: number;
  choices?: Array<CommandOptionChoice>;
}

export interface Command {
  type: number;
  name: string;
  description?: string;
  options?: Array<CommandOption>;
  run(interaction: CommandInteraction): void;
}
