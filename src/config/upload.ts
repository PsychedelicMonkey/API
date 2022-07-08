import path from 'path';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png/;

  const extension = filetypes.test(path.extname(file.originalname));
  const mimetype = filetypes.test(file.mimetype);

  if (extension && mimetype) {
    return cb(null, true);
  }

  return cb(new Error('only images are allowed'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 1000000000 },
  fileFilter,
}).single('image');
