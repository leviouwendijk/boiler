"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var fs = require('fs');
var path = require('path');
var util = require('util');
var logFile = fs.createWriteStream(path.join(__dirname, '../server.log'), {
  flags: 'a'
});
function formatArgs(args) {
  return args.map(function (arg) {
    return _typeof(arg) === 'object' ? util.inspect(arg, {
      depth: null,
      colors: false,
      maxArrayLength: null
    }) : String(arg);
  }).join(' ');
}
var log = function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var message = formatArgs(args);
  var timestamp = new Date().toISOString();
  logFile.write("[LOG]   ".concat(timestamp, " - ").concat(message, "\n"));
  process.stdout.write("".concat(timestamp, " [LOG]   ").concat(message, "\n"));
};
var err = function err() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  var message = formatArgs(args);
  var timestamp = new Date().toISOString();
  logFile.write("[ERROR] ".concat(timestamp, " - ").concat(message, "\n"));
  process.stderr.write("".concat(timestamp, " [ERROR] ").concat(message, "\n"));
};
module.exports = {
  log: log,
  err: err
};