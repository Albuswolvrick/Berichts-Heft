const authService = require('./authService');
const {
  dailyReportService,
  weeklyReportService,
  monthlyReportService,
  yearlyReportService,
} = require('./reportService');

module.exports = {
  authService,
  dailyReportService,
  weeklyReportService,
  monthlyReportService,
  yearlyReportService,
};
