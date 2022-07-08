import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs, resolvers } from './user';

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
