import { toDisplayDate } from './dateUtils';
import { downloadReportPdf } from './pdfGenerator';

export function handleReportDownload(report, t) {
  const type = report.type.toLowerCase();
  
  const commonMetadata = [
    { label: t('daily.status'), value: report.status === 'DRAFT' ? 'Draft' : 'Submitted' },
  ];

  switch (type) {
    case 'daily':
      downloadReportPdf({
        title: 'Daily Report',
        fileName: `DailyReport_${report.reportDate}_${report.title}.pdf`,
        metadata: [
          { label: 'Date', value: toDisplayDate(report.reportDate) },
          { label: t('daily.title'), value: report.title },
          { label: t('daily.hours_worked'), value: report.hoursWorked },
          ...commonMetadata,
        ],
        sections: [
          { label: t('daily.activities'), value: report.activities },
          { label: t('daily.learnings'), value: report.learnings },
          { label: t('daily.challenges'), value: report.challenges },
        ],
      });
      break;
    case 'weekly':
      downloadReportPdf({
        title: 'Weekly Report',
        fileName: `WeeklyReport_CW${report.weekNumber}_${report.name}.pdf`,
        metadata: [
          { label: t('weekly.name'), value: report.name },
          { label: t('weekly.calendar_week'), value: report.weekNumber },
          { label: t('weekly.from'), value: toDisplayDate(report.weekStart) },
          { label: t('weekly.to'), value: toDisplayDate(report.weekEnd) },
          { label: t('weekly.year_of_training'), value: report.yearOfTraining },
          { label: t('weekly.department'), value: report.department },
          { label: t('weekly.total_hours'), value: report.totalHours },
          ...commonMetadata,
        ],
        sections: [
          { label: t('weekly.company_activities'), value: report.activities },
          { label: t('weekly.summary_label'), value: report.summary },
          { label: t('weekly.school'), value: report.school },
          { label: t('weekly.comments'), value: report.remarks },
        ],
      });
      break;
    case 'monthly':
      downloadReportPdf({
        title: 'Monthly Report',
        fileName: `MonthlyReport_${report.year}_${report.month}_${report.name}.pdf`,
        metadata: [
          { label: t('monthly.name'), value: report.name },
          { label: 'Month', value: `${report.month}/${report.year}` },
          { label: t('monthly.start'), value: toDisplayDate(report.monthStart) },
          { label: t('monthly.end'), value: toDisplayDate(report.monthEnd) },
          { label: t('weekly.year_of_training'), value: report.yearOfTraining },
          { label: t('weekly.total_hours'), value: report.totalHours },
          ...commonMetadata,
        ],
        sections: [
          { label: t('monthly.summary'), value: report.summary },
          { label: t('monthly.achievements'), value: report.keyAchievements },
          { label: t('monthly.goals'), value: report.goals },
          { label: t('monthly.instructions'), value: report.instructions },
          { label: t('monthly.remarks'), value: report.remarks },
        ],
      });
      break;
    case 'yearly':
      downloadReportPdf({
        title: 'Yearly Report',
        fileName: `YearlyReport_${report.year}.pdf`,
        metadata: [
          { label: t('yearly.year'), value: report.year },
          { label: t('yearly.training_year'), value: report.trainingYear },
          { label: t('yearly.start'), value: toDisplayDate(report.yearStart) },
          { label: t('yearly.end'), value: toDisplayDate(report.yearEnd) },
          { label: t('weekly.total_hours'), value: report.totalHours },
          ...commonMetadata,
        ],
        sections: [
          { label: t('yearly.summary'), value: report.summary },
          { label: t('yearly.achievements'), value: report.achievements },
          { label: t('yearly.skills_improved'), value: report.skillsImproved },
          { label: t('yearly.goals'), value: report.goals },
        ],
      });
      break;
    default:
      console.error('Unknown report type for PDF download');
  }
}
