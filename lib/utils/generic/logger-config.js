"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DEFAULTS = {
  // Output shaping
  depth: envNumber("BOILER_LOG_DEPTH", 4),
  // null => "very deep" (see normalizeDepth)
  hardDepth: envNumber("BOILER_LOG_HARD_DEPTH", 50),
  // safety cap when depth is null
  maxKeys: envNumber("BOILER_LOG_MAX_KEYS", 80),
  maxArray: envNumber("BOILER_LOG_MAX_ARRAY", 50),
  maxString: envNumber("BOILER_LOG_MAX_STRING", 2000),
  // Stack formatting
  // "none" | "trim" | "full"
  stack: (process.env.BOILER_LOG_STACK || "trim").toLowerCase(),
  stackLines: envNumber("BOILER_LOG_STACK_LINES", 10),
  // Optional: include timestamped file output format compatibility
  filePrefixLog: "[LOG]   ",
  filePrefixErr: "[ERROR] ",
  fileDash: " - "
};
var GLOBAL = _objectSpread({}, DEFAULTS);
function envNumber(name, fallback) {
  var raw = process.env[name];
  if (raw === undefined || raw === null || raw === "") return fallback;
  var n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}
function normalizeStackMode(mode) {
  if (mode === "none" || mode === "trim" || mode === "full") return mode;
  return "trim";
}
function normalizeDepth(depth, hardDepth) {
  // depth:
  // - number: that depth
  // - null/undefined: "very deep" but capped by hardDepth
  if (depth === null || depth === undefined) return hardDepth;
  var n = Number(depth);
  if (!Number.isFinite(n)) return hardDepth;
  if (n < 0) return 0;
  return Math.floor(n);
}
function getConfig() {
  // Always keep normalized values in the public config
  return _objectSpread(_objectSpread({}, GLOBAL), {}, {
    stack: normalizeStackMode(GLOBAL.stack),
    depth: normalizeDepth(GLOBAL.depth, GLOBAL.hardDepth)
  });
}
function configure() {
  var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (!next || _typeof(next) !== "object") return;
  GLOBAL = _objectSpread(_objectSpread({}, GLOBAL), next);
}
function buildEffectiveConfig(perCallOverrides) {
  if (!perCallOverrides || _typeof(perCallOverrides) !== "object") {
    return getConfig();
  }
  var merged = _objectSpread(_objectSpread({}, GLOBAL), perCallOverrides);
  return _objectSpread(_objectSpread({}, merged), {}, {
    stack: normalizeStackMode(merged.stack),
    depth: normalizeDepth(merged.depth, merged.hardDepth)
  });
}
module.exports = {
  configure: configure,
  getConfig: getConfig,
  buildEffectiveConfig: buildEffectiveConfig
};