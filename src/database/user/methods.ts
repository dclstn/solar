import moment from 'moment';
import ResponseError from '../../utils/error.js';
import {Defaults} from '../../constants.js';
import {Item} from '../../items.js';
import type {InventoryInterface} from '../../types/user.js';
import type {ItemInterface} from '../../types/item.js';
import type {GroupInterface} from '../../types/group.js';
import {InventoryType} from '../../utils/enums.js';

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
  const totalCost = item.price * amount;

  if (totalCost > this.money) {
    throw new ResponseError(`You do not have enough gems for this purchase`);
  }

  this.add(item, amount);

  this.money -= totalCost;
}

export function has(item: Item) {
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
    throw new ResponseError(`Item does not exist`);
  }

  this.remove(item, amount);
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

  this.set('exp', this.exp + 1);
  this.set('money', this.money + earned);
  this.set('updated', new Date());
}

export function deposit(group: GroupInterface, amount: number) {
  if (this == null || this.group == null) {
    throw new ResponseError('You do not belong to a kingdom');
  }

  if (this.money < amount) {
    throw new ResponseError('You do not have that many gems');
  }

  group.set('money', group.money + amount);
  this.set('money', this.money - amount);

  return this;
}
