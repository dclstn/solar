import glob from 'glob';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

class Modules {
  constructor() {
    this.loadModules();
  }

  loadModules() {
    glob('./dist/modules/**/index.js', async (err: Error, files: [string]) => {
      if (err) {
        process.exit(1);
      }

      await Promise.all(files.map((file: string) => import(`../${file}`)));
    });

    console.log(require.cache);
  }
}

export default new Modules();
