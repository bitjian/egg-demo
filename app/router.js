'use strict';
module.exports = app => {
  app.get('/', app.controller.home.index);
  app.get('/api/users', app.controller.api.users);
  app.get('/api/safecurl-demo', app.controller.api.safeCurlDemo);
};
