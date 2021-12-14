import {User} from 'discord.js';
import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import * as statics from './statics.js';

mongooseLong(Mongoose);

export interface UserInterface extends Mongoose.Document {
  id: Mongoose.Schema.Types.Long;
  username: string;
  discriminator: string;
  avatar: string;
  flags: number;
  level: number;
  gems: number;
  inventory: Array<number>;
}

export interface UserModelInterface extends Mongoose.Model<UserInterface> {
  get(user: User): Promise<UserInterface>;
  getById(discordId: string): Promise<UserInterface>;
}

const UserSchema: Mongoose.Schema = new Mongoose.Schema<UserInterface, UserModelInterface>({
  id: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  discriminator: {type: String, required: true},
  avatar: {type: String, required: true},
  flags: {type: Number, required: false, default: 0},
  level: {type: Number, default: 0, min: 0},
  gems: {type: Number, default: 0, min: 0},
  inventory: {type: [Number], default: [0, 0, 0]},
});

UserSchema.statics = statics;

export default Mongoose.model<UserInterface, UserModelInterface>('User', UserSchema);
