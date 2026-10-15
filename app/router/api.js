'use strict';
// coral 风格：app/router/ 目录下的文件由框架自动加载（与 router.js 共存）
module.exports = app => {
  app.get('/hello/:name', app.controller.home.hello);
};
