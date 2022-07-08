import express, { Application, NextFunction, Request, Response } from 'express';
import { upload } from './config/upload';

const app: Application = express();

app.use(express.static('public/'));

app.post('/upload', (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    try {
      if (err) throw err;

      return res.send(req.file);
    } catch (err) {
      if (err instanceof Error) return res.send(err.message);
    }
  });
});

export default app;
