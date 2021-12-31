import type {FastifyRequest, FastifyReply} from 'fastify';
import App from '../../server.js';

App.get('/api/users', {preValidation: [App.authenticate]}, (request: FastifyRequest, response: FastifyReply) => {
  console.log(response);
});
