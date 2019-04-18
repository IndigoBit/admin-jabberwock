const controller = require('./controller');

const resolvers = {
  Query: {
    userList: async () => controller.getUserList(),
    user: async (_, args) => controller.getUser(args),
  },
  Mutation: {
    createUser: async (_, args) => controller.createUser(args),
    updateUser: async (_, args) => controller.updateUser(args),
    destroyUser: async (_, args) => controller.destroyUser(args),
    enableUser: async (_, args) => controller.enableUser(args),
    disableUser: async (_, args) => controller.disableUser(args),
    resetUserPassword: async (_, args) => controller.resetUserPassword(args),
  },
  User: {
    articles: async parent => controller.getUsersArticles({ userId: parent._id }),
  },
};

module.exports = { resolvers };
