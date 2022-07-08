import {
  AuthenticationError,
  ForbiddenError,
  gql,
  ValidationError,
} from 'apollo-server-express';

import Post from '../models/Post';

export const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
  }

  input UpdatePostInput {
    title: String
    body: String
  }

  type Query {
    post(id: ID): Post!
    posts: [Post]!
  }

  type Mutation {
    createPost(title: String!, body: String!): Post!
    updatePost(id: ID!, input: UpdatePostInput): Post!
    deletePost(id: ID!): String!
  }
`;

export const resolvers = {
  Query: {
    // =======================================================================
    // Get a post by ID
    // =======================================================================
    post: async (parent: any, args: any) => {
      const { id } = args;

      const post = await Post.findById(id).populate('author');
      return post;
    },

    // =======================================================================
    // Get all posts
    // =======================================================================
    posts: async () => {
      const posts = await Post.find().populate('author');
      return posts;
    },
  },

  Mutation: {
    // =======================================================================
    // Create a new post
    // =======================================================================
    createPost: async (parent: any, args: any, ctx: any) => {
      if (!ctx.user) {
        throw new AuthenticationError('unauthorized');
      }

      const { title, body }: { title: string; body: string } = args;

      const post = await Post.create({ title, body, author: ctx.user });

      return post;
    },

    // =======================================================================
    // Update a post
    // =======================================================================
    updatePost: async (parent: any, args: any, ctx: any) => {
      if (!ctx.user) {
        throw new AuthenticationError('unauthorized');
      }

      const {
        id,
        input: { title, body },
      } = args;

      let post = await Post.findById(id).populate('author');

      // Throw error if post is not found
      if (!post) {
        throw new ValidationError('post not found');
      }

      // Throw error if user is not the owner of the post
      if (!ctx.user.equals(post?.author)) {
        throw new ForbiddenError('you cannot update this post');
      }

      // Update the post
      post = await Post.findByIdAndUpdate(
        id,
        { title, body },
        { new: true }
      ).populate('author');

      return post;
    },

    // =======================================================================
    // Delete a post
    // =======================================================================
    deletePost: async (parent: any, args: any, ctx: any) => {
      if (!ctx.user) {
        throw new AuthenticationError('unauthorized');
      }

      const { id } = args;

      let post = await Post.findById(id);

      // Throw error if post is not found
      if (!post) {
        throw new ValidationError('post not found');
      }

      // Throw error if user is not the owner of the post
      if (!ctx.user.equals(post?.author)) {
        throw new ForbiddenError('you cannot delete this post');
      }

      // Delete the post
      await post?.remove();

      return 'post deleted';
    },
  },
};
