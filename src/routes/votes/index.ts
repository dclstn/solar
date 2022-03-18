import type {FastifyRequest, FastifyReply} from 'fastify';
import dotenv from 'dotenv';
import Vote from '../../database/vote/index.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

dotenv.config();

interface TopGGBodyInterface {
  user: string;
}

interface DiscordBotListInterface {
  id: string;
}

export default (fastify, opts, done) => {
  fastify.post('/webhooks/votes', async (request: FastifyRequest, response: FastifyReply) => {
    if (request.headers.authorization !== process.env.VOTING_AUTHORIZATION) {
      response.send(400);
      return;
    }

    const {user} = request.body as TopGGBodyInterface;
    const vote = await Vote.get(user);

    try {
      await vote.addVote('topGG');
    } catch (err) {
      if (err instanceof ResponseError) {
        return;
      }

      Sentry.captureException(err);
    }

    response.send(200);
  });

  done();
};
