import {Routes} from 'discord-api-types/v9';
import dotenv from 'dotenv';
import glob from 'glob';
import rest from './rest.js';
import Sentry from './sentry.js';
import CommandsManager, {Command} from '../interactions/commands.js';

dotenv.config();

async function reloadApplicationCommands(): Promise<void> {
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
  });

  const commands = Array.from(CommandsManager.commands.values()).map((command: Command) => ({
    type: command.type,
    name: command.name,
    description: command.description,
    options: command.options,
  }));

  if (process.env.GUILD_ID != null) {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {body: commands});
  } else {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands});
  }

  Sentry.addBreadcrumb({
    category: 'commands',
    message: 'Application commands were reloaded',
    level: Sentry.Severity.Info,
  });

  process.exit(0);
}

await reloadApplicationCommands();
