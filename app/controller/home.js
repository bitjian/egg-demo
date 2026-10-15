'use strict';

const { Controller } = require('egg-coral-base');

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      message: 'hello egg-coral-base',
      mode: process.env.EGG_SINGLE_PROCESS === '1' ? 'single-process' : 'multi-process',
    };
  }

  async hello() {
    this.ctx.body = { hello: this.ctx.params.name };
  }
}

module.exports = HomeController;
