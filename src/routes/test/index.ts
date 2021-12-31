import App from '../../server.js';

App.get('/', (req, res) => {
  res.send({hello: 'world'});
});
