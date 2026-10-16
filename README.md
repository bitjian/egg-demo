# demo-app：egg-coral-base 使用示例

使用公网发布的 `egg-coral-base` 0.2.x（`"egg-coral-base": "^0.2.0"`），内置 `egg-router-plus` 路由分组。
`.npmrc` 已配置公网源（registry.npmjs.org），`npm i` 自动生效。

## 启动

```bash
npm i
npm run dev            # 多进程（Master+Agent+Worker，默认）
npm run start:single   # 单进程（行为同旧 coral，内存缓存直接可用）
```

默认访问地址：`http://127.0.0.1:8013`。单进程模式可通过 `PORT` 环境变量覆盖端口。

## 演示点

| 路由 | 演示什么 | 备注 |
|---|---|---|
| `GET /` | Controller 基类 + 当前运行模式 | |
| `GET /hello/:name` | **目录式路由**（`app/router/**/*.js` 递归自动加载） | 子文件先于 `app/router.js` 执行 |
| `GET /api/users` | **Service**（`ctx.service` 每请求一实例） | |
| `GET /api/safecurl-demo?url=` | **safeCurl**：公网放行 / 内网拦截 | 内网示例：`?url=http://127.0.0.1:8013/` |
| `GET /api/db-demo` | **数据库 knex**（未开启时返回开启指引） | 开启步骤见 `config/plugin.js` 注释 |
| `GET /api/redis-demo` | **Redis**（未开启时返回开启指引） | 开启步骤见 `config/plugin.js` 注释 |
| `GET /api/helper-demo` | **helper 统一响应**（`ctx.helper.ok/fail`） | 扩展见 `app/extend/helper.js` |
| `GET /api/error-demo` | **统一错误处理**（`ctx.throw`） | 不带参数返回 400 |
| `GET /v1/time`、`GET /v1/ping` | **命名空间分组**（`app.router.namespace('/v1')`） | 分组中间件返回 `x-route-group: v1`，不影响其他接口 |
| （每个请求） | **自定义中间件**：耗时日志 | 见 `app/middleware/request-log.js` |
| （30s 一次） | **固定间隔任务** | `app/schedule/heartbeat.js`，当前已开启 |
| （每 5 分钟整点） | **cron + 所有 Worker 刷新缓存** | `app/schedule/refresh-cache.js`，默认关闭 |
| （每天凌晨 3 点） | **cron + 指定时区生成报表** | `app/schedule/daily-report.js`，默认关闭 |

## 路由分组说明

`app/router/v1.js` 使用 `app.router.namespace('/v1', middleware)` 获取分组，
在组内注册 `/time` 和 `/ping`，最终路径就是 `/v1/time`、`/v1/ping`。

- `/`、`/api/users` 等普通路由保持原路径，不会被加上 `/v1`。
- 分组中间件只作用于本组；可用 `curl -i http://127.0.0.1:8013/v1/ping` 查看 `x-route-group: v1`。
- 使用 `v1.time`、`v1.ping` 命名路由，可通过 `app.url('v1.ping')` 得到 `/v1/ping`。
- 框架已自动加载 `app/router/**/*.js`，不要在 `app/router.js` 再次手动调用这些文件。
- 新分组写完整前缀，例如 `namespace('/api/users')`；不要混用全局 `router.prefix()`，也不要在组内重复添加前缀。

## 定时任务：interval、cron 与多个任务

一个文件对应一个任务，`app/schedule/` 会被自动加载，无需在路由或入口注册：

| 文件 | 时间规则 | 执行范围 | 任务内容 |
|---|---|---|---|
| `heartbeat.js` | `interval: '30s'` | `worker`：当前实例选一个 Worker | 打印心跳 |
| `refresh-cache.js` | `cron: '0 */5 * * * *'` | `all`：当前实例每个 Worker | 从示例 UserService 读取数据，更新各自的 `app.demoUserCache` |
| `daily-report.js` | `cron: '0 0 3 * * *'`，`tz: 'Asia/Shanghai'` | `worker`：当前实例选一个 Worker | 生成用户数量摘要并记录日志，不发送邮件 |

cron 六段格式为 **秒 分 时 日 月 星期**，也支持省略秒的五段格式。
`interval` 按间隔运行，cron 按钟表时间运行，通常二选一；任务代码放在 `async task(ctx)` 中。

常用 cron：`'*/30 * * * * *'` 每分钟第 0、30 秒；`'0 0 * * * *'` 每小时整点；
`'0 0 9 * * 1'` 每周一上午 9 点。`cronOptions.tz` 显式控制时区。

开启新增示例：

1. 将对应文件的 `schedule.disable` 改成 `false`，然后重启应用。
2. 需要启动后先执行一次时可添加 `immediate: true`，之后继续按规则触发。
3. 查看 `logs/` 的任务日志；缓存只在执行任务的 Worker 内存中，不是共享存储。

需要手动验证任务逻辑时，在测试或应用启动完成后调用 `await app.runSchedule('daily-report.js')`。
此方法直接运行一次任务，即使 `disable: true` 也可以执行，**不会等待 cron 时间，也不验证自动调度或分发**。
示例测试使用真实 UserService，不依赖 MySQL、Redis、邮件或外部接口。

注意：

- 多个独立任务分文件，不能依赖它们的触发或完成顺序；同一业务流程在一个 `task` 内依次 `await`。
- `worker` 不代表多机器/多容器全局只执行一次；每个应用实例都有自己的调度器。
- 任务超过间隔时间时可能重叠，框架不自动排队；重要操作需要幂等、防重入或正确的分布式锁。
- `all` 适用于更新各自的内存缓存，不适合发送同一份通知、扣库存等操作。

## 测试

```bash
npm test
```

回归覆盖真实两 Worker 集群和单进程：根路由、目录路由、分组前缀与中间件隔离、
Service、Helper、400 错误处理、数据库/Redis 未启用提示及 loopback SSRF 拦截。
数据库与 Redis 默认关闭，以上测试不代表实际连接服务已验证。

## 接入 MySQL / Redis（本地）

1. 装驱动并开启插件（`config/plugin.js` 里取消注释）：
   - MySQL：`npm i mysql2`，本地启动 MySQL（127.0.0.1:3306）
   - Redis：`npm i @eggjs/redis`，本地启动 Redis（127.0.0.1:6379）
   - Session 外置：`npm i egg-session-redis`
2. 连接配置在 `config/config.default.js`（已写好 127.0.0.1 + 常用端口模板，取消注释即可）
3. 用法示例：`app/service/db-demo.js`（knex CRUD 速查）、`app/controller/advanced.js`（redis 读写）

## 上线前必改

- `config/config.default.js` 的 `keys` 换成强随机值
- 数据库/Redis 密码用环境变量注入，不要提交进 git
- 多进程部署下共享状态（缓存/计数/锁）放 Redis，不放内存变量
