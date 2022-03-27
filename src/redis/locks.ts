import {User} from 'discord.js';
import Redlock, {ResourceLockedError} from 'redlock';
import Sentry from '../sentry.js';
import client from './client.js';

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

export const userLock = (user: User): string => `account.${user.id}`;
export const userLockId = (id): string => `account.${id}`;
export const groupLock = (name: string): string => `group.${name}`;

export default redlock;
