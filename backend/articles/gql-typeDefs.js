const { gql } = require('apollo-server');

const typeDefs = gql`
  type Article {
    _id: ID!
    name: String!
    description: String
    content: String
    creator: User
    tags: [String]
  }
`;

module.exports = { typeDefs };
