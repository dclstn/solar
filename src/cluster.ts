import chalk from 'chalk';
import {ShardingManager} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const manager = new ShardingManager('./dist/app.js', {
  totalShards: 2,
  token: process.env.DISCORD_TOKEN,
});

manager.on('shardCreate', (shard) => {
  // eslint-disable-next-line no-console
  console.log(`${chalk.cyan(`[Shards]`)} Launched shard ${shard.id}`);
});

manager.spawn();

export default manager;
