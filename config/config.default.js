'use strict';

module.exports = appInfo => {
  const config = {};

  // ⚠️ Cookie/Session 签名密钥：生产环境必须换成强随机值
  config.keys = `${appInfo.name}_demo_keys_change_me`;

  // 纯 API demo 关闭 CSRF；含表单/页面的项目请保持默认开启
  config.security = { csrf: { enable: false } };

  // ------------------------------------------------------------------
  // 自定义中间件挂载（实现见 app/middleware/request-log.js）
  // 数组顺序 = 执行顺序；同名 config（config.requestLog）会作为 options 传入中间件
  // ------------------------------------------------------------------
  config.middleware = ['requestLog'];

  // ------------------------------------------------------------------
  // 数据库配置（knex 插件，单实例写法）
  // 开启步骤：① npm i mysql2   ② config/plugin.js 里 exports.knex = { enable: true }
  // 代码用法见 app/service/db-demo.js（app.knex.select / insert / update / del）
  // ------------------------------------------------------------------
  // config.knex = {
  //   client: 'mysql2',
  //   connection: {
  //     host: '127.0.0.1',
  //     port: 3306,
  //     user: 'root',
  //     password: '123456',      // ⚠️ 示例值；真实密码用环境变量注入，不要提交进 git
  //     database: 'demo',
  //     timezone: '+08:00',
  //   },
  // };

  // 多实例写法（同时连多个库）：代码里用 app.knex.get('db1') / app.knex.get('db2')
  // config.knex = {
  //   clients: {
  //     db1: { client: 'mysql2', connection: { host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'demo' } },
  //     db2: { client: 'mysql2', connection: { host: '127.0.0.1', port: 3307, user: 'root', password: '123456', database: 'demo2' } },
  //   },
  // };

  // ------------------------------------------------------------------
  // Redis 配置（@eggjs/redis 插件）
  // 开启步骤：① npm i @eggjs/redis   ② config/plugin.js 里 exports.redis = { enable: true, package: '@eggjs/redis' }
  // 代码用法见 app/controller/advanced.js 的 redisDemo（app.redis.set / get）
  // ------------------------------------------------------------------
  // config.redis = {
  //   client: {
  //     host: '127.0.0.1',
  //     port: 6379,
  //     password: '',            // 本地无密码留空
  //     db: 0,
  //   },
  // };

  // Session 外置存储（可选）：npm i egg-session-redis 后在 plugin.js 开启 sessionRedis，
  // 开启后 ctx.session 自动存 Redis，多进程/多实例共享登录态

  return config;
};
