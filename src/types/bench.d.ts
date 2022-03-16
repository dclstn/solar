import {User} from 'discord.js';
import Mongoose from 'mongoose';

export interface RecipeInterface {
  recipeId: string;
  endDate: Date;
}

export interface BenchInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  tasks: RecipeInterface[];
  maxTasks: number;
  addTask(recipeId): Promise<void>;
  checkTasks(): Promise<void>;
}

export interface BenchModelInterface extends Mongoose.Model<BenchInterface> {
  get(user: User): Promise<BenchInterface>;
}
