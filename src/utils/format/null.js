const formatNull = (value) => {
    if (value === null || value === '' || value === 0) return null;
    return value;
};

module.exports = { formatNull };
