import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import connection from '../connection.js';
import {LootboxInterface, LootboxModelInterface} from '../../types/lootbox';
import * as statics from './statics.js';

mongooseLong(Mongoose);

const LootboxSchema: Mongoose.Schema = new Mongoose.Schema<LootboxInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  totalUnboxed: {type: Number, default: 0},
});

LootboxSchema.statics = statics;

export default connection.model<LootboxInterface, LootboxModelInterface>('Lootbox', LootboxSchema);
