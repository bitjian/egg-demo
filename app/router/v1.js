'use strict';

// 路由前缀演示（生效路由：GET /v1/time、GET /v1/ping）
//
// ⚠️ 为什么不用 router.prefix('/v1')？
// app.router 是全局单例（app/ 与 app/router/ 下所有文件共用同一个实例），
// prefix() 会把"之前已注册的所有路由"统一改写前缀，导致 / 与 /api/* 全部 404。
// Egg 里推荐两种姿势：
//   1. 直接写全路径（如下，用常量拼接保持整洁）
//   2. 或者把前缀抽到 config，如 `${app.config.routePrefix}/time`
const PREFIX = '/v1';

module.exports = app => {
  const { router, controller } = app;

  router.get(`${PREFIX}/time`, controller.advanced.time);
  router.get(`${PREFIX}/ping`, controller.advanced.ping);
};
