const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new daily report
router.post('/', isAuthenticated, async (req, res) => {
  const { reportDate, title, activities, learnings, challenges, hoursWorked, status } = req.body;
  const userId = req.user.id;

  const parsedHoursWorked = parseFloat(hoursWorked);

  try {
    const report = await prisma.dailyReport.create({
      data: {
        userId,
        reportDate: new Date(reportDate),
        title,
        activities,
        learnings,
        challenges,
        hoursWorked: !isNaN(parsedHoursWorked) ? parsedHoursWorked : 0,
        status,
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
      orderBy: { reportDate: 'desc' },
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
  const where = {};

  if (startDate && endDate) {
    where.reportDate = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  try {
    const reports = await prisma.dailyReport.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { reportDate: 'desc' },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get all daily reports:', error);
    res.status(500).json({ error: 'Failed to get all daily reports' });
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

    const parsedHoursWorked = parseFloat(hoursWorked);

    const dataToUpdate = {
        title,
        activities,
        learnings,
        challenges,
        status,
    };

    if (hoursWorked !== undefined) {
        dataToUpdate.hoursWorked = !isNaN(parsedHoursWorked) ? parsedHoursWorked : report.hoursWorked;
    }


    const updatedReport = await prisma.dailyReport.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Failed to update daily report:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
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
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete daily report' });
  }
});

module.exports = router;
