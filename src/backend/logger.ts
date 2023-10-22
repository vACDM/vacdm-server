import winston from 'winston';

import getConfig from './config';

const { logging } = getConfig();

const transports = [
  new winston.transports.File({
    filename: 'app.log',
    level: logging.levelFile,
  }),
  new winston.transports.Console({
    level: logging.levelConsole,
    format: winston.format.colorize({ all: true }),
  }),
];

const logger = winston.createLogger({
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports,
});

winston.addColors({
  error: 'brightRed',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'brightBlue',
  debug: 'brightCyan',
  silly: 'gray',
});

process.on('warning', e => logger.warn('%o', e));
process.on('uncaughtException', e => logger.error('%o', e));
process.on('unhandledRejection', e => logger.error('%o', e));

export default logger;
