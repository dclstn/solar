import Mongoose from 'mongoose';
import type {UserInterface} from './user';

export interface GroupInterface extends Mongoose.Document {
  name: string;
  money: number;
  users: {
    user: UserInterface;
    role: number;
  }[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
}

export interface GroupModelInterface extends Mongoose.Model<UserInterface> {
  createGroup(user: UserInterface, name: string): Promise<GroupInterface>;
}
