/* eslint-disable no-console */
import fastify, {FastifyReply} from 'fastify';
import fastifyJwt from 'fastify-jwt';
import chalk from 'chalk';
import fastifyCors from '@fastify/cors';
import Sentry from './sentry.js';
import authRoute from '../routes/auth/index.js';
import stripeRoute from '../routes/stripe/index.js';
import userRoute from '../routes/user/index.js';
import sessionsRoute from '../routes/sessions/index.js';
import votesRoute from '../routes/votes/index.js';
import leaderboardsRoute from '../routes/leaderboard/index.js';
import itemsRoute from '../routes/items/index.js';
import guildRoute from '../routes/guilds/index.js';
import commandsRoute from '../routes/commands/index.js';
import workshopRoute from '../routes/workshop/index.js';

const App = fastify();
const PORT = process.env.PORT ?? 3000;

App.register(fastifyJwt, {secret: process.env.JWT_SECRET});

App.register(authRoute);
App.register(userRoute);
App.register(stripeRoute);
App.register(sessionsRoute);
App.register(votesRoute);
App.register(leaderboardsRoute);
App.register(itemsRoute);
App.register(guildRoute);
App.register(commandsRoute);
App.register(workshopRoute);

App.decorate('authenticate', async (request, response: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    response.status(401).send('Unauthorized');
  }
});

App.register(fastifyCors, {
  origin: /https:\/\/discordbotlist/,
  credentials: true,
  optionsSuccessStatus: 200,
});

App.setErrorHandler(async (error, request, reply) => {
  Sentry.captureException(error);
  reply.status(500).send({message: 'something went wrong'});
});

App.listen({port: PORT, host: '0.0.0.0'}, (error) => {
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

export default App;
