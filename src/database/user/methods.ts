import {Item} from 'items.js';
import client from '../../client.js';

export async function buyItem(item: Item, amount: number): Promise<void> {
  this.inventory.push({
    id: item.id,
    purchased: new Date(),
  });

  return this.save();
}

export async function sellItem(id: string) {
  const user = await client.users.fetch(id);
  return this.getUser(user);
}
