const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const { ObjectId } = require("mongodb");

const { normalize } = require("./helpers");

async function updateDocument(collection, params, whiteList) {
  const docId = ObjectId(args._id);
  const updatedFields = {};

  Object.keys(params)
    .filter(param => whiteList.includes(param))
    .forEach(param => (updatedFields[param] = params[param]));

  // only update if they're something to update in the first place
  if (Object.keys(updatedFields).length) {
    await collection.updateOne({ _id: docId }, { $set: updatedFields });
  }

  return normalize(await collection.findOne(docId));
}

async function createDocument(collection, params, whiteList) {
  const document = {};

  Object.keys(params)
    .filter(param => whiteList.includes(param))
    .forEach(param => (document[param] = params[param]));

  const res = await collection.insertOne(document);
  const newID = res.insertedId;

  return normalize(await collection.findOne(newID));
}

async function getOneById(collection, id) {
  return getOneByQuery(collection, { _id: ObjectId(id) });
}

async function getOneByQuery(collection, query) {
  return normalize(await collection.findOne(query));
}

async function getAll(collection, query) {
  return (await collection.find(query).toArray()).map(normalize);
}

const whiteList = {
  organizations: {
    create: [`name`],
    update: [`name`]
  },
  users: {
    create: [`name`],
    update: [`name`]
  },
  articles: {
    create: [`name`, `description`, `content`, `creator`],
    update: [`name`, `description`, `content`]
  }
};

const typeDefs = gql`
  type Query {
    organizations: [Organization]!
    organization(_id: ID): Organization

    users: [User]!
    user(_id: ID): User

    articles: [Article]!
    article(_id: ID): Article

    # nti
    library: Library
  }

  type Mutation {
    createOrganization(name: String!): Organization
    updateOrganization(_id: ID!, name: String): Organization

    createUser(name: String!): User
    updateUser(_id: ID!, name: String): User

    createArticle(
      name: String!
      creator: String!
      description: String
      content: String
    ): User
    updateArticle(
      _id: ID!
      name: String
      description: String
      content: String
    ): User
  }

  type Organization {
    _id: ID!
    name: String!
    users: [User]
    library: Library
  }

  type User {
    _id: ID!
    name: String!
    organization: Organization
  }

  # nti
  type Library {
    _id: ID!
    folders: [Folder]
  }

  # nti
  type Folder {
    _id: ID!
    name: String!
    articles: [Article]
    folders: [Folder]
  }

  type Article {
    _id: ID!
    name: String!
    description: String
    content: String
    creator: User
  }
`;

const resolvers = {
  Query: {
    organizations: async (_, __, { dataSources }) =>
      await getAll(dataSources.organizations),
    organization: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.organizations, _id),

    users: async (_, __, { dataSources }) => await getAll(dataSources.users),
    user: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.users, _id),

    articles: async (_, __, { dataSources }) =>
      await getAll(dataSources.articles),
    article: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.articles, _id),

    // todo: needs to be based on the user's organization
    library: async (_, { _id }, { dataSources }) => {
      return null;
    }
  },
  Mutation: {
    createOrganization: async (_, args, { dataSources }) =>
      await createDocument(
        dataSources.organizations,
        args,
        whiteList.organizations.create
      ),
    updateOrganization: async (_, args, { dataSources }) =>
      await updateDocument(
        dataSources.organizations,
        args,
        whiteList.organizations.update
      ),

    createUser: async (_, args, { dataSources }) =>
      await createDocument(dataSources.users, args, whiteList.users.create),
    updateUser: async (_, args, { dataSources }) =>
      await updateDocument(dataSources.users, args, whiteList.users.update),
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
  Organization: {
    users: async (parent, __, { dataSources }) =>
      await getAll(dataSources.users, { organization: ObjectI(parent._id) }),
    library: async (parent, __, { dataSources }) => {
      const libId = parent && parent.library;
      if (!libId) return;

      return await getOneById(dataSources.libraries, libId);
    }
  },
  User: {
    organization: async (parent, __, { dataSources }) =>
      await getOneById(dataSources.organizations, parent.organization)
  },
  Folder: {
    articles: async (parent, __, { dataSources }) => {
      if (!parent.articles || !parent.articles.length) return;

      articlePromises = parent.articles.map(articleId =>
        getOneById(dataSources.articles, articleId)
      );

      return Promise.all(articlePromises);
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
