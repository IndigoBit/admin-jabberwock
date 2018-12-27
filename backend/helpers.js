const jwt = require("jsonwebtoken");

function getConfig() {
  const config = {};

  config.jwtSecret = process.env.JWT_SECRET;
  config.dbUri = process.env.DB_URI;
  config.redisHost = process.env.REDIS_HOST || "localhost";

  return config;
}

function normalize(_document) {
  if (!_document) return _document;
  Object.freeze(_document);

  const document = Object.assign({}, _document);
  document._id = document._id.toString();

  return document;
}

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
        case `TokenExpiredError`:
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

module.exports = { normalize, getConfig, getRequestUser };
