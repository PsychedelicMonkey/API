import path from 'path';
import express, { Application, NextFunction, Request, Response } from 'express';
import sharp from 'sharp';

import { upload } from './config/upload';
import auth from './middleware/authMiddleware';
import User from './models/User';

// Initialize express
const app: Application = express();

// Set static folder
app.use(express.static('public/'));

// Upload endpoint
app.post('/upload', auth, (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err) => {
    try {
      if (err) throw err;

      if (req.file) {
        const { fieldname, buffer, originalname } = req.file;

        const filename = `${fieldname}-${Date.now()}${path.extname(
          originalname
        )}`;

        // Resize image
        await sharp(buffer).resize(200, 200).toFile(`public/${filename}`);

        // Update avatar
        const user = await User.findByIdAndUpdate(
          req.user.id,
          {
            avatar: `http://localhost:5000/${filename}`,
          },
          { new: true }
        );
        return res.json(user);
      }
    } catch (err) {
      if (err instanceof Error) return res.send(err.message);
    }
  });
});

export default app;
