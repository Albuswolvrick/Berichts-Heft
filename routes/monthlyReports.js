const express = require('express');
const router = express.Router();
const { prisma } = require('../db.js');
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

// Create a new monthly report
router.post('/', isAuthenticated, async (req, res) => {
  const { month, year, monthStart, monthEnd, summary, keyAchievements, goals, totalHours, status } = req.body;
  const userId = req.user.id;

  const parsedTotalHours = parseFloat(totalHours);

  try {
    const report = await prisma.monthlyReport.create({
      data: {
        userId,
        month: parseInt(month),
        year: parseInt(year),
        monthStart: new Date(monthStart),
        monthEnd: new Date(monthEnd),
        summary,
        keyAchievements,
        goals,
        totalHours: !isNaN(parsedTotalHours) ? parsedTotalHours : 0,
        status,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create monthly report:', error);
    res.status(500).json({ error: 'Failed to create monthly report' });
  }
});

// Get all monthly reports for the current user
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {
    const reports = await prisma.monthlyReport.findMany({
      where: { userId },
      orderBy: { monthStart: 'desc' },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to get monthly reports:', error);
    res.status(500).json({ error: 'Failed to get monthly reports' });
  }
});

// Get all monthly reports for a given date range (for admins/managers)
router.get('/all', isAuthenticated, isAdminOrManager, async (req, res) => {
  const { startDate, endDate } = req.query;
  const where = {};

  if (startDate && endDate) {
      where.monthStart = { gte: new Date(startDate) };
      where.monthEnd = { lte: new Date(endDate) };
  }

  try {
      const reports = await prisma.monthlyReport.findMany({
          where,
          include: {
              user: {
                  select: {
                      name: true,
                  },
              },
          },
          orderBy: { monthStart: 'desc' },
      });
      res.status(200).json(reports);
  } catch (error) {
      console.error('Failed to get all monthly reports:', error);
      res.status(500).json({ error: 'Failed to get all monthly reports' });
  }
});


// Get a single monthly report by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const report = await prisma.monthlyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Monthly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
        return res.status(403).json({ error: 'You are not authorized to view this report' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Failed to get monthly report:', error);
    res.status(500).json({ error: 'Failed to get monthly report' });
  }
});

// Update a monthly report
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { summary, keyAchievements, goals, totalHours, status } = req.body;
  const userId = req.user.id;

  try {
    const report = await prisma.monthlyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Monthly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to edit this report' });
    }
    
    const parsedTotalHours = parseFloat(totalHours);

    const dataToUpdate = {
        summary,
        keyAchievements,
        goals,
        status,
    };

    if (totalHours !== undefined) {
        dataToUpdate.totalHours = !isNaN(parsedTotalHours) ? parsedTotalHours : report.totalHours;
    }


    const updatedReport = await prisma.monthlyReport.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Failed to update monthly report:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to update monthly report' });
  }
});

// Delete a monthly report
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const report = await prisma.monthlyReport.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) {
        return res.status(404).json({ error: 'Monthly report not found' });
    }

    if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to delete this report' });
    }

    await prisma.monthlyReport.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete monthly report:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete monthly report' });
  }
});

module.exports = router;
