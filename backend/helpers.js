const jwt = require('jsonwebtoken');

function getConfig() {
  const config = {
    jwtSecret: process.env.JABBERWOCK_JWT_SECRET,
    dbUri: process.env.JABBERWOCK_DB_URI,
    redisHost: process.env.JABBERWOCK_REDIS_HOST,
    apiPort: process.env.JABBERWOCK_API_PORT,
  };

  return config;
}

// async function normalizeDocument(_document) {
//   return new Promise(async (resolve, reject) => {
//     if (!_document) reject(`Can't normalize null or undefined`);

//     let doc = await _document;

//     // if we're normalizing an array of docs, then return each document normalized
//     if (Array.isArray(doc)) {
//       return resolve(Promise.all(doc.map(single => normalizeDocument(single))));
//     }

//     return resolve(doc.toObject());
//   });
// }

function getRequestUser() {
  const config = getConfig();

  return ({ req }) => {
    const auth = {};
    const token = req.headers.authorization;

    if (!token) return auth;

    // decode the token and verify it.
    // if there is an error set the appropriate flag and return it
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      switch (err) {
        case 'TokenExpiredError':
          auth.tokenExpired = true;
          break;
        default:
          auth.badToken = true;
          break;
      }

      return auth;
    }

    // if we're here then token is verified and got decoded properly

    auth.decoded = decodedToken;

    return auth;
  };
}

module.exports = { getConfig, getRequestUser };
