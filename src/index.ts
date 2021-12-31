import glob from 'glob';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}

glob('./dist/modules/**/index.js', async (err: Error, files: [string]) => {
  if (err) {
    process.exit(1);
  }

  try {
    await Promise.all(files.map((file: string) => import(`../${file}`)));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
});

import('./server.js');
