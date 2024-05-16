const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/pemws',
    createProxyMiddleware({
      target: 'https://10.15.102.181:29443/',
      pathRewrite: { '^/pemws': '/pemws' },
      changeOrigin: true,
      logLevel: 'debug',
      secure: false
    })
  );
  app.use(
    '/rest',
    createProxyMiddleware({
      target: 'https://10.15.102.181:16101/',
      pathRewrite: { '^/rest': '/rest' },
      changeOrigin: true,
      logLevel: 'debug',
      secure: false
    })
  );
  app.use(
    '/sponsors/cashbank/v2/activityDefinitions',
    createProxyMiddleware({
      target: 'http://10.2.117.227:9080/',
      pathRewrite: { '^/sponsors/cashbank/v2/activityDefinitions': '/sponsors/cashbank/v2/activityDefinitions' },
      changeOrigin: true,
      logLevel: 'debug',
      secure: false
    })
  );
};
