/* eslint-disable no-console */
import {ClusterManager} from 'discord.js-cluster';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import Sentry from './sentry.js';

dotenv.config();

const manager = new ClusterManager('./dist/app.js', {
  totalShards: 'auto',
  token: process.env.DISCORD_TOKEN,
});

manager.on('clusterCreate', (cluster) => {
  cluster.on('error', (error: Error) => {
    Sentry.captureException(error);
  });

  console.log(`${chalk.cyan(`[Clusters]`)} Launched cluster ${cluster.id}`);
});

manager.spawn({timeout: 60000});

import('./server.js');