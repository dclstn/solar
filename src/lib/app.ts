import glob from 'glob';
import dotenv from 'dotenv';
import commands from '../interactions/commands.js';
import client from './client.js';
import Sentry from './sentry.js';

dotenv.config();

client.once('ready', () => {
  glob('./dist/modules/**/index.js', async (err: Error, files: [string]) => {
    if (err) {
      process.exit(1);
    }

    for await (const file of files) {
      try {
        await import(`../../${file}`);
      } catch (moduleErr) {
        Sentry.captureException(moduleErr);
      }
    }

    const shouldReload = process.env.RELOAD_APPLICATION_COMMANDS === 'true';
    if (shouldReload) {
      commands.reloadApplicationCommands();
    }
  });

  Sentry.addBreadcrumb({
    category: 'discord',
    message: 'Bot is online',
    level: Sentry.Severity.Info,
  });
});
