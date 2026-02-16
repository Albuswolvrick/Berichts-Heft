const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const { createReportRouter } = require('./reports');
const {
  dailyReportService,
  weeklyReportService,
  monthlyReportService,
  yearlyReportService,
} = require('../services');

const router = express.Router();

// Auth & User routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Report routes
router.use('/daily-reports', createReportRouter(dailyReportService));
router.use('/weekly-reports', createReportRouter(weeklyReportService));
router.use('/monthly-reports', createReportRouter(monthlyReportService));
router.use('/yearly-reports', createReportRouter(yearlyReportService));

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
