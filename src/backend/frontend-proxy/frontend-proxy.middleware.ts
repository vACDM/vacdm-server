import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import getAppConfig from '../config';

const { frontendProxy } = getAppConfig();

@Injectable()
export class FrontendProxyMiddleware implements NestMiddleware {
  proxyMiddleware: (req: Request, res: Response, next: NextFunction) => void;

  async use(req: Request, res: Response, next: NextFunction) {
    if (!frontendProxy) next();

    if (!this.proxyMiddleware) {
      const { createProxyMiddleware } = await import('http-proxy-middleware');

      this.proxyMiddleware = createProxyMiddleware({
        target: frontendProxy,
        changeOrigin: true,
        ws: true,
      });
    }

    return this.proxyMiddleware(req, res, next);
  }
}
