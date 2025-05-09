"use strict";

var handleError = function handleError(res, error, message) {
  console.error("[ERROR] ".concat(message, ":"), error.message);
  res.status(500).json({
    success: false,
    message: message,
    error: error.message
  });
};
module.exports = {
  handleError: handleError
};