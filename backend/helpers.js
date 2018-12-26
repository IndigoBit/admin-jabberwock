const jwt = require("jsonwebtoken");

function getConfig() {
  const config = {};

  config.jwtSecret = process.env.JWT_SECRET;
  config.dbUri = process.env.dbUri;
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

    jwt.verify(token, config.jwtSecret);
  };
}

module.exports = { normalize, getConfig, getRequestUser };
