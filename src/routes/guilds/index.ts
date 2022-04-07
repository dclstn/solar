import type {FastifyRequest, FastifyReply} from 'fastify';
import Mongoose from 'mongoose';
import type jwtTokenInterface from '../../types/jwt.js';
import User from '../../database/user/index.js';
import Guild from '../../database/guild/index.js';

export default (fastify, opts, done) => {
  fastify.get(
    '/api/guilds',
    {preValidation: [fastify.authenticate]},
    async (request: FastifyRequest, response: FastifyReply) => {
      const user = request.user as jwtTokenInterface;
      const id = user.id as unknown as Mongoose.Schema.Types.Long;
      const dbUser = await User.findOne({discordId: id});

      if (dbUser == null) {
        response.status(404).send({message: 'User not found'});
      }

      const guilds = await Guild.find({users: dbUser._id}).lean();

      response.send({
        guilds: guilds.map(({name, guildId, _id, icon}) => ({
          name,
          icon,
          guildId: guildId.toString(),
          _id,
        })),
      });
    }
  );

  done();
};
