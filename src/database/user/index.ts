import {User} from 'discord.js';
import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import moment from 'moment';
import {ItemSchema, ItemInterface, Cords} from '../item/index.js';
import * as statics from './statics.js';
import * as methods from './methods.js';
import {Item} from '../../items.js';
import {Defaults} from '../../constants.js';
import inventory from './inventory.js';

mongooseLong(Mongoose);

export interface InventoryInterface extends Mongoose.Types.Subdocument {
  items: ItemInterface[];
  size: number;
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
  gems: number;
  inventory: InventoryInterface;
  updated: Date;
  buy(item: Item, amount: number): void;
  sell(item: Item, amount: number): void;
}

export interface UserModelInterface extends Mongoose.Model<UserInterface> {
  get(user: User, lean?: boolean): Promise<UserInterface>;
  getById(discordId: string): Promise<UserInterface>;
}

const InventorySchema: Mongoose.Schema = new Mongoose.Schema<InventoryInterface>(
  {
    items: {type: [ItemSchema], default: []},
    size: {type: Number, default: Defaults.MAX_SLOTS},
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
  gems: {type: Number, default: 10000, min: 0},
  /* Mongoose recommends you set defaults by returning an empty object however typescript forbids this */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  inventory: {
    type: InventorySchema,
    required: true,
    default: () => ({}),
  },
  updated: {type: Date, default: new Date()},
});

UserSchema.statics = statics;
UserSchema.methods = methods;

// eslint-disable-next-line prefer-arrow-callback
UserSchema.post<UserInterface>('init', function initCallback() {
  const diffMinutes = moment(new Date()).diff(moment(this.updated), 'minutes');
  this.gems += (this.inventory.gph() / 60) * diffMinutes;
  this.updated = new Date();
});

export default Mongoose.model<UserInterface, UserModelInterface>('User', UserSchema);
