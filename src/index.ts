import glob from 'glob';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
} catch (err) {
  // console.error(err);
  process.exit(1);
}

glob('./dist/modules/*.js', async (err: Error, files: [string]) => {
  if (err) {
    process.exit(1);
  }

  await Promise.all(files.map((file: string) => import(`../${file}`)));
});
