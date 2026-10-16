'use strict';

// 固定间隔示例：每隔 30 秒打印心跳，不要求对齐钟表的第 0、30 秒。
// type: 'worker' 表示每次由当前 Egg 实例中的一个 Worker 执行，不保证跨机器只执行一次。
// disable: false 已开启；改为 true 关闭自动运行。
// 若需严格按钟表每分钟的第 0、30 秒执行，可替换为 cron: '*/30 * * * * *'（删掉 interval）。
module.exports = {
  schedule: {
    interval: '30s',
    type: 'worker',
    disable: false,
  },
  async task(ctx) {
    ctx.app.coreLogger.info('[demo-schedule] heartbeat', new Date().toISOString());
  },
};
