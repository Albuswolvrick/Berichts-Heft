const { prisma } = require('../config/database');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Creates a new comment for a report.
 */
async function createComment(userId, { reportType, reportId, content }) {
  if (!content) {
    throw new BadRequestError('Comment content is required');
  }

  const data = {
    content,
    userId,
  };

  // Dynamically set the correct report ID field based on type
  switch (reportType.toLowerCase()) {
    case 'daily':
      data.dailyReportId = parseInt(reportId, 10);
      break;
    case 'weekly':
      data.weeklyReportId = parseInt(reportId, 10);
      break;
    case 'monthly':
      data.monthlyReportId = parseInt(reportId, 10);
      break;
    case 'yearly':
      data.yearlyReportId = parseInt(reportId, 10);
      break;
    default:
      throw new BadRequestError('Invalid report type');
  }

  return prisma.comment.create({
    data,
    include: {
        user: {
            select: { name: true, role: true }
        }
    }
  });
}

/**
 * Retrieves all comments for a specific report.
 */
async function getCommentsForReport(reportType, reportId) {
  const where = {};
  switch (reportType.toLowerCase()) {
    case 'daily': where.dailyReportId = parseInt(reportId, 10); break;
    case 'weekly': where.weeklyReportId = parseInt(reportId, 10); break;
    case 'monthly': where.monthlyReportId = parseInt(reportId, 10); break;
    case 'yearly': where.yearlyReportId = parseInt(reportId, 10); break;
    default: throw new BadRequestError('Invalid report type');
  }

  return prisma.comment.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}

module.exports = {
  createComment,
  getCommentsForReport,
};
