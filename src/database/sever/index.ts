import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import type {ServerInterface} from '../../types/server';

mongooseLong(Mongoose);

const ServerSchema: Mongoose.Schema = new Mongoose.Schema<ServerInterface>({
  guildId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  name: {type: String},
  memberCount: {type: Number},
  preferredLocale: {type: String},
  owner: {type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
  users: [{type: Mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

export default Mongoose.model<ServerInterface>('Server', ServerSchema);
