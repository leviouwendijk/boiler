const util = require("util");

function isPlainObject(v) {
    if (!v || typeof v !== "object") return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
}

function isExpressRequest(v) {
    return !!(v &&
        typeof v === "object" &&
        typeof v.method === "string" &&
        (typeof v.originalUrl === "string" || typeof v.url === "string") &&
        typeof v.get === "function");
}

function isExpressResponse(v) {
    return !!(v &&
        typeof v === "object" &&
        typeof v.status === "function" &&
        typeof v.json === "function" &&
        ("headersSent" in v || "statusCode" in v));
}

function trimString(s, cfg) {
    if (typeof s !== "string") return s;

    const max = cfg.maxString;
    if (max === null || max === undefined) return s;
    if (s.length <= max) return s;

    return s.slice(0, max) + `… (truncated ${s.length - max} chars)`;
}

function trimStack(stack, cfg) {
    if (typeof stack !== "string") return stack;

    if (cfg.stack === "none") return undefined;
    if (cfg.stack === "full") return stack;

    const n = cfg.stackLines;
    if (n === null || n === undefined) return stack;

    const lines = stack.split("\n");
    if (lines.length <= n) return stack;

    return lines.slice(0, n).join("\n") + `\n… (trimmed ${lines.length - n} lines)`;
}

function summarizeExpressReq(req) {
    const headers = req.headers || {};
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
    const out = {
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

    if (res.locals && typeof res.locals === "object") {
        out.localsKeys = Object.keys(res.locals).slice(0, 30);
    }

    return out;
}

function summarizeAxiosError(e, cfg) {
    let data;
    try {
        if (e && e.response) {
            data = trimString(util.inspect(e.response.data, { depth: 3, colors: false }), cfg);
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
        data,
        stack: trimStack(e && e.stack, cfg)
    };
}

function summarizeError(e, cfg) {
    if (!e || typeof e !== "object") return e;

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

    const t = typeof value;

    if (t === "string") return trimString(value, cfg);
    if (t === "number" || t === "boolean" || t === "bigint") return value;
    if (t === "symbol") return value.toString();
    if (t === "function") return `[Function${value.name ? `: ${value.name}` : ""}]`;

    if (t !== "object") return String(value);

    if (!seen) seen = new WeakSet();
    if (seen.has(value)) return "[Circular]";
    seen.add(value);

    if (isExpressRequest(value)) return summarizeExpressReq(value);
    if (isExpressResponse(value)) return summarizeExpressRes(value);

    // Error objects
    const summarizedErr = summarizeError(value, cfg);
    if (summarizedErr !== value) return summarizedErr;

    if (Buffer.isBuffer(value)) return `<Buffer length=${value.length}>`;
    if (value instanceof Date) return value.toISOString();
    if (value instanceof RegExp) return value.toString();

    if (Array.isArray(value)) {
        if (depth <= 0) return `[Array(${value.length})]`;

        const max = cfg.maxArray;
        const sliced = value
            .slice(0, max === null || max === undefined ? value.length : max)
            .map((v) => toPlain(v, depth - 1, seen, cfg));

        if (max !== null && max !== undefined && value.length > max) {
            sliced.push(`… (${value.length - max} more items)`);
        }

        return sliced;
    }

    if (value instanceof Map) {
        if (depth <= 0) return `[Map(${value.size})]`;

        const max = cfg.maxArray;
        const out = [];
        let i = 0;

        for (const [k, v] of value.entries()) {
            if (max !== null && max !== undefined && i >= max) break;
            out.push([toPlain(k, depth - 1, seen, cfg), toPlain(v, depth - 1, seen, cfg)]);
            i += 1;
        }

        if (max !== null && max !== undefined && value.size > max) {
            out.push(`… (${value.size - max} more entries)`);
        }

        return { type: "Map", entries: out };
    }

    if (value instanceof Set) {
        if (depth <= 0) return `[Set(${value.size})]`;

        const max = cfg.maxArray;
        const out = [];
        let i = 0;

        for (const v of value.values()) {
            if (max !== null && max !== undefined && i >= max) break;
            out.push(toPlain(v, depth - 1, seen, cfg));
            i += 1;
        }

        if (max !== null && max !== undefined && value.size > max) {
            out.push(`… (${value.size - max} more values)`);
        }

        return { type: "Set", values: out };
    }

    if (depth <= 0) {
        return isPlainObject(value) ? "[Object]" : `[${value.constructor ? value.constructor.name : "Object"}]`;
    }

    // Drop Symbol keys by only enumerating string keys
    const out = {};
    const keys = Object.keys(value);

    const maxKeys = cfg.maxKeys;
    const limited = keys.slice(0, maxKeys === null || maxKeys === undefined ? keys.length : maxKeys);

    for (const k of limited) {
        try {
            out[k] = toPlain(value[k], depth - 1, seen, cfg);
        } catch (e) {
            out[k] = `[Unserializable: ${e && e.message ? e.message : "error"}]`;
        }
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
    toPlain
};
