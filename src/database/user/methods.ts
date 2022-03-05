import moment from 'moment';
import Fuse from 'fuse.js';
import flatten from 'lodash.flatten';
import uniqby from 'lodash.uniqby';
import ResponseError from '../../utils/error.js';
import {Defaults} from '../../constants.js';
import {Chances, Item, ItemRarities, Items} from '../../utils/items.js';
import type {InventoryInterface} from '../../types/user.js';
import type {ItemInterface} from '../../types/item.js';
import type {GroupInterface} from '../../types/group.js';
import {InventoryType} from '../../utils/enums.js';
import {secureMathRandom} from '../../utils/misc.js';

export function add(item: Item, amount: number) {
  if (amount > this.totalFree()) {
    throw new ResponseError(`Not enough slots to complete this transaction`);
  }

  const inventories = this.inventories[Symbol.iterator]();
  let inventory = inventories.next();

  for (let i = 0; i < amount; i += 1) {
    if (inventory.value.items.length === Defaults.MAX_SLOTS) {
      inventory = inventories.next();
    }

    inventory.value.add(item);
  }
}

export function buy(item: Item, amount: number) {
  if (item == null) {
    throw new ResponseError('Could not find item you specified');
  }

  const totalCost = item.price * amount;

  if (totalCost > this.money) {
    throw new ResponseError(`You do not have enough gems for this purchase`);
  }

  this.add(item, amount);

  this.money -= totalCost;
}

export function has(item: Item): boolean {
  const inventories = this.inventories[Symbol.iterator]();
  let inventory = inventories.next();

  while (!inventory.value.has(item)) {
    inventory = inventories.next();

    if (inventory.value == null) {
      return false;
    }
  }

  return true;
}

// TODO: build this out
export function unbox(item: Item): Item {
  this.rem(item, 1);

  const rand = secureMathRandom();
  const lowestKey = Object.entries(Chances).reduce(
    (lowest, [key, chance]) => (rand < chance ? key : lowest),
    ItemRarities.COMMON
  );
  // eslint-disable-next-line eqeqeq
  const pool = Object.values(Items).filter(({rarity}) => rarity == lowestKey);
  const unboxed = pool[Math.floor(secureMathRandom() * pool.length)];

  this.add(unboxed, 1);
  this.set('exp', this.exp + 10);

  return unboxed;
}

export function rem(item: Item, amount: number) {
  const inventories = this.inventories[Symbol.iterator]();
  let inventory = inventories.next();

  for (let i = 0; i < amount; i += 1) {
    while (!inventory.value.has(item)) {
      inventory = inventories.next();

      if (inventory.value == null) {
        throw new ResponseError(`You do not own ${amount}x **${item.name}**`);
      }
    }

    inventory.value.rem(item);
  }
}

export function sell(item: Item, amount: number) {
  if (item == null) {
    throw new ResponseError('Could not find item you specified');
  }

  this.rem(item, amount);
  this.money += (item.price * amount) / 2;
}

export function sort(fn: (a: ItemInterface, b: ItemInterface) => number) {
  this.inventories.forEach((inventory) => inventory.sort(fn));
}

export function getInventory(find: number) {
  return this.inventories.find(({type}) => type === find);
}

export function totalUsed() {
  return this.inventories.reduce((a: number, b: InventoryInterface) => a + b.items.length, 0);
}

export function totalFree() {
  return Defaults.MAX_SLOTS * this.inventories.length - this.totalUsed();
}

export function updateDoc() {
  const diffMinutes = moment(new Date()).diff(moment(this.updated), 'minutes');
  const earned = (this.getInventory(InventoryType.Main).gph() / 60) * diffMinutes;

  this.set('money', this.money + earned);
  this.set('updated', new Date());
}

export function deposit(group: GroupInterface, amount: number) {
  if (this == null || this.group == null) {
    throw new ResponseError('You do not belong to a group');
  }

  if (this.money < amount) {
    throw new ResponseError('You do not have that many gems');
  }

  group.set('money', group.money + amount);
  this.set('money', this.money - amount);

  return this;
}

export function search(term: string) {
  const lib = uniqby(flatten(this.inventories.map((inventory) => inventory.fetchAll())), 'id');
  const fuzzy = new Fuse(lib, {shouldSort: true, keys: ['name', 'type']});
  return fuzzy.search(term);
}
