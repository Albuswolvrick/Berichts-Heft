const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new daily report
router.post('/', isAuthenticated, async (req, res) => {
  const { title, activities, learnings, challenges, hoursWorked, reportDate } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.dailyReport.create({
      data: {
        title,
        activities,
        learnings,
        challenges,
        hoursWorked,
        reportDate: new Date(reportDate),
        userId,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create daily report:', error);
    res.status(500).json({ error: 'Failed to create daily report' });
  }
});

// Get all daily reports for the current user
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {
    const reports = await prisma.dailyReport.findMany({
      where: { userId },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get daily reports:', error);
    res.status(500).json({ error: 'Failed to get daily reports' });
  }
});

// Get all daily reports for a given date range (for admins/managers)
router.get('/all', isAuthenticated, isAdminOrManager, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }

  try {
    const reports = await prisma.dailyReport.findMany({
      where: {
        reportDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        user: {
          select: {
            username: true,
          }
        }
      }
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get daily reports:', error);
    res.status(500).json({ error: 'Failed to get daily reports' });
  }
});

// Get a single daily report by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const report = await prisma.dailyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Daily report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
        return res.status(403).json({ error: 'You are not authorized to view this report' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Failed to get daily report:', error);
    res.status(500).json({ error: 'Failed to get daily report' });
  }
});

// Update a daily report
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, activities, learnings, challenges, hoursWorked, status } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.dailyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Daily report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to edit this report' });
    }

    const updatedReport = await prisma.dailyReport.update({
      where: { id: parseInt(id) },
      data: {
        title,
        activities,
        learnings,
        challenges,
        hoursWorked,
        status,
      },
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Failed to update daily report:', error);
    res.status(500).json({ error: 'Failed to update daily report' });
  }
});

// Delete a daily report
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const report = await prisma.dailyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
        return res.status(404).json({ error: 'Daily report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to delete this report' });
    }

    await prisma.dailyReport.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete daily report:', error);
    res.status(500).json({ error: 'Failed to delete daily report' });
  }
});

module.exports = router;
