import { Module } from '@nestjs/common';

import { FrontendProxyMiddleware } from './frontend-proxy.middleware';

@Module({
  providers: [FrontendProxyMiddleware],
  exports: [FrontendProxyMiddleware],
})
export class FrontendProxyModule {}
