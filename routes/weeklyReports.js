const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new weekly report
router.post('/', isAuthenticated, async (req, res) => {
  const { weekStart, weekEnd, weekNumber, summary, activities, instructions, school, department, totalHours, status } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.weeklyReport.create({
      data: {
        userId,
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        weekNumber,
        summary,
        activities,
        instructions,
        school,
        department,
        totalHours,
        status,
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
      orderBy: { weekStart: 'desc' },
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
  const where = {};

  if (startDate && endDate) {
      where.weekStart = { gte: new Date(startDate) };
      where.weekEnd = { lte: new Date(endDate) };
  }

  try {
      const reports = await prisma.weeklyReport.findMany({
          where,
          include: {
              user: {
                  select: {
                      name: true,
                  },
              },
          },
          orderBy: { weekStart: 'desc' },
      });
      res.status(200).json(reports);
  } catch (error) {
      console.error('Failed to get all weekly reports:', error);
      res.status(500).json({ error: 'Failed to get all weekly reports' });
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
  const { summary, activities, instructions, school, department, totalHours, status } = req.body;
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
        summary,
        activities,
        instructions,
        school,
        department,
        totalHours,
        status,
      },
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Failed to update weekly report:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
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
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete weekly report' });
  }
});

module.exports = router;
