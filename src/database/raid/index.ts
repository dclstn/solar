import Mongoose from 'mongoose';
import moment from 'moment';
import mongooseLong from 'mongoose-long';
import connection from '../connection.js';
import * as statics from './statics.js';
import {RaidInterface, RaidModelInterface} from '../../types/raid.js';

mongooseLong(Mongoose);

const RaidSchema: Mongoose.Schema = new Mongoose.Schema<RaidInterface>({
  discordId: {
    type: Mongoose.Schema.Types.Long,
    required: true,
    index: {unique: true},
  },
  lastRaid: {type: Date},
  lastRaided: {type: Date},
});

RaidSchema.virtual('canRaid').get(function canRaid() {
  return this.lastRaid == null ? true : moment(this.lastRaid).add(1, 'hours').isBefore(new Date());
});

RaidSchema.virtual('isRaidable').get(function isRaidable() {
  return this.lastRaided == null ? true : moment(this.lastRaided).add(1, 'hours').isBefore(new Date());
});

RaidSchema.statics = statics;

export default connection.model<RaidInterface, RaidModelInterface>('Raid', RaidSchema);
