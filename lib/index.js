"use strict";

// index.js

// utils/
// ../format/
var _require = require("./utils/format/null.js"),
  formatNull = _require.formatNull;
var _require2 = require("./utils/format/object.js"),
  renameKeys = _require2.renameKeys,
  deleteKeys = _require2.deleteKeys;

// ../generic/
var _require3 = require("./utils/generic/log.js"),
  log = _require3.log,
  err = _require3.err,
  configure = _require3.configure;
var _require4 = require("./utils/generic/error.js"),
  handleError = _require4.handleError;
var _require5 = require("./utils/generic/path.js"),
  resolveEnvPath = _require5.resolveEnvPath;

// ../networking/
var _require6 = require("./utils/networking/ip.js"),
  getClientIp = _require6.getClientIp;
module.exports = {
  // utils/
  // ../format/
  formatNull: formatNull,
  renameKeys: renameKeys,
  deleteKeys: deleteKeys,
  // ../generic/
  log: log,
  err: err,
  configure: configure,
  handleError: handleError,
  resolveEnvPath: resolveEnvPath,
  // ../networking/
  getClientIp: getClientIp
};