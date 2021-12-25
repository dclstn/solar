import Mongoose from 'mongoose';
import type {UserInterface} from './user.js';

export interface GuildInterface extends Mongoose.Document {
  guildId: Mongoose.Schema.Types.Long;
  name: string;
  icon: string;
  memberCount: number;
  preferredLocale: string;
  owner: UserInterface;
  users: UserInterface[];
}
