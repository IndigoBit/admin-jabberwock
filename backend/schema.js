const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const { ObjectId } = require("mongodb");

const { normalize } = require("./helpers");

const typeDefs = gql`
  type Query {
    organizations: [Organization]!
    organization(_id: ID): Organization

    users: [User]!
    user(_id: ID): User
  }

  type Mutation {
    createOrganization(name: String!): Organization
    updateOrganization(_id: ID!, name: String): Organization

    createUser(name: String!): User
    updateUser(_id: ID!, name: String): User
  }

  type Organization {
    _id: ID!
    name: String!
    users: [User]
  }

  type User {
    _id: ID!
    name: String!
    organization: Organization
  }
`;

const resolvers = {
  Query: {
    organizations: async (_, __, { dataSources }) =>
      (await dataSources.organizations.find({}).toArray()).map(normalize),
    organization: async (_, { _id }, { dataSources }) =>
      normalize(await dataSources.organizations.findOne(ObjectId(_id))),
    users: async (_, __, { dataSources }) =>
      (await dataSources.users.find({}).toArray()).map(normalize),
    user: async (_, { _id }, { dataSources }) =>
      normalize(await dataSources.users.findOne(ObjectId(_id)))
  },
  Mutation: {
    createOrganization: async (_, args, { dataSources }) => {
      const collection = dataSources.organizations;
      const res = await collection.insertOne(args);
      const newID = res.insertedId;
      return normalize(await collection.findOne(newID));
    },
    updateOrganization: async (_, args, { dataSources }) => {
      const collection = dataSources.organization;
      const docId = args._id;
      const document = await collection.findOne(docId);
      const whiteList = ["name"];

      Object.keys(args)
        .filter(arg => whiteList.includes(arg))
        .forEach(arg => (document[arg] = args[arg]));

      const res = await collection.updateOne({ _id: docId }, document);
      return normalize(await collection.findOne(docId));
    },
    createUser: async (_, args, { dataSources }) => {
      const collection = dataSources.users;
      const res = await collection.insert(args);
      const newID = res.insertedIds;
      return normalize(await collection.findOne(newID));
    }
  },
  Organization: {
    users: async ({ _id }, __, { dataSources }) =>
      (await dataSources.users
        .find({ organization: ObjectId(_id) })
        .toArray()).map(normalize)
  },
  User: {
    organization: async ({ organization }, __, { dataSources }) =>
      normalize(await dataSources.organizations.findOne(ObjectId(organization)))
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
