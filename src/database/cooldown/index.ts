import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import connection from '../connection.js';
import * as statics from './statics.js';
import {CoolDownModelInterface, CoolDownsInterface} from '../../types/cooldown.js';

mongooseLong(Mongoose);

const CooldownSchema: Mongoose.Schema = new Mongoose.Schema<CoolDownsInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  wheelSpin: {
    endDate: {type: Date},
    notified: {type: Boolean, default: false},
    shouldNotify: {type: Boolean, default: false},
  },
  voting: {
    endDate: {type: Date},
    notified: {type: Boolean, default: false},
    shouldNotify: {type: Boolean, default: false},
  },
});

CooldownSchema.statics = statics;

export default connection.model<CoolDownsInterface, CoolDownModelInterface>('Cooldown', CooldownSchema);
