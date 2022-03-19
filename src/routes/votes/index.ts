/* eslint-disable no-prototype-builtins */
import type {FastifyRequest, FastifyReply} from 'fastify';
import dotenv from 'dotenv';
import Long from 'long';
import Vote from '../../database/vote/index.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

dotenv.config();

interface VotingInterface {
  user: string;
  id: string;
}

function getProvider(body: VotingInterface) {
  if (body.hasOwnProperty('user')) {
    return {
      id: 'topGG',
      discordId: body.user,
    };
  }

  if (body.hasOwnProperty('id')) {
    return {
      id: 'discordBotList',
      discordId: body.id,
    };
  }

  return null;
}

export default (fastify, opts, done) => {
  fastify.post('/webhooks/votes', async (request: FastifyRequest, response: FastifyReply) => {
    if (request.headers.authorization !== process.env.VOTING_AUTHORIZATION) {
      response.send(403);
      return;
    }

    const provider = getProvider(request.body as VotingInterface);

    if (provider == null) {
      response.send(400);
      return;
    }

    const vote = await Vote.get(Long.fromString(provider.discordId));
    await vote.addVote(provider.id);

    try {
      await vote.validateVotes();
    } catch (err) {
      if (!(err instanceof ResponseError)) {
        Sentry.captureException(err);
      }
    }

    response.send(200);
  });

  done();
};