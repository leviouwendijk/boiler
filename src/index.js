// index.js

// utils/
// ../format/
const { formatNull } = require("./utils/format/null.js");
const { renameKeys, deleteKeys } = require("./utils/format/object.js");

// ../generic/
const { log, err, configure } = require("./utils/generic/log.js");
const { handleError } = require("./utils/generic/error.js");
const { resolveEnvPath } = require("./utils/generic/path.js");

// ../networking/
const { getClientIp } = require("./utils/networking/ip.js");

module.exports = {
    // utils/
    // ../format/
    formatNull,
    renameKeys,
    deleteKeys,

    // ../generic/
    log,
    err,
    configure,
    handleError,
    resolveEnvPath,

    // ../networking/
    getClientIp
};
