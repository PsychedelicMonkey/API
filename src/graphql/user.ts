import { AuthenticationError, gql } from 'apollo-server-express';
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

  type Mutation {
    loginUser(username: String!, password: String!): User!
    registerUser(username: String!, email: String!, password: String!): User!
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

  Mutation: {
    loginUser: async (parent: any, args: any) => {
      const { username, password } = args;

      const user = await User.findOne({ username }).select('+password').exec();

      if (!user) {
        throw new AuthenticationError('incorrect credentials');
      }

      const success = await user.checkPassword(password);

      if (!success) {
        throw new AuthenticationError('incorrect credentials');
      }

      return user;
    },

    registerUser: async (parent: any, args: any) => {
      const { username, email, password } = args;

      const user = await User.create({ username, email, password });

      return user;
    },
  },
};
