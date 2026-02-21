"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var util = require("util");
function isPlainObject(v) {
  if (!v || _typeof(v) !== "object") return false;
  var proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}
function isExpressRequest(v) {
  return !!(v && _typeof(v) === "object" && typeof v.method === "string" && (typeof v.originalUrl === "string" || typeof v.url === "string") && typeof v.get === "function");
}
function isExpressResponse(v) {
  return !!(v && _typeof(v) === "object" && typeof v.status === "function" && typeof v.json === "function" && ("headersSent" in v || "statusCode" in v));
}
function trimString(s, cfg) {
  if (typeof s !== "string") return s;
  var max = cfg.maxString;
  if (max === null || max === undefined) return s;
  if (s.length <= max) return s;
  return s.slice(0, max) + "\u2026 (truncated ".concat(s.length - max, " chars)");
}
function trimStack(stack, cfg) {
  if (typeof stack !== "string") return stack;
  if (cfg.stack === "none") return undefined;
  if (cfg.stack === "full") return stack;
  var n = cfg.stackLines;
  if (n === null || n === undefined) return stack;
  var lines = stack.split("\n");
  if (lines.length <= n) return stack;
  return lines.slice(0, n).join("\n") + "\n\u2026 (trimmed ".concat(lines.length - n, " lines)");
}
function summarizeExpressReq(req) {
  var headers = req.headers || {};
  return {
    type: "ExpressRequest",
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    xff: headers["x-forwarded-for"],
    ua: headers["user-agent"],
    contentType: headers["content-type"]
  };
}
function summarizeExpressRes(res) {
  var out = {
    type: "ExpressResponse",
    statusCode: res.statusCode,
    headersSent: res.headersSent
  };
  if (res.req && isExpressRequest(res.req)) {
    out.req = {
      method: res.req.method,
      url: res.req.originalUrl || res.req.url
    };
  }
  if (res.locals && _typeof(res.locals) === "object") {
    out.localsKeys = Object.keys(res.locals).slice(0, 30);
  }
  return out;
}
function summarizeAxiosError(e, cfg) {
  var data;
  try {
    if (e && e.response) {
      data = trimString(util.inspect(e.response.data, {
        depth: 3,
        colors: false
      }), cfg);
    }
  } catch (_) {
    data = "[Unserializable axios response data]";
  }
  return {
    type: "AxiosError",
    name: e && e.name,
    message: e && e.message,
    code: e && e.code,
    method: e && e.config && e.config.method,
    url: e && e.config && e.config.url,
    status: e && e.response && e.response.status,
    statusText: e && e.response && e.response.statusText,
    data: data,
    stack: trimStack(e && e.stack, cfg)
  };
}
function summarizeError(e, cfg) {
  if (!e || _typeof(e) !== "object") return e;

  // Axios-shaped
  if (e.isAxiosError || e.response || e.config) {
    return summarizeAxiosError(e, cfg);
  }
  if (e instanceof Error) {
    return {
      type: "Error",
      name: e.name,
      message: e.message,
      code: e.code,
      cause: e.cause ? summarizeError(e.cause, cfg) : undefined,
      stack: trimStack(e.stack, cfg)
    };
  }
  return e;
}
function toPlain(value, depth, seen, cfg) {
  if (value === null || value === undefined) return value;
  var t = _typeof(value);
  if (t === "string") return trimString(value, cfg);
  if (t === "number" || t === "boolean" || t === "bigint") return value;
  if (t === "symbol") return value.toString();
  if (t === "function") return "[Function".concat(value.name ? ": ".concat(value.name) : "", "]");
  if (t !== "object") return String(value);
  if (!seen) seen = new WeakSet();
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  if (isExpressRequest(value)) return summarizeExpressReq(value);
  if (isExpressResponse(value)) return summarizeExpressRes(value);

  // Error objects
  var summarizedErr = summarizeError(value, cfg);
  if (summarizedErr !== value) return summarizedErr;
  if (Buffer.isBuffer(value)) return "<Buffer length=".concat(value.length, ">");
  if (value instanceof Date) return value.toISOString();
  if (value instanceof RegExp) return value.toString();
  if (Array.isArray(value)) {
    if (depth <= 0) return "[Array(".concat(value.length, ")]");
    var max = cfg.maxArray;
    var sliced = value.slice(0, max === null || max === undefined ? value.length : max).map(function (v) {
      return toPlain(v, depth - 1, seen, cfg);
    });
    if (max !== null && max !== undefined && value.length > max) {
      sliced.push("\u2026 (".concat(value.length - max, " more items)"));
    }
    return sliced;
  }
  if (value instanceof Map) {
    if (depth <= 0) return "[Map(".concat(value.size, ")]");
    var _max = cfg.maxArray;
    var _out = [];
    var i = 0;
    var _iterator = _createForOfIteratorHelper(value.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          k = _step$value[0],
          v = _step$value[1];
        if (_max !== null && _max !== undefined && i >= _max) break;
        _out.push([toPlain(k, depth - 1, seen, cfg), toPlain(v, depth - 1, seen, cfg)]);
        i += 1;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (_max !== null && _max !== undefined && value.size > _max) {
      _out.push("\u2026 (".concat(value.size - _max, " more entries)"));
    }
    return {
      type: "Map",
      entries: _out
    };
  }
  if (value instanceof Set) {
    if (depth <= 0) return "[Set(".concat(value.size, ")]");
    var _max2 = cfg.maxArray;
    var _out2 = [];
    var _i = 0;
    var _iterator2 = _createForOfIteratorHelper(value.values()),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _v = _step2.value;
        if (_max2 !== null && _max2 !== undefined && _i >= _max2) break;
        _out2.push(toPlain(_v, depth - 1, seen, cfg));
        _i += 1;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (_max2 !== null && _max2 !== undefined && value.size > _max2) {
      _out2.push("\u2026 (".concat(value.size - _max2, " more values)"));
    }
    return {
      type: "Set",
      values: _out2
    };
  }
  if (depth <= 0) {
    return isPlainObject(value) ? "[Object]" : "[".concat(value.constructor ? value.constructor.name : "Object", "]");
  }

  // Drop Symbol keys by only enumerating string keys
  var out = {};
  var keys = Object.keys(value);
  var maxKeys = cfg.maxKeys;
  var limited = keys.slice(0, maxKeys === null || maxKeys === undefined ? keys.length : maxKeys);
  var _iterator3 = _createForOfIteratorHelper(limited),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _k = _step3.value;
      try {
        out[_k] = toPlain(value[_k], depth - 1, seen, cfg);
      } catch (e) {
        out[_k] = "[Unserializable: ".concat(e && e.message ? e.message : "error", "]");
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  if (maxKeys !== null && maxKeys !== undefined && keys.length > maxKeys) {
    out.__truncatedKeys__ = keys.length - maxKeys;
  }
  if (!isPlainObject(value) && value.constructor && value.constructor.name && value.constructor.name !== "Object") {
    out.__type__ = value.constructor.name;
  }
  return out;
}
module.exports = {
  toPlain: toPlain
};