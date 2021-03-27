/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://wanning-open-0gbztc9h2bcb19f0-1300942068.ap-shanghai.service.tcloudbase.com/backend',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'https://wanning-open-0gbztc9h2bcb19f0-1300942068.ap-shanghai.service.tcloudbase.com/backend',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
