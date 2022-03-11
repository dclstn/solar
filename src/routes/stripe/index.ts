import Stripe from 'stripe';
import dotenv from 'dotenv';
import {FastifyReply} from 'fastify';
import {ENDPOINT, PaymentIds} from '../../constants.js';
import {handlePurchase} from './payment.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY, {apiVersion: '2020-08-27'});

export default (fastify, opts, done) => {
  fastify.addContentTypeParser('application/json', {parseAs: 'buffer'}, (_req, body, next) => {
    try {
      const newBody = {raw: body};
      next(null, newBody);
    } catch (error) {
      error.statusCode = 400;
      next(error, undefined);
    }
  });

  fastify.post(
    '/api/create-checkout-session',
    {preValidation: [fastify.authenticate]},
    async (request, response: FastifyReply) => {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: PaymentIds.GIFTS.FIVE,
            quantity: 1,
          },
        ],
        client_reference_id: request.user.id,
        mode: 'payment',
        success_url: `${ENDPOINT}/payment/success`,
        cancel_url: `${ENDPOINT}/payment/cancel`,
      });

      response.send({url: session.url});
    }
  );

  fastify.post('/webhook', async (request, response: FastifyReply) => {
    const sig = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(request.body.raw, sig, process.env.PAYMENT_ENDPOINT);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      // @ts-ignore
      await handlePurchase[PaymentIds.GIFTS.FIVE](event.data.object.client_reference_id);
    }

    response.status(200);
  });

  done();
};
