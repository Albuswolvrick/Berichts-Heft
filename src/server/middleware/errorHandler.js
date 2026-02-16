const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Global error handler middleware.
 * Catches all errors thrown in route handlers and returns a consistent JSON response.
 */
function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    logger.warn(err.message, { statusCode: err.statusCode, path: req.path });
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Handle Prisma known errors
  if (err.code === 'P2002') {
    logger.warn('Unique constraint violation', { path: req.path });
    return res.status(409).json({ error: 'A record with this value already exists' });
  }

  if (err.code === 'P2025') {
    logger.warn('Record not found', { path: req.path });
    return res.status(404).json({ error: 'Record not found' });
  }

  // Unexpected errors
  logger.error('Unhandled error', { error: err.message, stack: err.stack, path: req.path });
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };
