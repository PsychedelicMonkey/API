import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs as postTypes, resolvers as postResolvers } from './post';
import { typeDefs as userTypes, resolvers as userResolvers } from './user';

const schema = makeExecutableSchema({
  typeDefs: [postTypes, userTypes],
  resolvers: [postResolvers, userResolvers],
});

export default schema;
