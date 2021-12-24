import Mongoose from 'mongoose';
import type {UserInterface} from './user.js';

export interface ServerInterface extends Mongoose.Document {
  guildId: Mongoose.Schema.Types.Long;
  name: string;
  memberCount: number;
  preferredLocale: string;
  owner: UserInterface;
  users: UserInterface[];
}
