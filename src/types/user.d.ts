import {ColorResolvable, MessageOptions, User} from 'discord.js';
import Mongoose from 'mongoose';
import {InventoryType} from '../utils/enums.js';
import {Item} from '../utils/items.js';
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
  flags: number;
  level: number;
  exp: number;
  money: number;
  group: GroupInterface;
  inventories: InventoryInterface[];
  updated: Date;
  pvp: {
    enabled: boolean;
    updated: Date;
    canDisable: boolean;
  };
  email?: string;
  locale?: string;
  avatar?: string;
  colour?: ColorResolvable;
  buy(item: Item, amount: number): void;
  add(item: Item, amount: number): void;
  sell(item: Item, amount: number): void;
  rem(item: Item, amount: number): void;
  has(item: Item): boolean;
  move(from: InventoryType, to: InventoryType, item: Item, amount?: number): void;
  unbox(item: Item): Item;
  addFunds(amount: number): void;
  getInventory(type: InventoryType): InventoryInterface;
  sort(fn: (a: ItemInterface, b: ItemInterface) => number): void;
  deposit(group: GroupInterface, amount: number): void;
  search(term): Fuse.default.FuseResult<Item>[];
  updateDoc(): void;
  notify(content: MessageOptions): Promise<void>;
  updateBalance(amount: number): void;
  spinWheel(): Promise<boolean>;
}

export interface TopGemsUserInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  username: string;
  money: number;
  avatar?: string;
}

export interface UserModelInterface extends Mongoose.Model<UserInterface> {
  get(user: User, email?: string, locale?: string): Promise<UserInterface>;
  getById(discordId: string, email?: string, locale?: string): Promise<UserInterface>;
  upsert(id: string, email?: string, locale?: string): void;
}
