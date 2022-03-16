import Mongoose from 'mongoose';
import cron from 'node-cron';
import connection from '../connection.js';
import {BenchInterface, BenchModelInterface} from '../../types/bench';
import * as methods from './methods.js';
import * as statics from './statics.js';

const BenchSchema: Mongoose.Schema = new Mongoose.Schema<BenchInterface>({
  discordId: {type: Mongoose.Schema.Types.Long, required: true, index: {unique: true}},
  maxTasks: {type: Number, default: 3},
  tasks: [
    {
      recipeId: {type: String, required: true},
      endDate: {type: Date, required: true},
    },
  ],
});

BenchSchema.statics = statics;
BenchSchema.methods = methods;

const WorkBench = connection.model<BenchInterface, BenchModelInterface>('Bench', BenchSchema);

const cronJob = cron.schedule('*/10 * * * * *', async () => {
  const benches = await WorkBench.find({'tasks.endDate': {$lte: new Date()}});
  await Promise.all(benches.map((bench) => bench.checkTasks()));
});

cronJob.start();

export default WorkBench;
