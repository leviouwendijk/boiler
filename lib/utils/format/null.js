"use strict";

var formatNull = function formatNull(value) {
  if (value === null || value === '' || value === 0) return null;
  return value;
};
module.exports = {
  formatNull: formatNull
};