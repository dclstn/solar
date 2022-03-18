import moment from 'moment';
import Mongoose from 'mongoose';
import {VotingInterface, VotingModelInterface} from '../../types/vote.js';
import connection from '../connection.js';
import * as methods from './methods.js';
import * as statics from './statics.js';

const VoteSchema: Mongoose.Schema = new Mongoose.Schema<VotingInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  topGG: {lastVoted: {type: Date}},
  discordBotList: {lastVoted: {type: Date}},
  lastReward: {type: Date},
});

VoteSchema.statics = statics;
VoteSchema.methods = methods;

VoteSchema.virtual('topGG.hasVoted').get(function hasVoted() {
  return this.topGG.lastVoted == null ? false : moment(this.topGG.lastVoted).diff(new Date(), 'day') < 1;
});

VoteSchema.virtual('discordBotList.hasVoted').get(function hasVoted() {
  return this.discordBotList.lastVoted == null
    ? false
    : moment(this.discordBotList.lastVoted).diff(new Date(), 'hours') < 12;
});

VoteSchema.virtual('rewardable').get(function hasVoted() {
  return this.lastReward == null ? true : moment(this.lastReward).diff(new Date(), 'day') > 1;
});

export default connection.model<VotingInterface, VotingModelInterface>('Vote', VoteSchema);
