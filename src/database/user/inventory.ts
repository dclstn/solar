import {Defaults} from '../../constants.js';
import {findById, Item} from '../../items.js';
import {Cords} from '../item/index.js';

const o = Math.sqrt(Defaults.MAX_SLOTS);

export default {
  add(item: Item, cords?: Cords): void {
    this.items.push({
      id: item.id,
      purchased: Date.now(),
      cords: cords || this.next(),
    });
  },

  next(): Cords {
    let x = 0;
    let y = 0;
    let i = 0;

    while (this.fetch({x, y}) != null) {
      x = i % o;
      y = Math.floor(i / o);
      i += 1;
    }

    return {x, y};
  },

  fetch(cords: Cords): Item {
    return this.items.find(({cords: item}) => item.x === cords.x && item.y === cords.y);
  },

  rem(item: Item): void {
    this.items.splice(
      this.items.findIndex(({id}) => id === item.id),
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
