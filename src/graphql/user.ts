import { AuthenticationError, gql } from 'apollo-server-express';
import { sign } from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    plan: String
    bio: String
  }

  type Auth {
    token: String!
    user: User!
  }

  input RegisterInput {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
  }

  input UpdateInput {
    username: String
    firstName: String
    lastName: String
    bio: String
  }

  type Query {
    me: User!
    user(id: ID!): User!
    users: [User]!
  }

  type Mutation {
    updateUser(input: UpdateInput): User!

    loginUser(username: String!, password: String!): Auth!
    registerUser(input: RegisterInput): Auth!
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
    // =======================================================================
    // Log in to a registered user account
    // =======================================================================
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

    // =======================================================================
    // Register a new user account
    // =======================================================================
    registerUser: async (parent: any, args: any) => {
      const {
        input: { username, email, firstName, lastName, password },
      } = args;

      // Create user
      const user = await User.create({
        username,
        email,
        firstName,
        lastName,
        password,
      });

      // Create auth token
      const token = await sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 3600,
      });

      return { token, user };
    },

    // =======================================================================
    // Update user profile
    // =======================================================================
    updateUser: async (parent: any, args: any, ctx: any) => {
      if (!ctx.user) {
        throw new AuthenticationError('unauthorized');
      }

      const {
        input: { username, firstName, lastName, bio },
      } = args;

      const user = await User.findByIdAndUpdate(
        ctx.user.id,
        { username, firstName, lastName, bio },
        { new: true }
      );

      return user;
    },
  },
};
