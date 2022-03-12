import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import connection from '../connection.js';
import type {OrderInterface} from '../../types/order';

mongooseLong(Mongoose);

const OrderSchema: Mongoose.Schema = new Mongoose.Schema<OrderInterface>({
  id: {type: String, unique: true},
  buyer: {type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
  purchased: {type: Date, default: new Date()},
  // @ts-ignore
  payment_status: {type: String, default: 'unpaid'},
});

export default connection.model<OrderInterface>('Order', OrderSchema);
