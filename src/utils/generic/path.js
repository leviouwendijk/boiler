const fs = require('fs');
const path = require('path');

function resolveEnvPath(levelsUp, target) {
    const resolvedPath = path.resolve(__dirname, '../'.repeat(levelsUp) + 'env/' + target);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Path does not exist: ${resolvedPath}`);
    }
    return resolvedPath;
}

module.exports = { resolveEnvPath };
