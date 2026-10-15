'use strict';

const { Service } = require('egg-coral-base');

/**
 * knex 数据库用法速查（需开启 knex 插件后生效）
 * 单实例：app.knex 直接用；多实例：app.knex.get('db1')
 */
class DbDemoService extends Service {
  async listUsers() {
    const { app } = this;
    const db = app.knex; // 多实例时改为：app.knex.get('db1')

    // 查询列表
    const rows = await db.select('*').from('users').limit(10);

    // 常用写法速查（都支持链式调用，参数自动防 SQL 注入）：
    // await db('users').where({ id: 1 }).first();                 // 查单条
    // await db('users').where('age', '>', 18).orderBy('id', 'desc');
    // await db('users').insert({ name: 'alice', age: 18 });       // 插入
    // await db('users').where({ id: 1 }).update({ age: 19 });     // 更新
    // await db('users').where({ id: 1 }).del();                   // 删除
    // await db.count('* as total').from('users');                 // 聚合
    // await db.transaction(async trx => {                         // 事务
    //   await trx('users').insert({ name: 'bob' });
    //   await trx('logs').insert({ action: 'add_user' });
    // });
    // 原生 SQL：await db.raw('select now()');

    return rows;
  }
}

module.exports = DbDemoService;
