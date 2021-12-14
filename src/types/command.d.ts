import {CommandInteraction} from 'discord.js';

export interface Command {
  name: string;
  description: string;
  run(interaction: CommandInteraction): void;
}
