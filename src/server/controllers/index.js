const authController = require('./authController');
const userController = require('./userController');
const commentController = require('./commentController');
const { createReportController } = require('./reportController');

module.exports = {
  authController,
  userController,
  commentController,
  createReportController,
};
