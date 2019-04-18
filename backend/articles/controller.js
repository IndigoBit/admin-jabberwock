const service = require('./service');

// todo: for all, validate the input
// todo: get the fields from graphql,
// feed to service to use in projection;
// might be an issue with caching?

async function getArticleList() {
  return service.getArticleList();
}

async function getArticle(args) {
  return service.getArticle({ userId: args._id });
}

async function createArticle(args) {
  return service.createArticle(args);
}

async function updateArticle(args) {
  return service.updateArticle(args);
}

async function destroyArticle(args) {
  return service.destroyArticle(args._id);
}

module.exports = {
  getArticleList,
  getArticle,
  createArticle,
  updateArticle,
  destroyArticle,
};
