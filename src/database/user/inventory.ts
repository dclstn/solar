import {findById, Item} from '../../items.js';
import {Cords} from '../item/index.js';

export default {
  add(item: Item, cords?: Cords): void {
    this.items.push({
      id: item.id,
      purchased: Date.now(),
      cords: cords || {x: 0, y: 0},
    });
  },

  fetch(cords: Cords): Item {
    return this.items.find(({cords: itemCords}) => itemCords === cords);
  },

  rem(item: Item): void {
    this.items.splice(
      this.items.indexOf(({id}) => id === item.id),
      1
    );
  },

  has(item: Item): boolean {
    return this.items.find(({id}) => id === item.id);
  },

  gph(): number {
    return this.fetchAll().reduce((a: number, {gph}) => a + gph, 0);
  },

  fetchAll(): Item[] {
    return this.items.map(({id}) => findById(id));
  },
};
