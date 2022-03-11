/* eslint-disable no-console */
import fastify, {FastifyReply} from 'fastify';
import fastifyJwt from 'fastify-jwt';
import chalk from 'chalk';
import Sentry from './sentry.js';
import authRoute from './routes/auth/index.js';
import stripeRoute from './routes/stripe/index.js';
import userRoute from './routes/user/index.js';

const App = fastify();
const PORT = 8000;

App.register(fastifyJwt, {secret: process.env.JWT_SECRET});

App.register(authRoute);
App.register(userRoute);
App.register(stripeRoute);

App.decorate('authenticate', async (request, response: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    response.status(401).send('Unauthorized');
  }
});

App.setErrorHandler(async (error, request, reply) => {
  Sentry.captureException(error);
  reply.status(500).send({message: 'something went wrong'});
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

export default App;
