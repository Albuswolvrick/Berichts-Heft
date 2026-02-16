const express = require('express');
const { authController } = require('../controllers');
const { asyncHandler } = require('../utils');

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', authController.logout);

module.exports = router;
