'use strict';

module.exports = app => {
  const { router, controller } = app;

  // ---- 基础演示 ----
  router.get('/', controller.home.index);
  router.get('/api/users', controller.api.users);                    // Service 懒加载
  router.get('/api/safecurl-demo', controller.api.safeCurlDemo);     // safeCurl + SSRF 防护

  // ---- 进阶演示（app/controller/advanced.js）----
  router.get('/api/db-demo', controller.advanced.dbDemo);            // 数据库（需开启 knex 插件）
  router.get('/api/redis-demo', controller.advanced.redisDemo);      // Redis（需开启 redis 插件）
  router.get('/api/helper-demo', controller.advanced.helperDemo);    // helper 统一响应格式
  router.get('/api/error-demo', controller.advanced.errorDemo);      // 统一错误处理 ctx.throw

  // ---- 路由前缀演示：/v1/time、/v1/ping（见 app/router/v1.js）----
};
