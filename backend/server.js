// setup process env
require("dotenv").config();

const { start } = require("./app");

start()
  .then(server => server.listen(process.env.PORT))
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch(err => {
    console.error(err);

    process.exit(1);
  });
