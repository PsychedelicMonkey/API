import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import logger from '../config/logger';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

const authToken = async (req: Request) => {
  try {
    const token = req.headers.authorization;

    // Throw error if a token is not in header
    if (!token) {
      throw new Error('token not supplied in auth header');
    }

    // Decode the token
    const { id } = (await verify(token, JWT_SECRET)) as JwtPayload;

    // Find the user from the decoded ID
    const user = await User.findById(id);

    // Throw error if user not found
    if (!user) {
      throw new Error('user not found');
    }

    return user;
  } catch (err) {
    if (err instanceof Error)
      logger.debug({ label: 'Application', message: err.message });
  }
};

export default authToken;
