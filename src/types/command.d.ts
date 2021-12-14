import {CommandInteraction} from 'discord.js';

export interface Command {
  id: string;
  name: string;
  description: string;
  run(interaction: CommandInteraction): void;
}
