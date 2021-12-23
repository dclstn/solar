import Mongoose from 'mongoose';

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
