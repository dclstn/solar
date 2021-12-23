import Mongoose from 'mongoose';
import type {UserInterface} from './user';

export interface GroupInterface extends Mongoose.Document {
  name: string;
  users: {
    user: UserInterface;
    role: number;
  }[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
}
