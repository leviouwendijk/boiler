const fs = require('fs');
const path = require('path');
const util = require('util');

const logFile = fs.createWriteStream(path.join(__dirname, '../server.log'), { flags: 'a' });

function formatArgs(args) {
    return args
        .map(arg =>
            typeof arg === 'object'
            ? util.inspect(arg, { depth: null, colors: false, maxArrayLength: null })
            : String(arg)
        )
        .join(' ');
}

const log = (...args) => {
    const message = formatArgs(args);
    const timestamp = new Date().toISOString();
    logFile.write(`[LOG]   ${timestamp} - ${message}\n`);
    process.stdout.write(`${timestamp} [LOG]   ${message}\n`);
};

const err = (...args) => {
    const message = formatArgs(args);
    const timestamp = new Date().toISOString();
    logFile.write(`[ERROR] ${timestamp} - ${message}\n`);
    process.stderr.write(`${timestamp} [ERROR] ${message}\n`);
};

module.exports = { log, err };
