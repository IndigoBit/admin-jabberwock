// setup process env
require('dotenv').config();

const { start } = require('./app');

start()
  .then(({ server, port }) => server.listen(port))
  .then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);

    process.exit(1);
  });
