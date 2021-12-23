import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import moment from 'moment';
import type {ItemInterface} from '../../types/item.js';
import * as statics from './statics.js';
import * as methods from './methods.js';
import inventory from './inventory.js';
import type {InventoryInterface, UserInterface, UserModelInterface} from '../../types/user.js';
import {InventoryType} from '../../utils/enums.js';
import {Defaults} from '../../constants.js';
import {Items} from '../../items.js';

const max = Math.sqrt(Defaults.MAX_SLOTS);

mongooseLong(Mongoose);

const ItemSchema: Mongoose.Schema = new Mongoose.Schema<ItemInterface>(
  {
    id: {type: String, enum: Items.map(({id}) => id), required: true},
    purchased: {type: Date, required: true, default: new Date()},
    cords: {
      x: {type: Number, required: true, max, min: 0},
      y: {type: Number, required: true, max, min: 0},
    },
  },
  {
    _id: false,
  }
);

const InventorySchema: Mongoose.Schema = new Mongoose.Schema<InventoryInterface>(
  {
    type: {type: Number, required: true},
    items: {
      type: [ItemSchema],
      default: [],
      validate: {
        validator: (value: [ItemInterface]) => {
          const allCords = value.map(({cords}) => `${cords.x}:${cords.y}`);
          return new Set(allCords).size === allCords.length;
        },
        message: 'Multiple items with duplicated coordinates',
      },
    },
  },
  {
    _id: false,
  }
);

InventorySchema.methods = inventory;

const UserSchema: Mongoose.Schema = new Mongoose.Schema<UserInterface, UserModelInterface>({
  id: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String, required: true},
  discriminator: {type: String, required: true},
  avatar: {type: String, required: false},
  flags: {type: Number, required: false, default: 0},
  level: {type: Number, default: 0, min: 0},
  money: {type: Number, default: 10000, min: 0},
  /* Mongoose recommends you set defaults by returning an empty object however typescript forbids this */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  inventories: {
    type: [InventorySchema],
    required: true,
    default: () => [
      {
        type: InventoryType.Main,
        items: [],
      },
      {
        type: InventoryType.Storage,
        items: [],
      },
    ],
  },
  group: {type: Mongoose.Schema.Types.ObjectId, ref: 'Group', default: null},
  updated: {type: Date, default: new Date()},
});

UserSchema.statics = statics;
UserSchema.methods = methods;

// eslint-disable-next-line prefer-arrow-callback
UserSchema.post<UserInterface>('init', function initCallback() {
  const diffMinutes = moment(new Date()).diff(moment(this.updated), 'minutes');
  this.money += (this.getInventory(InventoryType.Main).gph() / 60) * diffMinutes;
  this.updated = new Date();
});

export default Mongoose.model<UserInterface, UserModelInterface>('User', UserSchema);
