const { gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs: userTypeDefs } = require('./users/gql-typeDefs');
const { resolvers: userResolvers } = require('./users/gql-resolvers');

const { typeDefs: articleTypeDefs } = require('./articles/gql-typeDefs');
const { resolvers: articleResolvers } = require('./articles/gql-typeDefs');

/* Type Defs */
const query = gql`
    type Query {
        userList: [User]!
        user(_id: ID): User

        articleList: [Article]!
        article(_id: ID): Article
        articleListByTag(tag: String!): [Article]!
    }
`;

const mutation = gql`
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
`;
const typeDefs = [userTypeDefs, articleTypeDefs, mutation, query];

/* Resolvers */
const resolvers = Object.assign({}, userResolvers, articleResolvers);

/* Schema */
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
