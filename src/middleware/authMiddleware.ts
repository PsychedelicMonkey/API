import { NextFunction, Request, Response } from 'express';
import authToken from './authToken';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authToken(req);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: 'unauthorized' });
  }
};

export default auth;
