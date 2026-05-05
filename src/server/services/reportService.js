const { prisma } = require('../config/database');
const { NotFoundError, ForbiddenError, UnauthorizedError } = require('../utils/errors');

/**
 * Checks if a user is authorized to access a report.
 * Report owners can always access their own reports.
 * ADMIN and MANAGER roles can access any report.
 */
function checkReportAuthorization(report, user, action = 'access') {
  if (!user) {
    throw new UnauthorizedError(`You must be logged in to ${action} this report`);
  }
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
 * @param {string[]} [options.searchFields] - Fields to search for in listAll queries
 */
function createReportService(modelName, options) {
  const model = prisma[modelName];
  const { orderByField, parseCreateData, parseUpdateData, dateFilter, searchFields } = options;
  const displayName = modelName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();

  return {
    /**
     * Creates a new report for a user.
     */
    async create(userId, body) {
      const data = parseCreateData(body);
      data.userId = userId;

      // Automatic deletion/prevention if status is REJECTED or DENIED
      if (data.status === 'REJECTED' || data.status === 'DENIED') {
        return { deleted: true, message: 'Report rejected/denied and not saved' };
      }

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
     * Lists all reports (admin/manager), with optional filtering.
     */
    async listAll(query) {
      const where = {};

      if (query.userId) {
        where.userId = parseInt(query.userId, 10);
      }

      if (query.search && searchFields && searchFields.length > 0) {
        where.OR = searchFields.map(field => ({
          [field]: {
            contains: query.search,
            mode: 'insensitive',
          },
        }));
      }

      if (dateFilter && query.startDate && query.endDate) {
        const { startField, endField } = dateFilter;
        if (startField) where[startField] = { gte: new Date(query.startDate) };
        if (endField) where[endField] = { lte: new Date(query.endDate) };
      }

      return model.findMany({
        where,
        include: { user: { select: { name: true, id: true } } },
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

      // Automatic deletion if status is REJECTED or DENIED
      if (data.status === 'REJECTED' || data.status === 'DENIED') {
        const deletedReport = await model.delete({ where: { id: parseInt(id) } });
        return { ...deletedReport, deleted: true };
      }

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
  searchFields: ['title', 'activities', 'learnings', 'challenges'],
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
  searchFields: ['name', 'summary', 'activities', 'remarks'],
  parseCreateData: (body) => ({
    name: body.name,
    weekStart: new Date(body.weekStart),
    weekEnd: new Date(body.weekEnd),
    weekNumber: parseInt(body.weekNumber),
    summary: body.summary,
    activities: body.activities,
    remarks: body.remarks,
    school: body.school,
    department: body.department,
    totalHours: parseFloat(body.totalHours),
    yearOfTraining: parseInt(body.yearOfTraining),
    status: body.status,
  }),
  parseUpdateData: (body) => ({
    name: body.name,
    summary: body.summary,
    activities: body.activities,
    remarks: body.remarks,
    school: body.school,
    department: body.department,
    totalHours: parseFloat(body.totalHours),
    yearOfTraining: parseInt(body.yearOfTraining),
    status: body.status,
    weekStart: body.weekStart ? new Date(body.weekStart) : undefined,
    weekEnd: body.weekEnd ? new Date(body.weekEnd) : undefined,
    weekNumber: body.weekNumber ? parseInt(body.weekNumber) : undefined,
  }),
});

// --- Monthly Report Service ---
const monthlyReportService = createReportService('monthlyReport', {
  orderByField: 'monthStart',
  dateFilter: { startField: 'monthStart', endField: 'monthEnd' },
  searchFields: ['name', 'summary', 'keyAchievements', 'goals'],
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
      name: body.name,
      instructions: body.instructions,
      remarks: body.remarks,
      yearOfTraining: parseInt(body.yearOfTraining),
    };
  },
  parseUpdateData: (body, existing) => {
    const parsedHours = parseFloat(body.totalHours);
    const data = {
      summary: body.summary,
      keyAchievements: body.keyAchievements,
      goals: body.goals,
      status: body.status,
      name: body.name,
      instructions: body.instructions,
      remarks: body.remarks,
      yearOfTraining: body.yearOfTraining ? parseInt(body.yearOfTraining) : existing.yearOfTraining,
      month: body.month ? parseInt(body.month) : existing.month,
      year: body.year ? parseInt(body.year) : existing.year,
      monthStart: body.monthStart ? new Date(body.monthStart) : existing.monthStart,
      monthEnd: body.monthEnd ? new Date(body.monthEnd) : existing.monthEnd,
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
  searchFields: ['trainingYear', 'summary', 'achievements', 'skillsImproved', 'goals'],
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
      year: body.year ? parseInt(body.year) : existing.year,
      trainingYear: body.trainingYear,
      yearStart: body.yearStart ? new Date(body.yearStart) : existing.yearStart,
      yearEnd: body.yearEnd ? new Date(body.yearEnd) : existing.yearEnd,
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
