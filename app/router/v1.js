'use strict';

// 框架 0.2.0 内置 egg-router-plus：自动加载本文件，不需在 app/router.js 手动 require。
// namespace('/v1') 只给本组添加前缀，不影响 /、/api/users 等其他路由。
// 第二个参数是分组中间件：仅访问本组接口时返回 x-route-group: v1。
// 不再调用全局 router.prefix()，也不需要在每个接口重复拼接 /v1。
module.exports = app => {
  const { controller } = app;
  const v1 = app.router.namespace('/v1', async (ctx, next) => {
    ctx.set('x-route-group', 'v1');
    await next();
  });

  v1.get('v1.time', '/time', controller.advanced.time);
  v1.get('v1.ping', '/ping', controller.advanced.ping);
};
