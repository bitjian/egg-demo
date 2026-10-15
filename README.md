# demo-app：egg-coral-base 使用示例

本地开发引用框架：`dependencies` 里 `"egg-coral-base": "file:../egg-coral-base"`（发布到公网 npm 后改成 `"^0.1.0"`）。

## 启动

```bash
npm i
npm run dev            # 多进程（Master+Agent+Worker，默认）
npm run start:single   # 单进程（行为同旧 coral，内存缓存直接可用）
```

## 演示点

| 路由 | 演示什么 |
|---|---|
| `GET /` | Controller 基类 + 当前运行模式 |
| `GET /hello/:name` | **目录式路由**（coral 约定：`app/router/*.js` 自动加载） |
| `GET /api/users` | **Service**（`ctx.service.user` 每请求一个实例） |
| `GET /api/safecurl-demo?url=<公网地址>` | **safeCurl** 正常放行公网 |
| `GET /api/safecurl-demo?url=http://127.0.0.1:7001/` | **SSRF 防护**：内网地址被默认黑名单拦截 |

另见 `app/schedule/heartbeat.js`：egg-schedule 定时任务（把 `disable` 改 `false` 观察日志）。

## 上线前必改

- `config/config.default.js` 的 `keys` 换成强随机值
- 需要数据库时开 `exports.knex`；需要共享缓存/session 时加 `@eggjs/redis`
