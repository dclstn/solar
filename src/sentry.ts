import Sentry from '@sentry/node';
import dotenv from 'dotenv';
import Tracing from '@sentry/tracing';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.ENVIROMENT,
  integrations: [
    new Tracing.Integrations.Mongo({
      useMongoose: true,
    }),
  ],
});

export default Sentry;
