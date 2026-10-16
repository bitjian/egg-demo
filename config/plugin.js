'use strict';

// 插件开启中心：
// - Egg 已内置启用 onerror/session/security/static/view/schedule 等，无需重复声明
// - egg-coral-base 0.2.x 已启用 routerPlus，不需要重复声明
// - 这里只放"额外加装"的第三方插件；配套连接配置写在 config.default.js
module.exports = {
  // ---- 数据库（对应 config.default.js 的 config.knex）----
  // 开启前：npm i mysql2，并确保本地 MySQL 已启动（127.0.0.1:3306）
  // exports.knex = { enable: true };

  // ---- Redis（对应 config.default.js 的 config.redis）----
  // 开启前：npm i @eggjs/redis，并确保本地 Redis 已启动（127.0.0.1:6379）
  // exports.redis = { enable: true, package: '@eggjs/redis' };

  // ---- Session 存入 Redis（多实例共享登录态；需与上面 redis 插件一起开）----
  // 开启前：npm i egg-session-redis
  // exports.sessionRedis = { enable: true, package: 'egg-session-redis' };
};
