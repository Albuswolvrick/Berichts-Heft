const express = require('express');
const { userController } = require('../controllers');
const { isAuthenticated, hasRole } = require('../middleware');
const { asyncHandler } = require('../utils');

const router = express.Router();

router.get('/me', isAuthenticated, asyncHandler(userController.getMe));
router.get('/', isAuthenticated, hasRole(['ADMIN']), asyncHandler(userController.getAll));
router.post('/', isAuthenticated, hasRole(['ADMIN']), asyncHandler(userController.create));
router.put('/:id', isAuthenticated, hasRole(['ADMIN']), asyncHandler(userController.update));
router.put('/:id/password', isAuthenticated, hasRole(['ADMIN']), asyncHandler(userController.updatePassword));
router.delete('/:id', isAuthenticated, hasRole(['ADMIN']), asyncHandler(userController.remove));

module.exports = router;
