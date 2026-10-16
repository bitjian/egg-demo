'use strict';
// routerPlus 自动加载 app/router/**/*.js，先于 app/router.js 执行；主文件不要再次 require 本文件。
module.exports = app => {
  app.get('/hello/:name', app.controller.home.hello);
};
