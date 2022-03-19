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
  return this.topGG.lastVoted == null ? false : moment(this.topGG.lastVoted).add(12, 'hours').isBefore(new Date());
});

VoteSchema.virtual('discordBotList.hasVoted').get(function hasVoted() {
  return this.discordBotList.lastVoted == null
    ? false
    : moment(this.discordBotList.lastVoted).add(12, 'hours').isBefore(new Date());
});

VoteSchema.virtual('rewardable').get(function hasVoted() {
  return this.lastReward == null ? true : moment(this.lastReward).add(12, 'hours').isAfter(new Date());
});

export default connection.model<VotingInterface, VotingModelInterface>('Vote', VoteSchema);
