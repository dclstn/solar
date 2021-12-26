import Mongoose from 'mongoose';
import type {GroupInterface, GroupModelInterface} from '../../types/group.js';
import {Roles} from '../../utils/enums.js';
import * as methods from './methods.js';
import * as statics from './statics.js';

const GroupSchema: Mongoose.Schema = new Mongoose.Schema<GroupInterface>({
  name: {type: String, required: true, index: {unique: true}},
  money: {type: Number, required: true, default: 0},
  users: {
    type: [
      {
        role: {type: Number, required: true, default: Roles.USER},
        user: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    default: [],
    _id: false,
  },
});

GroupSchema.methods = methods;
GroupSchema.statics = statics;

export default Mongoose.model<GroupInterface, GroupModelInterface>('Group', GroupSchema);
