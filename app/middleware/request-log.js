'use strict';

/**
 * 自定义中间件示例：记录每个请求的方法/路径/状态码/耗时
 *
 * 启用方式：config.default.js 中 config.middleware = ['requestLog']
 * 传参方式：config.requestLog = { xxx: 1 }（options 参数接收，可做开关/阈值等）
 */
module.exports = (options, app) => {
  // options = config.requestLog；app 为全局应用对象
  return async function requestLog(ctx, next) {
    const start = Date.now();
    try {
      await next();
    } finally {
      const cost = Date.now() - start;
      ctx.logger.info('[request-log] %s %s -> %s (%sms)', ctx.method, ctx.originalUrl, ctx.status, cost);
    }
  };
};
