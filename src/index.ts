/* eslint-disable no-console */
import Discord from 'discord.js';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import Sentry from './lib/sentry.js';

dotenv.config();

const manager = new Discord.ShardingManager('./dist/app.js', {
  totalShards: 'auto',
  token: process.env.DISCORD_TOKEN,
  respawn: true,
});

manager.on('shardCreate', (shard) => {
  if (shard == null) return;
  shard.on('error', (error: Error) => {
    Sentry.captureException(error);
  });

  console.log(`${chalk.cyan(`[Shards]`)} Launched shard ${shard.id}`);
});

manager.spawn({timeout: 60000});

import('./lib/server.js');
