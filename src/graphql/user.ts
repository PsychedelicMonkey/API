import { AuthenticationError, gql } from 'apollo-server-express';
import { sign } from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User!
    user(id: ID!): User!
    users: [User]!
  }

  type Mutation {
    loginUser(username: String!, password: String!): Auth!
    registerUser(username: String!, email: String!, password: String!): Auth!
  }
`;

export const resolvers = {
  Query: {
    me: async (parent: any, args: any, ctx: any) => {
      if (!ctx.user) {
        throw new AuthenticationError('unauthorized');
      }

      return ctx.user;
    },

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

      // Find username in database
      const user = await User.findOne({ username }).select('+password').exec();

      // Throw error if username is not found
      if (!user) {
        throw new AuthenticationError('incorrect credentials');
      }

      // Check password
      const success = await user.checkPassword(password);

      // Throw error if wrong password is entered
      if (!success) {
        throw new AuthenticationError('incorrect credentials');
      }

      // Create auth token
      const token = await sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 3600,
      });

      return { token, user };
    },

    registerUser: async (parent: any, args: any) => {
      const { username, email, password } = args;

      // Create user
      const user = await User.create({ username, email, password });

      // Create auth token
      const token = await sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 3600,
      });

      return { token, user };
    },
  },
};
