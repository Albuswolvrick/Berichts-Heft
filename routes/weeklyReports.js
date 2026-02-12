const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new weekly report
router.post('/', isAuthenticated, async (req, res) => {
  const { title, summary, goals, learnings, challenges, weekNumber, year, reportDate } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.weeklyReport.create({
      data: {
        title,
        summary,
        goals,
        learnings,
        challenges,
        weekNumber,
        year,
        reportDate: new Date(reportDate),
        userId,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create weekly report:', error);
    res.status(500).json({ error: 'Failed to create weekly report' });
  }
});

// Get all weekly reports for the current user
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {
    const reports = await prisma.weeklyReport.findMany({
      where: { userId },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get weekly reports:', error);
    res.status(500).json({ error: 'Failed to get weekly reports' });
  }
});

// Get all weekly reports for a given date range (for admins/managers)
router.get('/all', isAuthenticated, isAdminOrManager, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }

  try {
    const reports = await prisma.weeklyReport.findMany({
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
    console.error('Failed to get weekly reports:', error);
    res.status(500).json({ error: 'Failed to get weekly reports' });
  }
});

// Get a single weekly report by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const report = await prisma.weeklyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
        return res.status(403).json({ error: 'You are not authorized to view this report' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Failed to get weekly report:', error);
    res.status(500).json({ error: 'Failed to get weekly report' });
  }
});

// Update a weekly report
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, summary, goals, learnings, challenges, status } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.weeklyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to edit this report' });
    }

    const updatedReport = await prisma.weeklyReport.update({
      where: { id: parseInt(id) },
      data: {
        title,
        summary,
        goals,
        learnings,
        challenges,
        status,
      },
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Failed to update weekly report:', error);
    res.status(500).json({ error: 'Failed to update weekly report' });
  }
});

// Delete a weekly report
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const report = await prisma.weeklyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
        return res.status(404).json({ error: 'Weekly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to delete this report' });
    }

    await prisma.weeklyReport.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete weekly report:', error);
    res.status(500).json({ error: 'Failed to delete weekly report' });
  }
});

module.exports = router;
