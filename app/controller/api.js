'use strict';

const { Controller } = require('egg-coral-base');

class ApiController extends Controller {
  // Service 懒加载演示：ctx.service.user 每个请求一个实例
  async users() {
    const users = await this.service.user.list();
    this.ctx.body = { code: 0, data: users };
  }

  // ctx.safeCurl SSRF 防护演示：
  // 公网地址正常放行；内网地址（127.0.0.1/10.x/192.168.x 等）默认拦截
  async safeCurlDemo() {
    const { ctx } = this;
    const target = ctx.query.url || 'https://httpbin.org/get';
    try {
      const res = await ctx.safeCurl(target, { timeout: 3000, dataType: 'json' });
      ctx.body = { code: 0, target, data: res.data };
    } catch (err) {
      ctx.body = { code: 1, target, msg: `被 SSRF 防护拦截或请求失败：${err.message}` };
    }
  }
}

module.exports = ApiController;
