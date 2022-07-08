import config from 'config';
import { createLogger, format, transports } from 'winston';
const { colorize, combine, printf, timestamp } = format;

const DIR = config.get('logging.directory');

const FILES = {
  combined: `${DIR}${config.get('logging.files.combined')}`,
  error: `${DIR}${config.get('logging.files.error')}`,
  exceptions: `${DIR}${config.get('logging.files.exceptions')}`,
};

const defaultFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: config.get('logging.level'),
  format: combine(timestamp(), defaultFormat),
  transports: [
    new transports.File({ filename: FILES.error, level: 'error' }),
    new transports.File({ filename: FILES.combined }),
  ],
  exceptionHandlers: [new transports.File({ filename: FILES.exceptions })],
});

logger.add(
  new transports.Console({
    format: combine(colorize(), defaultFormat),
  })
);

export default logger;
