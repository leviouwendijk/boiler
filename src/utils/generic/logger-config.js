const DEFAULTS = {
    // Output shaping
    depth: envNumber("BOILER_LOG_DEPTH", 4),             // null => "very deep" (see normalizeDepth)
    hardDepth: envNumber("BOILER_LOG_HARD_DEPTH", 50),   // safety cap when depth is null
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

let GLOBAL = { ...DEFAULTS };

function envNumber(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined || raw === null || raw === "") return fallback;

    const n = Number(raw);
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

    const n = Number(depth);
    if (!Number.isFinite(n)) return hardDepth;
    if (n < 0) return 0;

    return Math.floor(n);
}

function getConfig() {
    // Always keep normalized values in the public config
    return {
        ...GLOBAL,
        stack: normalizeStackMode(GLOBAL.stack),
        depth: normalizeDepth(GLOBAL.depth, GLOBAL.hardDepth)
    };
}

function configure(next = {}) {
    if (!next || typeof next !== "object") return;

    GLOBAL = {
        ...GLOBAL,
        ...next
    };
}

function buildEffectiveConfig(perCallOverrides) {
    if (!perCallOverrides || typeof perCallOverrides !== "object") {
        return getConfig();
    }

    const merged = {
        ...GLOBAL,
        ...perCallOverrides
    };

    return {
        ...merged,
        stack: normalizeStackMode(merged.stack),
        depth: normalizeDepth(merged.depth, merged.hardDepth)
    };
}

module.exports = {
    configure,
    getConfig,
    buildEffectiveConfig
};
