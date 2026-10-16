'use strict';

// 每日任务示例：北京时间每天凌晨 3 点生成用户数量摘要。
// cron: '0 0 3 * * *' = 第 0 秒、第 0 分、第 3 小时、每天、每月、每个星期。
// 其他常用规则：'0 0 * * * *' 每小时整点；'0 0 9 * * 1' 每周一上午 9 点。
module.exports = {
  schedule: {
    cron: '0 0 3 * * *',
    // 显式指定时区，避免服务器使用 UTC 时偏移 8 小时。
    cronOptions: { tz: 'Asia/Shanghai' },
    // 当前 Egg 实例中选一个 Worker 执行；部署多个实例仍可能分别执行。
    type: 'worker',
    disable: true,
  },
  async task(ctx) {
    // 演示读取业务数据 -> 生成摘要 -> 记录日志；不真的发送邮件或写入外部系统。
    // 同一流程的多个步骤在一个 task 内依次 await，不依赖不同任务的执行顺序。
    const users = await ctx.service.user.list();
    const summary = { userCount: users.length, generatedAt: new Date().toISOString() };
    ctx.app.coreLogger.info('[demo-schedule] daily report: %j', summary);
    return summary;
  },
};
