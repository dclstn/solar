import Mongoose from 'mongoose';
import {Items} from '../../items.js';

export interface ItemInterface extends Mongoose.Document {
  id: string;
  purchased: Date;
}

export const ItemSchema: Mongoose.Schema = new Mongoose.Schema<ItemInterface>({
  id: {
    type: String,
    enum: Items.map(({id}) => id),
    required: true,
  },
  purchased: {type: Date, required: true, default: new Date()},
});
