const service = require('./service');

// todo: for all, validate the input
// todo: get the fields from graphql,
// feed to service to use in projection;
// might be an issue with caching?

async function getUserList() {
  return service.getUserList();
}

async function getUser(args) {
  return service.getUser({ userId: args._id });
}

async function createUser(args) {
  return service.createUser(args);
}

async function updateUser(args) {
  return service.updateUser(args);
}

async function destroyUser(args) {
  return service.destroyUser(args._id);
}

async function enableUser(args) {
  return service.enableUser(args._id);
}

async function disableUser(args) {
  return service.disableUser(args._id);
}

async function resetUserPassword(args) {
  return service.resetUserPassword(args._id);
}

async function getUsersArticles({ userId }) {
  return service.getUsersArticles({ userId });
}

module.exports = {
  getUserList,
  getUser,
  createUser,
  updateUser,
  destroyUser,
  enableUser,
  disableUser,
  resetUserPassword,
  getUsersArticles,
};
