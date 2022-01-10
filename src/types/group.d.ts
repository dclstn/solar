import Mongoose from 'mongoose';
import {Roles} from '../utils/enums';
import type {UserInterface} from './user';

export interface GroupUserInterface {
  user: UserInterface;
  role: Roles;
}

export interface GroupInterface extends Mongoose.Document {
  name: string;
  money: number;
  users: GroupUserInterface[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
  getRole(user: UserInterface): Roles;
}

export interface GroupModelInterface extends Mongoose.Model<GroupInterface> {
  createGroup(user: UserInterface, name: string): Promise<GroupInterface>;
}
