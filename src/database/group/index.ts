import Mongoose from 'mongoose';
import {UserInterface} from '../user/index.js';

export interface GroupInterface extends Mongoose.Document {
  name: string;
  owner: UserInterface;
  users: UserInterface[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
}

const UserSchema: Mongoose.Schema = new Mongoose.Schema<UserInterface>({
  id: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  discriminator: {type: String, required: true},
  avatar: {type: String, required: false},
  flags: {type: Number, required: false, default: 0},
  level: {type: Number, default: 0, min: 0},
  money: {type: Number, default: 10000, min: 0},
  updated: {type: Date, default: new Date()},
});

export default UserSchema;
