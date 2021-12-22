import Mongoose from 'mongoose';
import {Defaults} from '../../constants.js';
import {Items} from '../../items.js';

const max = Math.sqrt(Defaults.MAX_SLOTS);

export interface Cords {
  x: number;
  y: number;
}

export interface ItemInterface extends Mongoose.Types.Subdocument {
  id: string;
  purchased: Date;
  cords: {
    x: number;
    y: number;
  };
}

export const ItemSchema: Mongoose.Schema = new Mongoose.Schema<ItemInterface>(
  {
    id: {type: String, enum: Items.map(({id}) => id), required: true},
    purchased: {type: Date, required: true, default: new Date()},
    cords: {
      x: {type: Number, required: true, max, min: 0},
      y: {type: Number, required: true, max, min: 0},
    },
  },
  {
    _id: false,
  }
);
