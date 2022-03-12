import {FastifyReply} from 'fastify';
import stripe from '../../stripe.js';
import {ENDPOINT, PaymentIds} from '../../constants.js';

export default (fastify, opts, done) => {
  // fastify.post(
  //   '/api/create-checkout-session',
  //   {preValidation: [fastify.authenticate]},
  //   async (request, response: FastifyReply) => {
  //     const {quantity} = request.body;

  //     const session = await stripe.checkout.sessions.create({
  //       line_items: [{price: PaymentIds.TEST_BUTTLOAD_OF_GEMS, quantity}],
  //       client_reference_id: request.user.id,
  //       mode: 'payment',
  //       success_url: `${ENDPOINT}/payment/success`,
  //       cancel_url: `${ENDPOINT}/payment/cancel`,
  //     });

  //     response.send({redirect_url: session.url});
  //   }
  // );

  fastify.get('/api/products', async (_, response: FastifyReply) => {
    const [products, prices] = await Promise.all([stripe.products.list(), stripe.prices.list()]);

    const data = products.data
      .filter((product) => product.active)
      .map(({id, description, name, metadata}) => {
        const price = prices.data.find(({product}) => product === id);

        return {
          id: price.id,
          description,
          name,
          metadata,
          price: price.unit_amount,
        };
      });

    response.send(data).status(200);
  });

  done();
};
