"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function convertToSnakeCase(input) {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}
function convertToCamelCase(input) {
  return input.split('_').map(function (word, index) {
    return index === 0 ? word : word[0].toUpperCase() + word.slice(1);
  }).join('');
}
function transformKeys(obj, transformer) {
  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return transformKeys(item, transformer);
    });
  } else if (obj !== null && _typeof(obj) === 'object') {
    return Object.entries(obj).reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      acc[transformer(key)] = transformKeys(value, transformer);
      return acc;
    }, {});
  }
  return obj;
}

// New utility function to handle mixed arrays or exclude raw SQL
function transformWithExclusions(input, transformer) {
  var exclusions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (Array.isArray(input)) {
    return input.map(function (item) {
      if (exclusions.includes(item) || typeof item === "string" && item.includes("(")) {
        // Exclude raw SQL or explicitly excluded items
        return item;
      }
      return typeof item === "string" ? transformer(item) : transformKeys(item, transformer);
    });
  }
  if (typeof input === "string") {
    return exclusions.includes(input) || input.includes("(") ? input : transformer(input);
  }
  if (_typeof(input) === "object" && input !== null) {
    return transformKeys(input, transformer);
  }
  return input; // Return unchanged for other types
}
var CaseUtils = {
  makeSnake: function makeSnake(obj) {
    var exclusions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (typeof obj === "string") {
      return convertToSnakeCase(obj);
    }
    return transformWithExclusions(obj, convertToSnakeCase, exclusions);
  },
  makeCamel: function makeCamel(obj) {
    var exclusions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (typeof obj === "string") {
      return convertToCamelCase(obj);
    }
    return transformWithExclusions(obj, convertToCamelCase, exclusions);
  },
  transformKeys: transformKeys // Expose for advanced usage
};
module.exports = CaseUtils;