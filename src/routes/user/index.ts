import type {FastifyRequest, FastifyReply} from 'fastify';
import Mongoose from 'mongoose';
import type jwtTokenInterface from '../../types/jwt.js';
import User from '../../database/user/index.js';

interface UserFetchInterface {
  discordId: string;
}

export default (fastify, opts, done) => {
  fastify.get(
    '/api/users',
    {preValidation: [fastify.authenticate]},
    async (request: FastifyRequest, response: FastifyReply) => {
      const user = request.user as jwtTokenInterface;
      const id = user.id as unknown as Mongoose.Schema.Types.Long;
      const dbUser = await User.findOne({discordId: id});

      const {username, avatar, money, funds, locale, inventories, colour, discordId} = dbUser;

      response.send({
        user: {
          discordId: discordId.toString(),
          username,
          avatar,
          money,
          funds,
          locale,
          inventories,
          colour,
        },
      });
    }
  );

  fastify.get('/api/users/:discordId', async (request: FastifyRequest, response: FastifyReply) => {
    const {discordId} = request.params as UserFetchInterface;
    const dbUser = await User.findOne({discordId});

    if (dbUser == null) {
      response.status(404).send({message: 'User not found'});
      return;
    }

    const {username, avatar, money, funds, locale, inventories, colour} = dbUser;

    response.send({
      user: {
        discordId,
        username,
        avatar,
        money,
        funds,
        locale,
        inventories,
        colour,
      },
    });
  });

  done();
};
