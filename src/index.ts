/* eslint-disable no-console */
import Discord from 'discord.js';
import * as dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import {FastifyReply} from 'fastify';
import chalk from 'chalk';
import App from './server.js';
import Sentry from './sentry.js';

import authRoute from './routes/auth/index.js';
import stripeRoute from './routes/stripe/index.js';
import userRoute from './routes/user/index.js';

dotenv.config();
const PORT = 8000;

const manager = new Discord.ShardingManager('./dist/app.js', {
  totalShards: 'auto',
  token: process.env.DISCORD_TOKEN,
});

manager.on('shardCreate', (shard) => {
  shard.on('error', (error: Error) => {
    Sentry.captureException(error);
  });

  console.log(`${chalk.cyan(`[Shards]`)} Launched shard ${shard.id}`);
});

(async () => {
  await manager.spawn(); // affirm the bot comes online

  App.register(fastifyJwt, {secret: process.env.JWT_SECRET});

  App.register(authRoute);
  App.register(userRoute);
  App.register(stripeRoute);

  App.decorate('authenticate', async (request, response: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      response.send(err);
    }
  });

  App.setErrorHandler(async (error, request, reply) => {
    Sentry.captureException(error);
    reply.status(500).send({error: 'Something went wrong'});
  });

  App.listen(PORT, (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`${chalk.grey('[Fastify]')} Listening on port ${PORT}`);

    Sentry.addBreadcrumb({
      category: 'server',
      message: `Listening on port ${PORT}`,
      level: Sentry.Severity.Info,
    });
  });
})();
