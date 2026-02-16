/**
 * Wraps an async route handler to catch errors and forward them to Express error handling.
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Wrapped handler
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { asyncHandler };
