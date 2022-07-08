import { connect } from 'mongoose';
import logger from './logger';

const connectDB = async () => {
  try {
    const str: string = process.env.MONGO_URI || '';

    const conn = await connect(str);
    logger.info({
      label: 'MongoDB',
      message: `MongoDB connected: ${conn.connection.host}`,
    });
  } catch (err) {
    logger.error({ label: 'MongoDB', message: err });
    process.exit(1);
  }
};

export default connectDB;
