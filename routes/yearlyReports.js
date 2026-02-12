const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new yearly report
router.post('/', isAuthenticated, async (req, res) => {
  const { year, trainingYear, yearStart, yearEnd, summary, achievements, skillsImproved, goals, totalHours, status } = req.body;
  const userId = req.user.id;

  const parsedTotalHours = parseFloat(totalHours);

  try {
    const report = await prisma.yearlyReport.create({
      data: {
        userId,
        year: parseInt(year),
        trainingYear,
        yearStart: new Date(yearStart),
        yearEnd: new Date(yearEnd),
        summary,
        achievements,
        skillsImproved,
        goals,
        totalHours: !isNaN(parsedTotalHours) ? parsedTotalHours : 0,
        status,
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
      orderBy: { year: 'desc' },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get yearly reports:', error);
    res.status(500).json({ error: 'Failed to get yearly reports' });
  }
});

// Get all yearly reports for all users (for admins/managers)
router.get('/all', isAuthenticated, isAdminOrManager, async (req, res) => {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
        where.yearStart = { gte: new Date(startDate) };
        where.yearEnd = { lte: new Date(endDate) };
    }

    try {
        const reports = await prisma.yearlyReport.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { year: 'desc' },
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Failed to get all yearly reports:', error);
        res.status(500).json({ error: 'Failed to get all yearly reports' });
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
  const { summary, achievements, skillsImproved, goals, totalHours, status } = req.body;
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

    const parsedTotalHours = parseFloat(totalHours);

    const dataToUpdate = {
        summary,
        achievements,
        skillsImproved,
        goals,
        status,
    };

    if (totalHours !== undefined) {
        dataToUpdate.totalHours = !isNaN(parsedTotalHours) ? parsedTotalHours : report.totalHours;
    }

    const updatedReport = await prisma.yearlyReport.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Failed to update yearly report:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
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
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete yearly report' });
  }
});

module.exports = router;
