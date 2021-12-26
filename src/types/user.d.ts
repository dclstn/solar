import {User} from 'discord.js';
import Mongoose from 'mongoose';
import {InventoryType} from '../utils/enums.js';
import {Item} from '../items.js';
import type {GroupInterface} from './group.js';
import type {ItemInterface, Cords} from './item.js';

export interface InventoryInterface extends Mongoose.Types.Subdocument {
  type: number;
  items: ItemInterface[];
  add(item: Item, cords?: Cords): void;
  rem(item: Item | Cords): void;
  has(item: Item): boolean;
  fetch(cords: Cords): Item;
  fetchAll(): Item[];
  gph(): number;
  sort(fn: (a: ItemInterface, b: ItemInterface) => number): void;
}

export interface UserInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  username: string;
  discriminator: string;
  avatar?: string;
  flags: number;
  level: number;
  exp: number;
  money: number;
  group: GroupInterface;
  inventories: InventoryInterface[];
  updated: Date;
  buy(item: Item, amount: number): void;
  sell(item: Item, amount: number): void;
  getInventory(type: InventoryType): InventoryInterface;
  sort(fn: (a: ItemInterface, b: ItemInterface) => number): void;
}

export interface TopGemsUserInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  username: string;
  money: number;
  avatar?: string;
}

export interface UserModelInterface extends Mongoose.Model<UserInterface> {
  get(user: User): Promise<UserInterface>;
  getById(discordId: string): Promise<UserInterface>;
}
