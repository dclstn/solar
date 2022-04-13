import {FastifyReply} from 'fastify';
import stripe from '../../stripe.js';
import {ENDPOINT, PaymentIds} from '../../constants.js';

const Images = {
  [PaymentIds.BAG_OF_GEMS]: '/imgs/square_bag_gems.png',
  [PaymentIds.BUTTLOAD_OF_GEMS]: '/imgs/square_buttload_gems.png',
  [PaymentIds.CHEST_FULL_OF_GEMS]: '/imgs/square_chest_gems.png',
  [PaymentIds.HANDFUL_OF_GEMS]: '/imgs/square_handful_gems.png',
};

const Popular = {
  [PaymentIds.BAG_OF_GEMS]: false,
  [PaymentIds.BUTTLOAD_OF_GEMS]: false,
  [PaymentIds.CHEST_FULL_OF_GEMS]: true,
  [PaymentIds.HANDFUL_OF_GEMS]: false,
};

export default (fastify, opts, done) => {
  fastify.post(
    '/api/create-checkout-session',
    {preValidation: [fastify.authenticate]},
    async (request, response: FastifyReply) => {
      const {price_id} = request.body;

      const session = await stripe.checkout.sessions.create({
        line_items: [{price: price_id, quantity: 1}],
        client_reference_id: request.user.id,
        mode: 'payment',
        success_url: `${ENDPOINT}/payment/success`,
        cancel_url: `${ENDPOINT}/payment/cancel`,
      });

      response.send({redirect_url: session.url});
    }
  );

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
          image: Images[price.id],
          popular: Popular[price.id],
        };
      });

    response.send(data).status(200);
  });

  done();
};
