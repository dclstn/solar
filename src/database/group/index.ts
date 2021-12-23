import Mongoose from 'mongoose';
import type {UserInterface} from '../user/index.js';
import * as methods from './methods.js';

export enum Roles {
  USER = 0,
  MODERATOR = 1,
  OWNER = 2,
}

export interface GroupInterface extends Mongoose.Document {
  name: string;
  users: {
    user: UserInterface;
    role: number;
  }[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
}

const GroupSchema: Mongoose.Schema = new Mongoose.Schema<GroupInterface>({
  name: {type: String, required: true, index: {unique: true}},
  users: {
    type: [
      {
        role: {type: Number, required: true, default: Roles.USER},
        user: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    default: [],
  },
});

GroupSchema.methods = methods;

export default Mongoose.model<GroupInterface>('Group', GroupSchema);
