import { model, Schema, Types } from 'mongoose';

interface IPost {
  title: string;
  body: string;
  author: Types.ObjectId;
}

const Post = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      many: false,
    },
  },
  { timestamps: true }
);

export default model<IPost>('Post', Post);
