const express = require('express');
const { asyncHandler } = require('../utils');
const { dailyReportService, weeklyReportService, monthlyReportService, yearlyReportService } = require('../services/reportService');

const router = express.Router();

const services = {
    daily: dailyReportService,
    weekly: weeklyReportService,
    monthly: monthlyReportService,
    yearly: yearlyReportService,
};

const getReportService = (req, res, next) => {
    const { reportType } = req.params;
    const service = services[reportType.toLowerCase()];
    if (!service) {
        return res.status(404).json({ message: 'Report type not found' });
    }
    req.service = service;
    next();
};

const getAllReports = async (req, res) => {
    const { user } = req.session;
    if (!user) {
        return res.status(401).json({ message: 'You must be logged in to view reports.' });
    }

    const isAdmin = user.role === 'ADMIN' || user.role === 'MANAGER';

    if (isAdmin) {
        const { search, userId } = req.query;
        const query = { search, userId };

        const [daily, weekly, monthly, yearly] = await Promise.all([
            services.daily.listAll(query),
            services.weekly.listAll(query),
            services.monthly.listAll(query),
            services.yearly.listAll(query),
        ]);

        const allReports = [
            ...daily.map(r => ({ ...r, type: 'Daily' })),
            ...weekly.map(r => ({ ...r, type: 'Weekly' })),
            ...monthly.map(r => ({ ...r, type: 'Monthly' })),
            ...yearly.map(r => ({ ...r, type: 'Yearly' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json(allReports);
    }

    const userId = user.id;
    const [daily, weekly, monthly, yearly] = await Promise.all([
        services.daily.listByUser(userId),
        services.weekly.listByUser(userId),
        services.monthly.listByUser(userId),
        services.yearly.listByUser(userId),
    ]);

    const allReports = [
        ...daily.map(r => ({ ...r, type: 'Daily' })),
        ...weekly.map(r => ({ ...r, type: 'Weekly' })),
        ...monthly.map(r => ({ ...r, type: 'Monthly' })),
        ...yearly.map(r => ({ ...r, type: 'Yearly' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allReports);
};

const getReportById = async (req, res) => {
    const { id } = req.params;
    const report = await req.service.getById(parseInt(id, 10), req.session.user);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
};

const updateReportById = async (req, res) => {
    const { id } = req.params;
    const report = await req.service.update(parseInt(id, 10), req.session.user, req.body);
    res.status(200).json(report);
};

const deleteReportById = async (req, res) => {
    const { id } = req.params;
    await req.service.remove(parseInt(id, 10), req.session.user);
    res.status(204).send();
};

router.get('/all-types', asyncHandler(getAllReports));
router.get('/:reportType/:id', [getReportService, asyncHandler(getReportById)]);
router.put('/:reportType/:id', [getReportService, asyncHandler(updateReportById)]);
router.delete('/:reportType/:id', [getReportService, asyncHandler(deleteReportById)]);

module.exports = router;
