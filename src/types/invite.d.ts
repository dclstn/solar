import Mongoose from 'mongoose';
import {GroupInterface} from './group.js';
import type {UserInterface} from './user.js';

export interface InviteInterface extends Mongoose.Document {
  group: GroupInterface;
  referer: UserInterface;
  target: UserInterface;
}
