const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new yearly report
router.post('/', isAuthenticated, async (req, res) => {
  const { title, summary, goals, learnings, challenges, year, reportDate } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.yearlyReport.create({
      data: {
        title,
        summary,
        goals,
        learnings,
        challenges,
        year,
        reportDate: new Date(reportDate),
        userId,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create yearly report:', error);
    res.status(500).json({ error: 'Failed to create yearly report' });
  }
});

// Get all yearly reports for the current user
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {
    const reports = await prisma.yearlyReport.findMany({
      where: { userId },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get yearly reports:', error);
    res.status(500).json({ error: 'Failed to get yearly reports' });
  }
});

// Get all yearly reports for a given date range (for admins/managers)
router.get('/all', isAuthenticated, isAdminOrManager, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }

  try {
    const reports = await prisma.yearlyReport.findMany({
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
    console.error('Failed to get yearly reports:', error);
    res.status(500).json({ error: 'Failed to get yearly reports' });
  }
});

// Get a single yearly report by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const report = await prisma.yearlyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Yearly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
        return res.status(403).json({ error: 'You are not authorized to view this report' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Failed to get yearly report:', error);
    res.status(500).json({ error: 'Failed to get yearly report' });
  }
});

// Update a yearly report
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, summary, goals, learnings, challenges, status } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.yearlyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Yearly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to edit this report' });
    }

    const updatedReport = await prisma.yearlyReport.update({
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
    console.error('Failed to update yearly report:', error);
    res.status(500).json({ error: 'Failed to update yearly report' });
  }
});

// Delete a yearly report
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const report = await prisma.yearlyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
        return res.status(404).json({ error: 'Yearly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to delete this report' });
    }

    await prisma.yearlyReport.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete yearly report:', error);
    res.status(500).json({ error: 'Failed to delete yearly report' });
  }
});

module.exports = router;
