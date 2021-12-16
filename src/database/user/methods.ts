import {Item} from 'items.js';
import client from '../../client.js';
import constants from '../../constants.js';

export async function buyItem(item: Item, amount: number): Promise<void> {
  const totalCost = item.price * amount;

  if (totalCost > this.gold) {
    throw new Error(`You do not have enough gold for this purchase`);
  }

  if (amount + this.inventory.length > constants.MAX_SLOTS) {
    throw new Error(`You do not have enough slots to complete this purchase`);
  }

  for (let i = 0; i < amount; i += 1) {
    this.inventory.push({id: item.id, purchased: new Date()});
  }

  this.gold -= totalCost;
}

export async function sellItem(id: string) {
  const user = await client.users.fetch(id);
  return this.getUser(user);
}
