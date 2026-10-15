'use strict';

const { Service } = require('egg-coral-base');

class UserService extends Service {
  async list() {
    // 真实项目这里查库：await app.knex.get('db1').select('*').from('user')
    return [
      { id: 1, name: 'alice' },
      { id: 2, name: 'bob' },
    ];
  }
}

module.exports = UserService;
