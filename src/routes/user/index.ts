import type {FastifyRequest, FastifyReply} from 'fastify';
import Mongoose from 'mongoose';
import type jwtTokenInterface from '../../types/jwt.js';
import User from '../../database/user/index.js';

export default (fastify, opts, done) => {
  fastify.get(
    '/api/users',
    {preValidation: [fastify.authenticate]},
    async (request: FastifyRequest, response: FastifyReply) => {
      const user = request.user as jwtTokenInterface;
      const id = user.id as unknown as Mongoose.Schema.Types.Long;
      const dbUser = await User.findOne({discordId: id});

      const {username, avatar, money, funds, locale, inventories, discordId} = dbUser;

      response.send({
        user: {
          discordId: discordId.toString(),
          username,
          avatar,
          money,
          funds,
          locale,
          inventories,
        },
      });
    }
  );

  done();
};
