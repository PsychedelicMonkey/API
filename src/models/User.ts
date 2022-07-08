import bcrypt from 'bcryptjs';
import { Document, model, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  plan: string;
  bio?: string;
  avatar?: string;

  checkPassword(password: string): Promise<boolean>;
}

const User = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
      select: false,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

User.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

User.methods.checkPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', User);
