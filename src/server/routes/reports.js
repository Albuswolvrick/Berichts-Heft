const express = require('express');
const { createReportController } = require('../controllers');
const { isAuthenticated, isAdminOrManager } = require('../middleware');
const { asyncHandler } = require('../utils');

/**
 * Creates a standard CRUD router for a report type.
 * @param {object} service - Report service instance
 * @returns {express.Router}
 */
function createReportRouter(service) {
  const controller = createReportController(service);
  const router = express.Router();

  router.post('/', isAuthenticated, asyncHandler(controller.create));
  router.get('/', isAuthenticated, asyncHandler(controller.listByUser));
  router.get('/all', isAuthenticated, isAdminOrManager, asyncHandler(controller.listAll));
  router.get('/:id', isAuthenticated, asyncHandler(controller.getById));
  router.put('/:id', isAuthenticated, asyncHandler(controller.update));
  router.delete('/:id', isAuthenticated, asyncHandler(controller.remove));

  return router;
}

module.exports = { createReportRouter };
