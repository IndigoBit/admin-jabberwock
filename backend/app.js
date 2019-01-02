const { ApolloServer } = require("apollo-server");
const { MongoClient } = require("mongodb");

const schema = require("./schema");
const { getConfig, getRequestUser } = require("./helpers");

const config = getConfig();

/**
 * Return a function taking no params and returning the datasources.
 * This is the format apollo expects.
 * @param {*} db
 */
function getDataSources(db) {
  if (!db) return;

  return () => ({
    users: db.collection(`users`),
    articles: db.collection(`articles`),
    libraries: db.collection(`libraries`)
  });
}

async function start() {
  const mongoUri = config.dbUri;
  const mongoOptions = { useNewUrlParser: true };
  const mongoClient = await MongoClient.connect(
    mongoUri,
    mongoOptions
  );

  return new ApolloServer({
    schema,
    context: getRequestUser(),
    dataSources: getDataSources(mongoClient.db()),
    tracing: true
  });
}

module.exports = { start };
