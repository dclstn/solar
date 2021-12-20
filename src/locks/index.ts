import Client from 'ioredis';
import Redlock, {Lock, ResourceLockedError, Settings} from 'redlock';
import Sentry from '../sentry.js';

const client = new Client();

const redlock = new Redlock([client], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  automaticExtensionThreshold: 500,
});

redlock.on('error', (error: Error) => {
  if (error instanceof ResourceLockedError) {
    return;
  }

  Sentry.captureException(error);
});

export function acquireUserLock(id: string, duration: number, settings?: Settings): Promise<Lock> {
  return redlock.acquire([`account.${id}`], duration, settings);
}

export default redlock;
