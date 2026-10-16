'use strict';

const assert = require('assert');
const path = require('path');
const { createRequire } = require('module');
const mock = require('egg-mock');

// 使用 egg-schedule 实际依赖的解析器验证 cron，不另引入一套调度实现。
const cronParser = createRequire(require.resolve('egg-schedule/package.json'))('cron-parser');

describe('schedule examples', () => {
  let app;

  function job(name) {
    const entry = app.schedules[path.join(process.cwd(), 'app/schedule', name)];
    assert(entry, `Schedule ${name} should be loaded`);
    return entry;
  }

  before(async () => {
    app = mock.app({ baseDir: process.cwd(), cache: false });
    await app.ready();
  });

  after(async () => {
    if (app) await app.close();
  });

  it('loads the existing interval heartbeat configuration', () => {
    const { schedule } = job('heartbeat.js');
    assert.strictEqual(schedule.interval, '30s');
    assert.strictEqual(schedule.type, 'worker');
    assert.strictEqual(typeof schedule.disable, 'boolean');
  });

  it('loads the cache refresh cron for every worker without auto-running', () => {
    const { schedule } = job('refresh-cache.js');
    assert.strictEqual(schedule.cron, '0 */5 * * * *');
    assert.strictEqual(schedule.type, 'all');
    assert.strictEqual(schedule.disable, true);
    assert.strictEqual(app.demoUserCache, undefined);
    const next = cronParser.parseExpression(schedule.cron, {
      currentDate: '2026-10-16T00:01:00Z',
      tz: 'Asia/Shanghai',
    }).next().toISOString();
    assert.strictEqual(next, '2026-10-16T00:05:00.000Z');
  });

  it('loads the daily report for 03:00 in Asia/Shanghai', () => {
    const { schedule } = job('daily-report.js');
    assert.strictEqual(schedule.cron, '0 0 3 * * *');
    assert.strictEqual(schedule.cronOptions.tz, 'Asia/Shanghai');
    assert.strictEqual(schedule.type, 'worker');
    assert.strictEqual(schedule.disable, true);
    const next = cronParser.parseExpression(schedule.cron, {
      ...schedule.cronOptions,
      currentDate: '2026-10-16T02:59:00+08:00',
    }).next().toISOString();
    assert.strictEqual(next, '2026-10-15T19:00:00.000Z');
  });

  it('can manually run the heartbeat without waiting for the interval', async () => {
    await app.runSchedule('heartbeat.js');
  });

  it('refreshes the process-local cache through the real UserService', async () => {
    await app.runSchedule('refresh-cache.js');
    assert.deepStrictEqual(app.demoUserCache.users, [
      { id: 1, name: 'alice' },
      { id: 2, name: 'bob' },
    ]);
    assert(Number.isFinite(Date.parse(app.demoUserCache.updatedAt)));
  });

  it('returns a report summary without external delivery', async () => {
    const summary = await app.runSchedule('daily-report.js');
    assert.strictEqual(summary.userCount, 2);
    assert(Number.isFinite(Date.parse(summary.generatedAt)));
  });

  it('does not modify the cache when running a different task', async () => {
    await app.runSchedule('refresh-cache.js');
    const cache = app.demoUserCache;
    await app.runSchedule('daily-report.js');
    assert.strictEqual(app.demoUserCache, cache);
  });
});
