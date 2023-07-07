import Logger from '@dotfionn/logger';
import { NextFunction, Request, Response } from 'express';

const logger = new Logger('vACDM:api:request');

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.log(`request: ${new Date().toISOString()} | ${req.ip} | ${req.method} ${req.originalUrl || req.url}`);

  const stringifiedBody = JSON.stringify(req.body, undefined, 2);

  if (stringifiedBody != '{}') {
    const bodyLines = stringifiedBody.split('\n');

    for (const line of bodyLines) {
      logger.debug(`body:    ${line}`);
    }
  }
  
  next();
}

export default loggerMiddleware;
