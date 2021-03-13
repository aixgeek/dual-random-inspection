/*
 * @Author: June Lue
 * @Date: 2020-09-17 13:57:15
 * @LastEditors: June Lue
 * @LastEditTime: 2020-09-25 15:10:57
 * @FilePath: \wanning\config\proxy.ts
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
