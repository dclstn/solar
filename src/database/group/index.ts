import Mongoose from 'mongoose';
import type {GroupInterface} from '../../types/group.js';
import {Roles} from '../../utils/enums.js';
import * as methods from './methods.js';

const GroupSchema: Mongoose.Schema = new Mongoose.Schema<GroupInterface>({
  name: {type: String, required: true, index: {unique: true}},
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
  },
});

GroupSchema.methods = methods;

export default Mongoose.model<GroupInterface>('Group', GroupSchema);
