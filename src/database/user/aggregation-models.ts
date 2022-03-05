/* eslint-disable import/prefer-default-export */
import Mongoose from 'mongoose';
import connection from '../connection.js';
import type {TopGemsUserInterface} from '../../types/user';

const TopUserMoneySchema = new Mongoose.Schema<TopGemsUserInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  avatar: {type: String, required: false},
  money: {type: Number, default: 10000, min: 0},
});

export const TopUserMoneyModel = connection.model<TopGemsUserInterface>(
  'top_user_money',
  TopUserMoneySchema,
  'top_user_money'
);
