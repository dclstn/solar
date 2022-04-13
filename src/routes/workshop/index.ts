import type {FastifyRequest, FastifyReply} from 'fastify';
import Mongoose from 'mongoose';
import jwtTokenInterface from '../../types/jwt.js';
import WorkBench from '../../database/workbench/index.js';

export default (fastify, opts, done) => {
  fastify.get(
    '/api/workbench',
    {preValidation: [fastify.authenticate]},
    async (request: FastifyRequest, response: FastifyReply) => {
      const user = request.user as jwtTokenInterface;
      const id = user.id as unknown as Mongoose.Schema.Types.Long;
      const workbench = await WorkBench.findOne({discordId: id});

      if (workbench == null) {
        response.status(404).send({message: 'Workbench not found'});
        return;
      }

      const {discordId, tasks} = workbench;

      response.send({
        workbench: {
          discordId: discordId.toString(),
          tasks,
        },
      });
    }
  );

  done();
};
