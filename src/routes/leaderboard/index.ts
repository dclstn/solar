import type {FastifyRequest, FastifyReply} from 'fastify';
import {TopCPHUserModel, TopUserMoneyModel} from '../../database/user/aggregation-models.js';

const types = {
  CPH: 'cph',
  MONEY: 'money',
};

export default (fastify, opts, done) => {
  fastify.get('/api/leaderboards', async (request: FastifyRequest, response: FastifyReply) => {
    const {type}: any = request.query;

    let users = null;
    switch (type) {
      case types.MONEY:
        users = await TopUserMoneyModel.find({}).lean().limit(10);
        break;
      case types.CPH:
      default:
        users = await TopCPHUserModel.find({}).lean().limit(10);
        break;
    }

    response.send({users});
  });

  done();
};
