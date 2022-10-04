/* eslint-disable no-console */
import Sentry from '@sentry/node';
import dotenv from 'dotenv';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.ENVIROMENT,
  beforeSend: (event, hint) => {
    if (process.env.ENVIROMENT === 'development') {
      console.error(hint.originalException || hint.syntheticException);
      return null;
    }
    return event;
  },
});

export default Sentry;
