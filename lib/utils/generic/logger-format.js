"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var util = require("util");
var _require = require("./logger-serialize.js"),
  toPlain = _require.toPlain;

// function isMetaObject(v) {
//     if (!v || typeof v !== "object") return false;
//     if (Array.isArray(v)) return false;

//     const keys = Object.keys(v);
//     if (keys.length === 0) return false;

//     // Only consider meta if it ONLY contains reserved keys
//     for (const k of keys) {
//         if (k !== "content" && k !== "config") return false;
//     }

//     // Must contain at least one of them
//     return ("content" in v) || ("config" in v);
// }

function isMetaObject(v) {
  if (!v || _typeof(v) !== "object") return false;
  if (Array.isArray(v)) return false;
  var keys = Object.keys(v);
  if (keys.length === 0) return false;
  for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
    var k = _keys[_i];
    if (k !== "content" && k !== "config") return false;
  }
  return Object.prototype.hasOwnProperty.call(v, "content") || Object.prototype.hasOwnProperty.call(v, "config");
}

// function isMetaObject(v) {
//     if (!v || typeof v !== "object") return false;
//     if (Array.isArray(v)) return false;

//     // Only treat as meta if it looks like our reserved shape
//     return Object.prototype.hasOwnProperty.call(v, "content")
//         || Object.prototype.hasOwnProperty.call(v, "config");
// }

function extractMeta(args) {
  if (!args || args.length === 0) {
    return {
      args: [],
      meta: null
    };
  }
  var last = args[args.length - 1];
  if (!isMetaObject(last)) {
    return {
      args: args,
      meta: null
    };
  }
  return {
    args: args.slice(0, -1),
    meta: {
      content: last.content,
      config: last.config
    }
  };
}
function formatOne(arg, cfg) {
  if (arg === null || arg === undefined) return String(arg);
  var t = _typeof(arg);
  if (t === "string") {
    // string trimming is done in toPlain too, but keeping this fast path is fine
    var max = cfg.maxString;
    if (max !== null && max !== undefined && arg.length > max) {
      return arg.slice(0, max) + "\u2026 (truncated ".concat(arg.length - max, " chars)");
    }
    return arg;
  }
  if (t === "number" || t === "boolean" || t === "bigint") return String(arg);
  if (t === "symbol") return arg.toString();
  if (t === "function") return "[Function".concat(arg.name ? ": ".concat(arg.name) : "", "]");
  var plain = toPlain(arg, cfg.depth, undefined, cfg);
  return util.inspect(plain, {
    depth: null,
    colors: false,
    maxArrayLength: null,
    breakLength: 140,
    compact: 3
  });
}
function formatArgs(args, cfg) {
  return (args || []).map(function (a) {
    return formatOne(a, cfg);
  }).join(" ");
}
function formatContent(content, cfg) {
  var plain = toPlain(content, cfg.depth, undefined, cfg);
  return util.inspect(plain, {
    depth: null,
    colors: false,
    maxArrayLength: null,
    breakLength: 140,
    compact: 3
  });
}
module.exports = {
  extractMeta: extractMeta,
  formatArgs: formatArgs,
  formatContent: formatContent
};