const { ApolloServer } = require("apollo-server");
const { MongoClient } = require("mongodb");
const { RedisCache } = require("apollo-server-cache-redis");

const schema = require("./schema");
const { getConfig } = require("./helpers");

const config = getConfig();

/**
 * Return a function taking no params and returning the datasources.
 * This is the format apollo expects.
 * @param {*} db
 */
function getDataSources(db) {
  if (!db) return;

  return () => ({
    organizations: db.collection(`organizations`),
    users: db.collection(`users`)
  });
}

function getRedisCache() {
  return new RedisCache({
    host: config.redisHost
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
    cache: getRedisCache(),
    dataSources: getDataSources(mongoClient.db()),
    tracing: true
  });
}

module.exports = { start };
