# demo-app：egg-coral-base 使用示例

本地开发引用框架：发布 npm 后可改 `"egg-coral-base": "^0.1.0"`。
`.npmrc` 已配置公网源（registry.npmjs.org），`npm i` 自动生效。

## 启动

```bash
npm i
npm run dev            # 多进程（Master+Agent+Worker，默认）
npm run start:single   # 单进程（行为同旧 coral，内存缓存直接可用）
```

## 演示点

| 路由 | 演示什么 | 备注 |
|---|---|---|
| `GET /` | Controller 基类 + 当前运行模式 | |
| `GET /hello/:name` | **目录式路由**（`app/router/*.js` 自动加载） | |
| `GET /api/users` | **Service**（`ctx.service` 每请求一实例） | |
| `GET /api/safecurl-demo?url=` | **safeCurl**：公网放行 / 内网拦截 | 内网示例：`?url=http://127.0.0.1:7001/` |
| `GET /api/db-demo` | **数据库 knex**（未开启时返回开启指引） | 开启步骤见 `config/plugin.js` 注释 |
| `GET /api/redis-demo` | **Redis**（未开启时返回开启指引） | 开启步骤见 `config/plugin.js` 注释 |
| `GET /api/helper-demo` | **helper 统一响应**（`ctx.helper.ok/fail`） | 扩展见 `app/extend/helper.js` |
| `GET /api/error-demo` | **统一错误处理**（`ctx.throw`） | 不带参数返回 400 |
| `GET /v1/time`、`GET /v1/ping` | **路由前缀**（`router.prefix('/v1')`） | 见 `app/router/v1.js` |
| （每个请求） | **自定义中间件**：耗时日志 | 见 `app/middleware/request-log.js` |
| （30s 一次） | **定时任务** egg-schedule | `app/schedule/heartbeat.js`，改 `disable:false` 观察 |

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
