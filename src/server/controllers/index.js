const authController = require('./authController');
const userController = require('./userController');
const { createReportController } = require('./reportController');

module.exports = {
  authController,
  userController,
  createReportController,
};
