function convertToSnakeCase(input) {
    return input.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function convertToCamelCase(input) {
    return input
        .split('_')
        .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
        .join('');
}

function transformKeys(obj, transformer) {
    if (Array.isArray(obj)) {
        return obj.map(item => transformKeys(item, transformer));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[transformer(key)] = transformKeys(value, transformer);
            return acc;
        }, {});
    }
    return obj;
}

// New utility function to handle mixed arrays or exclude raw SQL
function transformWithExclusions(input, transformer, exclusions = []) {
    if (Array.isArray(input)) {
        return input.map(item => {
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
    if (typeof input === "object" && input !== null) {
        return transformKeys(input, transformer);
    }
    return input; // Return unchanged for other types
}

const CaseUtils = {
    makeSnake(obj, exclusions = []) {
        if (typeof obj === "string") {
            return convertToSnakeCase(obj);
        }
        return transformWithExclusions(obj, convertToSnakeCase, exclusions);
    },

    makeCamel(obj, exclusions = []) {
        if (typeof obj === "string") {
            return convertToCamelCase(obj);
        }
        return transformWithExclusions(obj, convertToCamelCase, exclusions);
    },

    transformKeys, // Expose for advanced usage
};

module.exports = CaseUtils;
