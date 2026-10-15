'use strict';

const { Controller } = require('egg-coral-base');

class AdvancedController extends Controller {
  /**
   * 数据库演示（需开启 knex 插件，步骤见 config/plugin.js）
   * 未开启时优雅降级：返回开启指引而不是报 500
   */
  async dbDemo() {
    const { ctx, app } = this;
    if (!app.knex) {
      ctx.body = ctx.helper.fail('knex 未启用：npm i mysql2 + config/plugin.js 开启 knex + 本地启动 MySQL(3306)');
      return;
    }
    const users = await ctx.service.dbDemo.listUsers();
    ctx.body = ctx.helper.ok(users);
  }

  /**
   * Redis 演示（需开启 redis 插件，步骤见 config/plugin.js）
   * 用法：app.redis.set / get / del，与 ioredis API 一致
   */
  async redisDemo() {
    const { ctx, app } = this;
    if (!app.redis) {
      ctx.body = ctx.helper.fail('redis 未启用：npm i @eggjs/redis + config/plugin.js 开启 redis + 本地启动 Redis(6379)');
      return;
    }
    await app.redis.set('demo:ts', String(Date.now()));
    ctx.body = ctx.helper.ok({ 'demo:ts': await app.redis.get('demo:ts') });
  }

  // helper 统一响应格式演示（app/extend/helper.js）
  async helperDemo() {
    const { ctx } = this;
    ctx.body = ctx.helper.ok({ tip: '所有接口用 ctx.helper.ok/fail 包一层，前端处理更统一' });
  }

  // 统一错误处理演示：ctx.throw 抛出的错误由 egg-onerror 兜底
  // 带参数 ?id=1 正常返回；不带参数返回 400（curl 加 -i 可看状态码）
  async errorDemo() {
    const { ctx } = this;
    const id = Number(ctx.query.id);
    if (!id) ctx.throw(400, '缺少参数 id（试试 ?id=1）');
    ctx.body = ctx.helper.ok({ id, square: id * id });
  }

  // 以下两个配合 /v1 前缀路由（app/router/v1.js）
  async time() {
    const { ctx } = this;
    ctx.body = ctx.helper.ok({ now: new Date().toISOString() });
  }

  async ping() {
    this.ctx.body = 'pong';
  }
}

module.exports = AdvancedController;
