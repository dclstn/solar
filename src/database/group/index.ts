import Mongoose, {Schema} from 'mongoose';
import {UserInterface} from '../user/index.js';

export interface GroupInterface extends Mongoose.Document {
  name: string;
  owner: UserInterface;
  users: UserInterface[];
  add(user: UserInterface): void;
  rem(user: UserInterface): void;
}

const GroupSchema: Mongoose.Schema = new Mongoose.Schema<GroupInterface>({
  name: {type: String, required: true, index: {unique: true}},
  owner: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  users: {type: [{type: Schema.Types.ObjectId, ref: 'User'}], default: []},
});

export default Mongoose.model<GroupInterface>('Group', GroupSchema);
