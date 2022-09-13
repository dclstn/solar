import {Defaults} from '../../lib/constants.js';
import {findById, Item} from '../../utils/items.js';
import type {Cords, ItemInterface} from '../../types/item.js';
import ResponseError from '../../utils/error.js';

const o = Math.sqrt(Defaults.MAX_SLOTS);

export default {
  add(item: Item, cords?: Cords): void {
    if (this.items.length >= Defaults.MAX_SLOTS) {
      throw new ResponseError('You do not have enough slots to perform this action');
    }

    this.items.push({
      id: item.id,
      purchased: Date.now(),
      cords: cords || this.next(),
    });
  },

  /* A fast way of determining the next available slot */
  next(): Cords {
    if (this.items.length === 0) {
      return {x: 0, y: 0};
    }

    this.items.sort(({cords: {x, y}}, {cords: {x: q, y: p}}) => x + y * o - (q + p * o));

    for (let j = 0; j < o; j += 1) {
      const r = j * o;
      for (let i = 0; i < o; i += 1) {
        const l = i + r;
        const f = this.items[l];
        if (!f || f.cords.x + f.cords.y * o !== l) {
          return {x: i, y: j};
        }
      }
    }

    return null;
  },

  sort(fn: (a: ItemInterface, b: ItemInterface) => number) {
    this.items.sort(fn);
    this.items = this.items.map((a: ItemInterface, index: number) => ({
      id: a.id,
      purchased: a.purchased,
      cords: {
        x: index % o,
        y: Math.floor(index / o),
      },
    }));
  },

  fetch(cords: Cords): Item {
    return this.items.find(({cords: item}) => item.x === cords.x && item.y === cords.y);
  },

  rem(item: Item): void {
    if (!this.has(item)) {
      throw new ResponseError('Could not find item');
    }

    this.items.splice(
      this.items.findIndex(({id}) => id === item.id),
      1
    );
  },

  has(item: Item): boolean {
    return this.items.find(({id}) => id === item.id) != null;
  },

  fetchAll(): Item[] {
    return this.items.map(({id}) => findById(id));
  },

  calcCPH() {
    return this.fetchAll().reduce((a: number, {gph}) => a + (gph || 0), 0);
  },
};
