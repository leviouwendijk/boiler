const fs = require("fs");
const path = require("path");

const { configure, buildEffectiveConfig } = require("./logger-config.js");
const { extractMeta, formatArgs, formatContent } = require("./logger-format.js");

// Keep backward compatible default location, but allow override
const LOG_FILE = process.env.BOILER_LOG_FILE || path.join(__dirname, "../server.log");

function ensureDirForFile(filePath) {
    const dir = path.dirname(filePath);
    try {
        fs.mkdirSync(dir, { recursive: true });
    } catch (_) {
        // ignore; writeStream will error if it truly cannot write
    }
}

ensureDirForFile(LOG_FILE);

const logFile = fs.createWriteStream(LOG_FILE, { flags: "a" });

function writeLine(level, message, cfg) {
    const timestamp = new Date().toISOString();

    // File format matches your old behavior:
    // [LOG]   {timestamp} - {message}
    // [ERROR] {timestamp} - {message}
    if (level === "ERROR") {
        logFile.write(`${cfg.filePrefixErr}${timestamp}${cfg.fileDash}${message}\n`);
        process.stderr.write(`${timestamp} [ERROR] ${message}\n`);
        return;
    }

    logFile.write(`${cfg.filePrefixLog}${timestamp}${cfg.fileDash}${message}\n`);
    process.stdout.write(`${timestamp} [LOG]   ${message}\n`);
}

function emit(level, rawArgs) {
    const { args, meta } = extractMeta(rawArgs);
    const cfg = buildEffectiveConfig(meta && meta.config ? meta.config : null);

    let message = formatArgs(args, cfg);

    if (meta && meta.content !== undefined) {
        message += " " + formatContent(meta.content, cfg);
    }

    writeLine(level, message, cfg);
}

function log(...args) {
    emit("LOG", args);
}

function err(...args) {
    emit("ERROR", args);
}

module.exports = {
    log,
    err,
    configure
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
