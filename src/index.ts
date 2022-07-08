import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';

import logger from './config/logger';

const app: Application = express();

const port = process.env.PORT || 5000;

app.listen(port, () =>
  logger.info({
    label: 'Application',
    message: `Server running on port ${port}`,
  })
);
