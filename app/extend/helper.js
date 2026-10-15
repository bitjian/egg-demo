'use strict';

/**
 * Helper 扩展示例：这里导出的方法都会挂到 ctx.helper 上
 * 适合放"统一响应格式"、"通用格式化"这类与请求相关的工具函数
 * 文档：https://v3.eggjs.org/zh-CN/basics/extend#helper
 */
module.exports = {
  // 统一成功响应体：{ code: 0, data }
  ok(data) {
    return { code: 0, data };
  },

  // 统一失败响应体：{ code: 1, msg }
  fail(msg) {
    return { code: 1, msg };
  },
};
