import Stripe from 'stripe';
import {FastifyReply} from 'fastify';
import stripe from '../../stripe.js';
import Order from '../../database/order/index.js';
import {FULLFILLMENTS} from './payment.js';
import User from '../../database/user/index.js';
import isProd from '../../utils/enviroment.js';
import Sentry from '../../sentry.js';

async function createOrder(session: Stripe.Checkout.Session) {
  const user = await User.findOne({discordId: session.client_reference_id});

  if (user == null) {
    throw new Error('Could not find user');
  }

  if (await Order.exists({id: session.id})) {
    return;
  }

  await Order.create({
    id: session.id,
    buyer: user._id,
    purchased: new Date(),
    payment_status: session.payment_status,
  });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {limit: 5});

  for await (const item of lineItems.data) {
    const fulfill = FULLFILLMENTS[item.price.id];

    if (fulfill == null) {
      throw new Error(`[Stripe]: Cannot fulfill price id ${item.price.id}`);
    }

    await fulfill(session);
  }

  await Order.updateOne({id: session.id}, {payment_status: session.payment_status});
}

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

  fastify.post('/webhooks/payment', async (request, response: FastifyReply) => {
    const sig = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body.raw,
        sig,
        isProd() ? process.env.STRIPE_WEBHOOK_KEY : process.env.STRIPE_TEST_WEBHOOK_KEY
      );
    } catch (err) {
      Sentry.captureException(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      // @ts-ignore
      const session: Stripe.Checkout.Session = event.data.object;

      await createOrder(session);

      if (session.payment_status === 'paid') {
        await fulfillOrder(session);
      }
    }

    response.code(200);
  });

  done();
};
