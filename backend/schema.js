const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const { ObjectId } = require("mongodb");

const { normalize } = require("./helpers");

function contactReducer(flattened) {
  if (!flattened) return;

  const contact = {
    name: flattened.contact_name,
    address: flattened.contact_address,
    phone: flattened.contact_phone,
    email: flattened.contact_email
  };

  Object.keys(contact)
    .filter(key => typeof contact[key] === "undefined")
    .forEach(key => delete contact[key]);

  return contact;
}

function flattenedReducers(flattened) {
  if (!flattened) return;

  const reduced = {};

  const contact = contactReducer(flattened);
  if (contact) reduced.contact = contact;

  return reduced;
}

async function updateDocument(collection, _params, whiteList) {
  Object.freeze(_params);

  const params = Object.assign({}, _params, flattenedReducers(_params));
  const docId = ObjectId(params._id);
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

async function createDocument(collection, _params, whiteList) {
  Object.freeze(_params);

  const params = Object.assign({}, _params, flattenedReducers(_params));
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
    create: [`name`, `website`, `contact`],
    update: [`name`, `website`, `contact`]
  },
  users: {
    create: [`name`],
    update: [`name`, `active`]
  },
  articles: {
    create: [`name`, `description`, `content`, `creator`, `tags`],
    update: [`name`, `description`, `content`, `tags`]
  }
};

const typeDefs = gql`
  type Query {
    organizationList: [Organization]!
    organization(_id: ID): Organization

    userList: [User]!
    user(_id: ID): User

    articleList: [Article]!
    article(_id: ID): Article
    articleListByTag(tag: String!): [Article]!
  }

  type Mutation {
    createOrganization(
      name: String!
      website: String
      contact_name: String!
      contact_email: String!
      contact_address: String
      contact_phone: String
    ): Organization
    updateOrganization(
      _id: ID!
      name: String
      website: String
      contact_name: String!
      contact_email: String!
      contact_address: String!
      contact_phone: String!
    ): Organization

    createUser(name: String!): User
    updateUser(_id: ID!, name: String, active: Boolean): User

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
  }

  type Organization {
    _id: ID!
    name: String!
    users: [User]
    articles: [Article]
    contact: Contact!
    website: String
  }

  type User {
    _id: ID!
    name: String!
    organization: Organization!
    active: Boolean
  }

  type Contact {
    name: String!
    email: String!
    phone: String
    address: String
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
    organizationList: async (_, __, { dataSources }) =>
      await getAll(dataSources.organizations),
    organization: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.organizations, _id),

    userList: async (_, __, { dataSources }) => await getAll(dataSources.users),
    user: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.users, _id),

    articleList: async (_, __, { dataSources }) =>
      await getAll(dataSources.articles),
    article: async (_, { _id }, { dataSources }) =>
      await getOneById(dataSources.articles, _id)
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
      await getAll(dataSources.users, { organization: ObjectId(parent._id) })
  },
  User: {
    organization: async (parent, __, { dataSources }) =>
      await getOneById(dataSources.organizations, parent.organization)
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
