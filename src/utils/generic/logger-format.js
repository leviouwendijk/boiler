const util = require("util");
const { toPlain } = require("./logger-serialize.js");

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
    if (!v || typeof v !== "object") return false;
    if (Array.isArray(v)) return false;

    const keys = Object.keys(v);
    if (keys.length === 0) return false;

    for (const k of keys) {
        if (k !== "content" && k !== "config") return false;
    }

    return Object.prototype.hasOwnProperty.call(v, "content")
        || Object.prototype.hasOwnProperty.call(v, "config");
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
        return { args: [], meta: null };
    }

    const last = args[args.length - 1];
    if (!isMetaObject(last)) {
        return { args, meta: null };
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

    const t = typeof arg;

    if (t === "string") {
        // string trimming is done in toPlain too, but keeping this fast path is fine
        const max = cfg.maxString;
        if (max !== null && max !== undefined && arg.length > max) {
            return arg.slice(0, max) + `… (truncated ${arg.length - max} chars)`;
        }
        return arg;
    }

    if (t === "number" || t === "boolean" || t === "bigint") return String(arg);
    if (t === "symbol") return arg.toString();
    if (t === "function") return `[Function${arg.name ? `: ${arg.name}` : ""}]`;

    const plain = toPlain(arg, cfg.depth, undefined, cfg);
    return util.inspect(plain, {
        depth: null,
        colors: false,
        maxArrayLength: null,
        breakLength: 140,
        compact: 3
    });
}

function formatArgs(args, cfg) {
    return (args || []).map((a) => formatOne(a, cfg)).join(" ");
}

function formatContent(content, cfg) {
    const plain = toPlain(content, cfg.depth, undefined, cfg);
    return util.inspect(plain, {
        depth: null,
        colors: false,
        maxArrayLength: null,
        breakLength: 140,
        compact: 3
    });
}

module.exports = {
    extractMeta,
    formatArgs,
    formatContent
};
