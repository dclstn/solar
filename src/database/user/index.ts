import {User} from 'discord.js';
import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import moment from 'moment';
import mongooseLeanMethods from 'mongoose-lean-methods';
import type {GroupInterface} from '../group/index.js';
import {ItemSchema, ItemInterface, Cords} from '../item/index.js';
import * as statics from './statics.js';
import * as methods from './methods.js';
import {Item} from '../../items.js';
import inventory from './inventory.js';

mongooseLong(Mongoose);

export interface InventoryInterface extends Mongoose.Types.Subdocument {
  items: ItemInterface[];
  add(item: Item, cords?: Cords): void;
  rem(item: Item | Cords): void;
  has(item: Item): boolean;
  fetch(cords: Cords): Item;
  fetchAll(): Item[];
  gph(): number;
}

export interface UserInterface extends Mongoose.Document {
  id: Mongoose.Schema.Types.Long;
  username: string;
  discriminator: string;
  avatar?: string;
  flags: number;
  level: number;
  money: number;
  group: GroupInterface;
  inventory: InventoryInterface;
  updated: Date;
  buy(item: Item, amount: number): void;
  sell(item: Item, amount: number): void;
}

export interface UserModelInterface extends Mongoose.Model<UserInterface> {
  get(user: User): Promise<UserInterface>;
  getById(discordId: string): Promise<UserInterface>;
}

const InventorySchema: Mongoose.Schema = new Mongoose.Schema<InventoryInterface>(
  {
    items: {
      type: [ItemSchema],
      default: [],
      validate: {
        validator: (value) => {
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
  inventory: {type: InventorySchema, required: true, default: () => ({})},
  group: {type: Mongoose.Schema.Types.ObjectId, ref: 'Group', default: null},
  updated: {type: Date, default: new Date()},
});

UserSchema.statics = statics;
UserSchema.methods = methods;
UserSchema.plugin(mongooseLeanMethods);

// eslint-disable-next-line prefer-arrow-callback
UserSchema.post<UserInterface>('init', function initCallback() {
  const diffMinutes = moment(new Date()).diff(moment(this.updated), 'minutes');
  this.money += (this.inventory.gph() / 60) * diffMinutes;
  this.updated = new Date();
});

export default Mongoose.model<UserInterface, UserModelInterface>('User', UserSchema);
