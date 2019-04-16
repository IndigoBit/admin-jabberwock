const controller = require('./controller');

const resolvers = {
  Query: {
    articleList: async () => controller.articleList(),
    article: async (_, args) => controller.article(args),
  },
  Mutation: {
    createArticle: async (_, args) => controller.createArticle(args),
    updateArticle: async (_, args) => controller.updateArticle(args),
    destroyArticle: async (_, args) => controller.destroyArticle(args),
  },
};

module.exports = { resolvers };
