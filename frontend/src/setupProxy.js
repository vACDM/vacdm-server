const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:3030',
      target: 'http://vacdm.dotfionn.de',
      changeOrigin: true,
    })
  );
};
