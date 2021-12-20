import ResponseError from '../../utils/error.js';
import {Defaults} from '../../constants.js';
import {Item} from '../../items.js';

export function buy(item: Item, amount: number) {
  const totalCost = item.price * amount;

  if (totalCost > this.gems) {
    throw new ResponseError(`You do not have enough gems for this purchase`);
  }

  if (amount + this.inventory.length > Defaults.MAX_SLOTS) {
    throw new ResponseError(`You do not have enough slots to complete this purchase`);
  }

  for (let i = 0; i < amount; i += 1) {
    this.inventory.add(item);
  }

  this.gems -= totalCost;
}

export function sell(item: Item, amount: number) {
  if (item == null) {
    throw new ResponseError(`Item does not exist`);
  }

  for (let i = 0; i < amount; i += 1) {
    if (!this.inventory.has(item.id)) {
      throw new ResponseError(`You do not own ${amount}x ${item.name}`);
    }

    this.inventory.rem(item.id);
  }

  this.gems += (item.price * amount) / 2;
}
