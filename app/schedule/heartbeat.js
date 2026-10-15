'use strict';

// egg-schedule 定时任务：由 Agent 统一分发，多进程下也只执行一次
// 把 disable 改为 false 后，每 30 秒在日志里打一条心跳
module.exports = {
  schedule: {
    interval: '30s',
    type: 'worker',
    disable: true,
  },
  async task(ctx) {
    ctx.app.coreLogger.info('[demo-schedule] heartbeat', new Date().toISOString());
  },
};
