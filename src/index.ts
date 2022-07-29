/* eslint-disable no-console */
import Discord from 'discord.js';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import Sentry from './sentry.js';

dotenv.config();

const manager = new Discord.ShardingManager('./dist/app.js', {
  totalShards: 'auto',
  token: process.env.DISCORD_TOKEN,
  timeout: -1,
  respawn: true
});

manager.on('shardCreate', (shard) => {
  shard.on('error', (error: Error) => {
    Sentry.captureException(error);
  });

  console.log(`${chalk.cyan(`[Shards]`)} Launched shard ${shard.id}`);
});

manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 });

import('./server.js');
