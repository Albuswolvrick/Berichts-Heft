const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Middleware that checks if the user is authenticated via session.
 */
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    next(new UnauthorizedError());
  }
}

/**
 * Middleware that checks if the user has an ADMIN or MANAGER role.
 */
function isAdminOrManager(req, res, next) {
  if (req.user && ['ADMIN', 'MANAGER'].includes(req.user.role)) {
    next();
  } else {
    next(new ForbiddenError());
  }
}

/**
 * Middleware factory that checks if the user has one of the specified roles.
 * @param {string[]} roles - Allowed roles
 */
function hasRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError());
    }
    next();
  };
}

module.exports = { isAuthenticated, isAdminOrManager, hasRole };
