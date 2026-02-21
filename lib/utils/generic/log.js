"use strict";

var fs = require("fs");
var path = require("path");
var _require = require("./logger-config.js"),
  configure = _require.configure,
  buildEffectiveConfig = _require.buildEffectiveConfig;
var _require2 = require("./logger-format.js"),
  extractMeta = _require2.extractMeta,
  formatArgs = _require2.formatArgs,
  formatContent = _require2.formatContent;

// Keep backward compatible default location, but allow override
var LOG_FILE = process.env.BOILER_LOG_FILE || path.join(__dirname, "../server.log");
function ensureDirForFile(filePath) {
  var dir = path.dirname(filePath);
  try {
    fs.mkdirSync(dir, {
      recursive: true
    });
  } catch (_) {
    // ignore; writeStream will error if it truly cannot write
  }
}
ensureDirForFile(LOG_FILE);
var logFile = fs.createWriteStream(LOG_FILE, {
  flags: "a"
});
function writeLine(level, message, cfg) {
  var timestamp = new Date().toISOString();

  // File format matches your old behavior:
  // [LOG]   {timestamp} - {message}
  // [ERROR] {timestamp} - {message}
  if (level === "ERROR") {
    logFile.write("".concat(cfg.filePrefixErr).concat(timestamp).concat(cfg.fileDash).concat(message, "\n"));
    process.stderr.write("".concat(timestamp, " [ERROR] ").concat(message, "\n"));
    return;
  }
  logFile.write("".concat(cfg.filePrefixLog).concat(timestamp).concat(cfg.fileDash).concat(message, "\n"));
  process.stdout.write("".concat(timestamp, " [LOG]   ").concat(message, "\n"));
}
function emit(level, rawArgs) {
  var _extractMeta = extractMeta(rawArgs),
    args = _extractMeta.args,
    meta = _extractMeta.meta;
  var cfg = buildEffectiveConfig(meta && meta.config ? meta.config : null);
  var message = formatArgs(args, cfg);
  if (meta && meta.content !== undefined) {
    message += " " + formatContent(meta.content, cfg);
  }
  writeLine(level, message, cfg);
}
function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  emit("LOG", args);
}
function err() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  emit("ERROR", args);
}
module.exports = {
  log: log,
  err: err,
  configure: configure
};

// const fs = require('fs');
// const path = require('path');
// const util = require('util');

// const logFile = fs.createWriteStream(path.join(__dirname, '../server.log'), { flags: 'a' });

// function formatArgs(args) {
//     return args
//         .map(arg =>
//             typeof arg === 'object'
//             ? util.inspect(arg, { depth: null, colors: false, maxArrayLength: null })
//             : String(arg)
//         )
//         .join(' ');
// }

// const log = (...args) => {
//     const message = formatArgs(args);
//     const timestamp = new Date().toISOString();
//     logFile.write(`[LOG]   ${timestamp} - ${message}\n`);
//     process.stdout.write(`${timestamp} [LOG]   ${message}\n`);
// };

// const err = (...args) => {
//     const message = formatArgs(args);
//     const timestamp = new Date().toISOString();
//     logFile.write(`[ERROR] ${timestamp} - ${message}\n`);
//     process.stderr.write(`${timestamp} [ERROR] ${message}\n`);
// };

// module.exports = { log, err };