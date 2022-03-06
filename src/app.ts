import glob from 'glob';
import client from './client.js';
import Sentry from './sentry.js';

client.on('ready', () => {
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

  Sentry.addBreadcrumb({
    category: 'discord',
    message: 'Bot is online',
    level: Sentry.Severity.Info,
  });
});
