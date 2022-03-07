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
      const dbUser = await User.findOne({discordId: id}).select('username avatar money').lean();
      response.send({user: dbUser});
    }
  );

  done();
};
