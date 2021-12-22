import Mongoose from 'mongoose';
import {UserInterface} from '../user/index.js';

export interface GroupInterface extends Mongoose.Document {
  name: string;
  owner: UserInterface;
  users: UserInterface[];
}
