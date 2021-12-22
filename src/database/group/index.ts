import Mongoose from 'mongoose';
import type {UserInterface} from '../user/index.js';

export enum Roles {
  OWNER = 0,
  MODERATOR = 1 << 0,
}

export interface GroupInterface extends Mongoose.Document {
  name: string;
  users: {
    user: UserInterface;
    flags: number;
  }[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
}

const GroupSchema: Mongoose.Schema = new Mongoose.Schema<GroupInterface>({
  name: {type: String, required: true, index: {unique: true}},
  users: {
    type: [
      {
        flags: {type: Number, required: true, default: 0},
        user: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    default: [],
  },
});

export default Mongoose.model<GroupInterface>('Group', GroupSchema);
