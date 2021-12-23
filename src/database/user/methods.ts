import ResponseError from '../../utils/error.js';
import {Defaults} from '../../constants.js';
import {Item} from '../../items.js';
import {InventoryType} from '../../utils/enums.js';

export function buy(item: Item, amount: number) {
  const totalCost = item.price * amount;

  const inventory = this.getInventory(InventoryType.MAIN);

  if (totalCost > this.money) {
    throw new ResponseError(`You do not have enough gems for this purchase`);
  }

  if (amount + inventory.items.length > Defaults.MAX_SLOTS) {
    throw new ResponseError(`You do not have enough slots to complete this purchase`);
  }

  for (let i = 0; i < amount; i += 1) {
    inventory.add(item);
  }

  this.money -= totalCost;
}

export function sell(item: Item, amount: number) {
  if (item == null) {
    throw new ResponseError(`Item does not exist`);
  }

  const inventory = this.getInventory(InventoryType.MAIN);

  for (let i = 0; i < amount; i += 1) {
    if (!inventory.has(item)) {
      throw new ResponseError(`You do not own ${amount}x ${item.name}`);
    }

    inventory.rem(item);
  }

  this.money += (item.price * amount) / 2;
}

export function getInventory(find: number) {
  return this.inventories.find(({type}) => type === find);
}
