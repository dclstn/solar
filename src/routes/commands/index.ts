import type {FastifyRequest, FastifyReply} from 'fastify';
import {CommandOptions, CommandNames, CommandDescriptions} from '../../constants.js';

const commands = Object.values(CommandNames).map((name) => ({
  name,
  description: CommandDescriptions[name],
  options: CommandOptions[name],
}));

export default (fastify, opts, done) => {
  fastify.get('/api/commands', async (request: FastifyRequest, response: FastifyReply) => {
    response.send({commands});
  });

  done();
};
