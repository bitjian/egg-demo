'use strict';
// 单进程启动（行为与旧 coral 一致）；多进程开发/生产用 npm run dev / npm start
require('egg-coral-base/single')({
  baseDir: __dirname,
  port: process.env.PORT === undefined ? 8013 : Number(process.env.PORT),
});
