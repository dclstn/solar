import Mongoose from 'mongoose';
import {Items} from '../../items.js';

export interface Cords {
  x: number;
  y: number;
}

export interface ItemInterface extends Mongoose.Types.Subdocument {
  id: string;
  purchased: Date;
  cords: Cords;
}

const CordsSchema: Mongoose.Schema = new Mongoose.Schema<Cords>({
  x: {type: Number, required: true, max: 5, min: 0},
  y: {type: Number, required: true, max: 5, min: 0},
});

export const ItemSchema: Mongoose.Schema = new Mongoose.Schema<ItemInterface>({
  id: {type: String, enum: Items.map(({id}) => id), required: true},
  purchased: {type: Date, required: true, default: new Date()},
  cords: {type: CordsSchema, required: true},
});
