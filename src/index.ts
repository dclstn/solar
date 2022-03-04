/* eslint-disable no-console */
import glob from 'glob';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
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

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  glob('./dist/modules/**/index.js', async (err: Error, files: [string]) => {
    if (err) {
      process.exit(1);
    }

    for await (const file of files) {
      try {
        await import(`../${file}`);
      } catch (moduleErr) {
        Sentry.captureException(moduleErr);
      }
    }
  });

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
