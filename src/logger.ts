import path from 'path';
import { format, createLogger, transports } from 'winston';
const { combine, timestamp, printf } = format;

const customFormat = printf((prettyPrinting: any) => {
  const { level, message, timestamp } = prettyPrinting;
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), customFormat),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '..', 'logs', 'all.log'),
    }),
    new transports.File({
      level: 'error',
      filename: path.join(__dirname, '..', 'logs', 'errors.log'),
    }),
    new transports.Console(),
  ],
});

export default logger;
