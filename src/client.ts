import {Client, Intents} from 'discord.js';
import * as dotenv from 'dotenv';
import Sentry from './sentry.js';

dotenv.config();

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.once('ready', () => {
  Sentry.addBreadcrumb({
    category: 'discord',
    message: 'Bot is online',
    level: Sentry.Severity.Info,
  });
});

client.login(process.env.DISCORD_TOKEN);

export default client;
