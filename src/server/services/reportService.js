const { prisma } = require('../config/database');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

/**
 * Checks if a user is authorized to access a report.
 * Report owners can always access their own reports.
 * ADMIN and MANAGER roles can access any report.
 */
function checkReportAuthorization(report, user, action = 'access') {
  if (report.userId !== user.id && !['ADMIN', 'MANAGER'].includes(user.role)) {
    throw new ForbiddenError(`You are not authorized to ${action} this report`);
  }
}

/**
 * Creates a generic report service for a given Prisma model.
 * Reduces duplication across daily/weekly/monthly/yearly report routes.
 *
 * @param {string} modelName - Prisma model name (e.g., 'dailyReport')
 * @param {object} options
 * @param {string} options.orderByField - Field to order by in list queries
 * @param {Function} options.parseCreateData - Transforms request body into Prisma create data
 * @param {Function} options.parseUpdateData - Transforms request body into Prisma update data
 * @param {object} [options.dateFilter] - Date filter configuration for admin queries
 */
function createReportService(modelName, options) {
  const model = prisma[modelName];
  const { orderByField, parseCreateData, parseUpdateData, dateFilter } = options;
  const displayName = modelName.replace(/([A-Z])/g, ' $1').trim().toLowerCase();

  return {
    /**
     * Creates a new report for a user.
     */
    async create(userId, body) {
      const data = parseCreateData(body);
      data.userId = userId;
      return model.create({ data });
    },

    /**
     * Lists all reports for the authenticated user.
     */
    async listByUser(userId) {
      return model.findMany({
        where: { userId },
        orderBy: { [orderByField]: 'desc' },
      });
    },

    /**
     * Lists all reports (admin/manager), with optional date filtering.
     */
    async listAll(query) {
      const where = {};

      if (dateFilter && query.startDate && query.endDate) {
        const { startField, endField } = dateFilter;
        if (startField) where[startField] = { gte: new Date(query.startDate) };
        if (endField) where[endField] = { lte: new Date(query.endDate) };
      }

      return model.findMany({
        where,
        include: { user: { select: { name: true } } },
        orderBy: { [orderByField]: 'desc' },
      });
    },

    /**
     * Gets a single report by ID with authorization check.
     */
    async getById(id, user) {
      const report = await model.findUnique({ where: { id: parseInt(id) } });

      if (!report) {
        throw new NotFoundError(`${displayName} not found`);
      }

      checkReportAuthorization(report, user, 'view');
      return report;
    },

    /**
     * Updates a report with authorization check.
     */
    async update(id, user, body) {
      const report = await model.findUnique({ where: { id: parseInt(id) } });

      if (!report) {
        throw new NotFoundError(`${displayName} not found`);
      }

      checkReportAuthorization(report, user, 'edit');

      const data = parseUpdateData(body, report);
      return model.update({
        where: { id: parseInt(id) },
        data,
      });
    },

    /**
     * Deletes a report with authorization check.
     */
    async remove(id, user) {
      const report = await model.findUnique({ where: { id: parseInt(id) } });

      if (!report) {
        throw new NotFoundError(`${displayName} not found`);
      }

      checkReportAuthorization(report, user, 'delete');
      await model.delete({ where: { id: parseInt(id) } });
    },
  };
}

// --- Daily Report Service ---
const dailyReportService = createReportService('dailyReport', {
  orderByField: 'reportDate',
  dateFilter: { startField: 'reportDate', endField: 'reportDate' },
  parseCreateData: (body) => {
    const parsedHours = parseFloat(body.hoursWorked);
    return {
      reportDate: new Date(body.reportDate),
      title: body.title,
      activities: body.activities,
      learnings: body.learnings,
      challenges: body.challenges,
      hoursWorked: !isNaN(parsedHours) ? parsedHours : 0,
      status: body.status,
    };
  },
  parseUpdateData: (body, existing) => {
    const parsedHours = parseFloat(body.hoursWorked);
    const data = {
      title: body.title,
      activities: body.activities,
      learnings: body.learnings,
      challenges: body.challenges,
      status: body.status,
    };
    if (body.hoursWorked !== undefined) {
      data.hoursWorked = !isNaN(parsedHours) ? parsedHours : existing.hoursWorked;
    }
    return data;
  },
});

// --- Weekly Report Service ---
const weeklyReportService = createReportService('weeklyReport', {
  orderByField: 'weekStart',
  dateFilter: { startField: 'weekStart', endField: 'weekEnd' },
  parseCreateData: (body) => ({
    weekStart: new Date(body.weekStart),
    weekEnd: new Date(body.weekEnd),
    weekNumber: body.weekNumber,
    summary: body.summary,
    activities: body.activities,
    instructions: body.instructions,
    school: body.school,
    department: body.department,
    totalHours: body.totalHours,
    status: body.status,
  }),
  parseUpdateData: (body) => ({
    summary: body.summary,
    activities: body.activities,
    instructions: body.instructions,
    school: body.school,
    department: body.department,
    totalHours: body.totalHours,
    status: body.status,
  }),
});

// --- Monthly Report Service ---
const monthlyReportService = createReportService('monthlyReport', {
  orderByField: 'monthStart',
  dateFilter: { startField: 'monthStart', endField: 'monthEnd' },
  parseCreateData: (body) => {
    const parsedHours = parseFloat(body.totalHours);
    return {
      month: parseInt(body.month),
      year: parseInt(body.year),
      monthStart: new Date(body.monthStart),
      monthEnd: new Date(body.monthEnd),
      summary: body.summary,
      keyAchievements: body.keyAchievements,
      goals: body.goals,
      totalHours: !isNaN(parsedHours) ? parsedHours : 0,
      status: body.status,
    };
  },
  parseUpdateData: (body, existing) => {
    const parsedHours = parseFloat(body.totalHours);
    const data = {
      summary: body.summary,
      keyAchievements: body.keyAchievements,
      goals: body.goals,
      status: body.status,
    };
    if (body.totalHours !== undefined) {
      data.totalHours = !isNaN(parsedHours) ? parsedHours : existing.totalHours;
    }
    return data;
  },
});

// --- Yearly Report Service ---
const yearlyReportService = createReportService('yearlyReport', {
  orderByField: 'year',
  dateFilter: { startField: 'yearStart', endField: 'yearEnd' },
  parseCreateData: (body) => {
    const parsedHours = parseFloat(body.totalHours);
    return {
      year: parseInt(body.year),
      trainingYear: body.trainingYear,
      yearStart: new Date(body.yearStart),
      yearEnd: new Date(body.yearEnd),
      summary: body.summary,
      achievements: body.achievements,
      skillsImproved: body.skillsImproved,
      goals: body.goals,
      totalHours: !isNaN(parsedHours) ? parsedHours : 0,
      status: body.status,
    };
  },
  parseUpdateData: (body, existing) => {
    const parsedHours = parseFloat(body.totalHours);
    const data = {
      summary: body.summary,
      achievements: body.achievements,
      skillsImproved: body.skillsImproved,
      goals: body.goals,
      status: body.status,
    };
    if (body.totalHours !== undefined) {
      data.totalHours = !isNaN(parsedHours) ? parsedHours : existing.totalHours;
    }
    return data;
  },
});

module.exports = {
  dailyReportService,
  weeklyReportService,
  monthlyReportService,
  yearlyReportService,
};
