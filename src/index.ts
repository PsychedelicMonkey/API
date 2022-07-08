import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, gql } from 'apollo-server-core';
import express, { Application } from 'express';
import { createServer } from 'http';

import connectDB from './config/db';
import logger from './config/logger';

import User from './models/User';

const port = process.env.PORT || 5000;

connectDB();

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Query {
    user(id: ID!): User!
    users: [User]!
  }
`;

const resolvers = {
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

(async () => {
  const app: Application = express();
  const httpServer = createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((r) => httpServer.listen({ port }, r));
  logger.info({
    label: 'Application',
    message: `🚀 Server ready in ${process.env.NODE_ENV} mode at http://localhost:${port}${server.graphqlPath}`,
  });
})();
