import { NextFunction, Request, Response } from 'express';

import Logger from '@dotfionn/logger';
const logger = new Logger('vACDM:api:request');

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.log(`request: ${new Date().toISOString()} | ${req.ip} | ${req.method} ${req.originalUrl || req.url}`);

  let stringifiedBody = JSON.stringify(req.body, undefined, 2);

  if(stringifiedBody != "{}") {
    let bodyLines = stringifiedBody.split("\n");

    for (let line of bodyLines) {
      logger.debug(`body:    ${line}`)
    }
  }
  
  next();
}

export default loggerMiddleware;
