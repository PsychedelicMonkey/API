import { gql } from 'apollo-server-express';
import User from '../models/User';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Query {
    user(id: ID!): User!
    users: [User]!
  }
`;

export const resolvers = {
  Query: {
    user: async (parent: any, args: any) => {
      const { id } = args;
      const user = await User.findById(id);
      return user;
    },

    users: async () => {
      const users = await User.find();
      return users;
    },
  },
};
