import { createLogger, format, transports } from 'winston';
const { colorize, combine, printf, timestamp } = format;

const defaultFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), defaultFormat),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
});

logger.add(
  new transports.Console({
    format: combine(colorize(), defaultFormat),
  })
);

export default logger;
