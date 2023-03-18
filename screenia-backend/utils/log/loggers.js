import { options } from './config';

const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
  exceptionHandlers: [
      new winston.transports.File(options.fileExceptions)
  ]
});

export default logger;