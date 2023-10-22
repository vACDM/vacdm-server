import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      // target: 'https://vacdm.vatsim-germany.org',
      changeOrigin: true,
    }),
  );
}
