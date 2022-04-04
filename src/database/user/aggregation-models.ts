/* eslint-disable import/prefer-default-export */
import Mongoose from 'mongoose';
import connection from '../connection.js';
import type {VirtualUserInterface, TopGemsUserInterface, TopCPHUserInterface} from '../../types/user';

const TopUserMoneySchema = new Mongoose.Schema<TopGemsUserInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  avatar: {type: String, required: false},
  money: {type: Number, default: 3, min: 0},
});

export const TopUserMoneyModel = connection.model<TopGemsUserInterface>(
  'top_user_money',
  TopUserMoneySchema,
  'top_user_money'
);

const VirtualUserSchema = new Mongoose.Schema<VirtualUserInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  avatar: {type: String, required: false},
  cph: {type: Number, default: 3, min: 0},
});

export const VirtualUserModel = connection.model<VirtualUserInterface>(
  'virtual_user',
  VirtualUserSchema,
  'virtual_user'
);

const TopCPHUserSchema = new Mongoose.Schema<TopCPHUserInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  avatar: {type: String, required: false},
  cph: {type: Number, default: 3, min: 0},
});

export const TopCPHUserModel = connection.model<TopCPHUserInterface>('top_user_cph', TopCPHUserSchema, 'top_user_cph');
