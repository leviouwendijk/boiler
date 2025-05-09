"use strict";

var fs = require('fs');
var path = require('path');
function resolveEnvPath(levelsUp, target) {
  var resolvedPath = path.resolve(__dirname, '../'.repeat(levelsUp) + 'env/' + target);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error("Path does not exist: ".concat(resolvedPath));
  }
  return resolvedPath;
}
module.exports = {
  resolveEnvPath: resolveEnvPath
};