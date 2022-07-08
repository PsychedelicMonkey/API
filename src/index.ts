import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';

import app from './app';
import connectDB from './config/db';
import logger from './config/logger';
import schema from './graphql';
import authToken from './middleware/authToken';

const port = process.env.PORT || 5000;

connectDB();

(async () => {
  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req, res }) => {
      const user = await authToken(req);

      return { user, req, res };
    },
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((r) => httpServer.listen({ port }, r));
  logger.info({
    label: 'Application',
    message: `🚀 Server ready in ${process.env.NODE_ENV} mode at http://localhost:${port}${server.graphqlPath}`,
  });
})();
