import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import connection from '../connection.js';
import type {InviteInterface} from '../../types/invite';

mongooseLong(Mongoose);

const InviteSchema: Mongoose.Schema = new Mongoose.Schema<InviteInterface>({
  group: {type: Mongoose.Schema.Types.ObjectId, ref: 'Group'},
  referer: {type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
  target: {type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
});

export default connection.model<InviteInterface>('Invite', InviteSchema);
