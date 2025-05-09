"use strict";

var getClientIp = function getClientIp(req) {
  var _req$headers$xForwar;
  return req.headers['x-client-ip'] || ((_req$headers$xForwar = req.headers['x-forwarded-for']) === null || _req$headers$xForwar === void 0 || (_req$headers$xForwar = _req$headers$xForwar.split(',')[0]) === null || _req$headers$xForwar === void 0 ? void 0 : _req$headers$xForwar.trim()) || req.ip;
};
module.exports = {
  getClientIp: getClientIp
};