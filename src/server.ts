import fastify from 'fastify';
import glob from 'glob';
import Sentry from './sentry.js';

const App = fastify();
const PORT = 8000;

glob('./dist/routes/**/index.js', async (err: Error, files: [string]) => {
  if (err) {
    Sentry.captureException(err);
    process.exit(1);
  }

  try {
    await Promise.all(files.map((file: string) => import(`../${file}`)));
  } catch (e) {
    Sentry.captureException(err);
    process.exit(1);
  }

  App.setErrorHandler(async (error, request, reply) => {
    Sentry.captureException(error);
    reply.status(500).send({error: 'Something went wrong'});
  });

  App.listen(PORT, (error) => {
    if (error) {
      Sentry.captureException(error);
      process.exit(1);
    }

    Sentry.addBreadcrumb({
      category: 'server',
      message: `Listening on port ${PORT}`,
      level: Sentry.Severity.Info,
    });
  });
});

export default App;
