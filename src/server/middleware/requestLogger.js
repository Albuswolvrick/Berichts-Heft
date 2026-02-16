const logger = require('../utils/logger');

/**
 * Request logging middleware.
 * Logs method, URL, status code, and response time for each request.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}

module.exports = { requestLogger };
