import type {FastifyRequest, FastifyReply} from 'fastify';
import {Items} from '../../utils/items.js';

export default (fastify, opts, done) => {
  fastify.get('/api/items', async (request: FastifyRequest, response: FastifyReply) => {
    response.send({...Items});
  });

  done();
};
