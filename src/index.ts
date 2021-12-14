import glob from 'glob';

glob('./src/commands/*.js', async (err: Error, files: [string]) => {
  if (err) {
    process.exit(1);
  }

  await Promise.all(files.map((file: string) => import(file)));
});
