import {Defaults} from '../../constants.js';
import {findById, Item} from '../../items.js';

export function buyItem(item: Item, amount: number) {
  const totalCost = item.price * amount;

  if (totalCost > this.gold) {
    throw new Error(`You do not have enough gold for this purchase`);
  }

  if (amount + this.inventory.length > Defaults.MAX_SLOTS) {
    throw new Error(`You do not have enough slots to complete this purchase`);
  }

  for (let i = 0; i < amount; i += 1) {
    this.inventory.push({id: item.id, purchased: new Date()});
  }

  this.gold -= totalCost;
}

export function sellItem(item: Item, amount: number) {
  if (item == null) {
    throw new Error(`Item does not exist`);
  }

  for (let i = 0; i < amount; i += 1) {
    if (this.inventory.find(({id}) => item.id === id) == null) {
      throw new Error(`You do not own ${amount}x ${item.name}`);
    }

    this.inventory.splice(i, 1);
  }

  this.gold += (item.price * amount) / 2;
}

export function fetchInventory(): Item[] {
  return this.inventory.map(({id}) => findById(id));
}

export function totalGoldPerHour(): number {
  return this.fetchInventory().reduce((a: number, {gph}) => a + gph, 0);
}

export function hasItem(item: Item): boolean {
  return this.inventory.find(({id}) => id === item.id);
}
