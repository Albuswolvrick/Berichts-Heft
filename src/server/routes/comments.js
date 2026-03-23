const express = require('express');
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middleware');
const { asyncHandler } = require('../utils');

const router = express.Router();

router.post('/', isAuthenticated, asyncHandler(commentController.create));
router.get('/:reportType/:reportId', isAuthenticated, asyncHandler(commentController.list));

module.exports = router;
