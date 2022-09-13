import Stripe from 'stripe';
import dotenv from 'dotenv';
import isProd from '../utils/enviroment.js';

dotenv.config();

export default new Stripe(isProd() ? process.env.STRIPE_KEY : process.env.STRIPE_TEST_KEY, {apiVersion: '2020-08-27'});
