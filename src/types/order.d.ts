import Mongoose from 'mongoose';
import type Stripe from 'stripe';
import type {UserInterface} from './user';

export interface OrderInterface extends Mongoose.Document {
  id: string;
  buyer: UserInterface;
  purchased: Date;
  payment_status: Stripe.Checkout.Session.PaymentStatus;
}
