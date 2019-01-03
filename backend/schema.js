const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const { ObjectId } = require("mongodb"); // maybe make this only available in data-acess??
const {
  getAll,
  getOneById,
  createDocument,
  updateDocument,
  destroyDocument
} = require("./data-access");

const whiteList = {
  users: {
    create: [`name`, `email`, `username`, `active`],
    update: [`name`, `email`, `username`, `active`, `requirePasswordReset`]
  },
  articles: {
    create: [`name`, `description`, `content`, `tags`, `creator`],
    update: [`name`, `description`, `content`, `tags`]
  }
};

const typeDefs = gql`
  type Query {
    userList: [User]!
    user(_id: ID): User

    articleList: [Article]!
    article(_id: ID): Article
    articleListByTag(tag: String!): [Article]!
  }

  type Mutation {
    createUser(
      name: String
      username: String!
      email: String
      active: Boolean
    ): User
    updateUser(_id: ID!, name: String, username: String, email: String): User
    destroyUser(_id: ID!): User

    createArticle(
      name: String!
      creator: String!
      description: String
      content: String
      tags: [String]!
    ): User
    updateArticle(
      _id: ID!
      name: String
      description: String
      content: String
      tags: [String]
    ): User

    enableUser(_id: ID!): User
    disableUser(_id: ID!): User
    resetUserPassword(_id: ID!): User
  }

  type User {
    _id: ID!
    name: String
    email: String
    username: String!
    active: Boolean
    articles: [Article]
    requirePasswordReset: Boolean
  }

  type Article {
    _id: ID!
    name: String!
    description: String
    content: String
    creator: User
    tags: [String]
  }
`;

const resolvers = {
  Query: {
    userList: async (_, __, { dataSources }) => await getAll(dataSources.users),
    user: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.users, _id),

    articleList: async (_, __, { dataSources }) =>
      await getAll(dataSources.articles),
    article: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.articles, _id)
  },
  Mutation: {
    createUser: async (_, args, { dataSources }) =>
      await createDocument(
        dataSources.users,
        //requirePasswordReset must be set to set to true when a new user is created
        Object.assign({}, args, { requirePasswordReset: true }),
        whiteList.users.create
      ),
    updateUser: async (_, args, { dataSources }) =>
      await updateDocument(dataSources.users, args, whiteList.users.update),
    destroyUser: async (_, { _id }, { dataSources }) =>
      await destroyDocument(dataSources.users, ObjectId(_id)),

    enableUser: async (_, args, { dataSources }) =>
      await updateDocument(
        dataSources.users,
        { _id: args._id, active: true },
        whiteList.users.update
      ),
    disableUser: async (_, args, { dataSources }) =>
      await updateDocument(
        dataSources.users,
        { _id: args._id, active: false },
        whiteList.users.update
      ),
    resetUserPassword: async (_, args, { dataSources }) =>
      await updateDocument(
        dataSources.users,
        { _id: args._id, requirePasswordReset: true },
        whiteList.users.update
      ),

    createArticle: async (_, args, { dataSources }) =>
      await createDocument(
        dataSources.articles,
        args,
        whiteList.articles.create
      ),
    updateArticle: async (_, args, { dataSources }) =>
      await updateDocument(
        dataSources.articles,
        args,
        whiteList.articles.update
      )
  },
  User: {
    articles: async (parent, __, { dataSources }) =>
      await getAll(dataSources.articles, { creator: ObjectId(parent._id) })
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
