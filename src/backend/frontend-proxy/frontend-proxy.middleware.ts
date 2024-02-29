import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import getAppConfig from '../config';

const { frontendProxy } = getAppConfig();

@Injectable()
export class FrontendProxyMiddleware implements NestMiddleware {
  proxyMiddleware: (req: Request, res: Response, next: NextFunction) => void;

  constructor() {
    this.proxyMiddleware = frontendProxy
      ? createProxyMiddleware({
        target: frontendProxy,
        changeOrigin: true,
        ws: true,
      })
      :  (req: Request, res: Response, next: NextFunction) => next();
  }

  use(req: Request, res: Response, next: NextFunction) {
    return this.proxyMiddleware(req, res, next); 
  }
}
