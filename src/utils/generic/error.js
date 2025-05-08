const handleError = (res, error, message) => {
    console.error(`[ERROR] ${message}:`, error.message);
    res.status(500).json({
        success: false,
        message,
        error: error.message,
    });
};

module.exports = { handleError };
