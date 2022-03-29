import type {FastifyRequest, FastifyReply} from 'fastify';
import {TopUserMoneyModel} from '../../database/user/aggregation-models.js';

export default (fastify, opts, done) => {
  fastify.get('/api/leaderboards', async (request: FastifyRequest, response: FastifyReply) => {
    const users = await TopUserMoneyModel.find({}).limit(10);
    response.send({users});
  });

  done();
};
