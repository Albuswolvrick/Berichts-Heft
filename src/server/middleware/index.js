const { isAuthenticated, isAdminOrManager, hasRole } = require('./auth');
const { errorHandler } = require('./errorHandler');
const { requestLogger } = require('./requestLogger');

module.exports = {
  isAuthenticated,
  isAdminOrManager,
  hasRole,
  errorHandler,
  requestLogger,
};
