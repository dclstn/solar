import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
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
    id: {type: String, enum: Object.values(Items).map(({id}) => id), required: true},
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
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  username: {type: String},
  discriminator: {type: String},
  avatar: {type: String, default: null},
  flags: {type: Number, required: false, default: 0},
  exp: {type: Number, default: 0, min: 0},
  money: {type: Number, default: 10000, min: 0},
  email: {type: String},
  locale: {type: String, default: 'en-GB'},
  colour: {type: String},
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

UserSchema.virtual('level').get(function calcLevel() {
  return Math.floor(Math.sqrt(this.exp));
});

// eslint-disable-next-line prefer-arrow-callback
UserSchema.post<UserInterface>('init', function initCallback() {
  this.updateDoc();
});

// eslint-disable-next-line prefer-arrow-callback
UserSchema.post('aggregate', function postCallback(docs, next) {
  docs.forEach((doc: UserInterface) => doc.updateDoc());
  next();
});

export default Mongoose.model<UserInterface, UserModelInterface>('User', UserSchema);
