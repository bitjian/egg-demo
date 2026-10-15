'use strict';

module.exports = appInfo => {
  const config = {};

  // 生产环境务必换成强随机值
  config.keys = `${appInfo.name}_demo_keys_change_me`;

  // 纯 API demo 关闭 CSRF；含表单/页面的项目请保持默认开启
  config.security = { csrf: { enable: false } };

  // 出站请求 SSRF 防护默认已开启（内网黑名单）；
  // 如需放行特定内网段：config.security.ssrf.ipBlackList = ['10.0.0.0/8']

  return config;
};
