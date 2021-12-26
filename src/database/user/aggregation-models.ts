/* eslint-disable import/prefer-default-export */
import Mongoose from 'mongoose';
import type {TopGemsUserInterface} from '../../types/user';

const topUserMoneySchema = new Mongoose.Schema<TopGemsUserInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  avatar: {type: String, required: false},
  money: {type: Number, default: 10000, min: 0},
});

export const TopUserMoneyModel = Mongoose.model<TopGemsUserInterface>(
  'top_user_money',
  topUserMoneySchema,
  'top_user_money'
);
