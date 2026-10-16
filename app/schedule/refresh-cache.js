'use strict';

// 一个文件对应一个任务：每 5 分钟更新当前 Worker 的用户列表内存缓存。
// cron 六段格式：秒 分 时 日 月 星期；下面表示每小时第 0、5、10……分钟的第 0 秒。
// 与 interval: '5m' 不同，cron 会对齐钟表时间，而不是从启动时间起每隔 5 分钟。
module.exports = {
  schedule: {
    cron: '0 */5 * * * *',
    cronOptions: { tz: 'Asia/Shanghai' },
    // 更新的是各自的进程内存，因此需要 all，让每个 Worker 都刷新自己的那份缓存。
    // 这些副本并不共享；不要把此策略用于扣库存、发送消息等不能重复的操作。
    type: 'all',
    // 默认关闭；需要观察时改为 false。可加 immediate: true 在启动后先执行一次。
    disable: true,
  },
  async task(ctx) {
    // 使用已有的示例 Service，无需连接数据库或 Redis，也不会发送外部请求。
    const users = await ctx.service.user.list();
    const cache = { users, updatedAt: new Date().toISOString() };
    ctx.app.demoUserCache = cache;
    ctx.app.coreLogger.info('[demo-schedule] user cache refreshed: %s users', users.length);
    return cache;
  },
};
