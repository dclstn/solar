import {User} from 'discord.js';
import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import {ItemSchema, ItemInterface} from '../item/index.js';
import * as statics from './statics.js';
import * as methods from './methods.js';
import {Item} from '../../items.js';

mongooseLong(Mongoose);

export interface UserInterface extends Mongoose.Document {
  id: Mongoose.Schema.Types.Long;
  username: string;
  discriminator: string;
  avatar?: string;
  flags: number;
  level: number;
  gems: number;
  gold: number;
  inventory: Array<ItemInterface>;
  updated: Date;
  buyItem(item: Item, amount: number): Promise<void>;
  sellItem(itemId: string): Promise<void>;
}

export interface UserModelInterface extends Mongoose.Model<UserInterface> {
  get(user: User): Promise<UserInterface>;
  getById(discordId: string): Promise<UserInterface>;
}

const UserSchema: Mongoose.Schema = new Mongoose.Schema<UserInterface, UserModelInterface>({
  id: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  discriminator: {type: String, required: true},
  avatar: {type: String, required: false},
  flags: {type: Number, required: false, default: 0},
  level: {type: Number, default: 0, min: 0},
  gems: {type: Number, default: 0, min: 0},
  gold: {type: Number, default: 0, min: 0},
  inventory: {type: [ItemSchema], default: []},
  updated: {type: Date, default: new Date()},
});

UserSchema.statics = statics;
UserSchema.methods = methods;

export default Mongoose.model<UserInterface, UserModelInterface>('User', UserSchema);
