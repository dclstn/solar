/* eslint-disable import/prefer-default-export */
import Stripe from 'stripe';
import {PaymentIds} from '../../constants.js';
import User from '../../database/user/index.js';

export const FULLFILLMENTS = {
  [PaymentIds.HANDFUL_OF_GEMS]: async (session: Stripe.Checkout.Session) => {
    const user = await User.findOne({discordId: session.client_reference_id});
    user.addFunds(100);
    await user.save();
  },
  [PaymentIds.HANDFUL_OF_GEMS]: async (session: Stripe.Checkout.Session) => {
    const user = await User.findOne({discordId: session.client_reference_id});
    user.addFunds(300);
    await user.save();
  },
  [PaymentIds.BAG_OF_GEMS]: async (session: Stripe.Checkout.Session) => {
    const user = await User.findOne({discordId: session.client_reference_id});
    user.addFunds(900);
    await user.save();
  },
  [PaymentIds.BUTTLOAD_OF_GEMS]: async (session: Stripe.Checkout.Session) => {
    const user = await User.findOne({discordId: session.client_reference_id});
    user.addFunds(2000);
    await user.save();
  },
  [PaymentIds.TEST_BUTTLOAD_OF_GEMS]: async (session: Stripe.Checkout.Session) => {
    const user = await User.findOne({discordId: session.client_reference_id});
    user.addFunds(2000);
    await user.save();
  },
};
