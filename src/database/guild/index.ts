import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import connection from '../connection.js';
import type {GuildInterface} from '../../types/guild';

mongooseLong(Mongoose);

const GuildSchema: Mongoose.Schema = new Mongoose.Schema<GuildInterface>({
  guildId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  name: {type: String},
  icon: {type: String},
  memberCount: {type: Number},
  preferredLocale: {type: String},
  owner: {type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
  users: [{type: Mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

export default connection.model<GuildInterface>('Guild', GuildSchema);
