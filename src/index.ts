import glob from 'glob';

glob('./dist/modules/*.js', async (err: Error, files: [string]) => {
  if (err) {
    process.exit(1);
  }

  await Promise.all(files.map((file: string) => import(`../${file}`)));
});
