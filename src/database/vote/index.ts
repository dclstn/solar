import moment from 'moment';
import Mongoose from 'mongoose';
import {VotingInterface, VotingModelInterface} from '../../types/vote.js';
import connection from '../connection.js';
import * as methods from './methods.js';
import * as statics from './statics.js';

const VoteSchema: Mongoose.Schema = new Mongoose.Schema<VotingInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  topGG: {lastVoted: {type: Date, default: null}},
  discordBotList: {lastVoted: {type: Date, default: null}},
  lastReward: {type: Date, default: null},
});

VoteSchema.statics = statics;
VoteSchema.methods = methods;

VoteSchema.virtual('topGG.hasVoted').get(function hasVoted() {
  return this.topGG.lastVoted == null ? false : moment(new Date()).diff(this.topGG.lastVoted, 'hours') < 12;
});

VoteSchema.virtual('discordBotList.hasVoted').get(function hasVoted() {
  return this.discordBotList.lastVoted == null
    ? false
    : moment(this.discordBotList.lastVoted).diff(new Date(), 'hours') < 12;
});

VoteSchema.virtual('rewardable').get(function hasVoted() {
  return this.lastReward == null ? true : moment(new Date()).diff(this.lastReward, 'hours') > 12;
});

export default connection.model<VotingInterface, VotingModelInterface>('Vote', VoteSchema);
