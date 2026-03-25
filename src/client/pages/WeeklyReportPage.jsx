import { useState, useEffect } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { weeklyReportApi } from '../services/api';
import { getWeekRangeFromDate, toInputDate, toDisplayDate } from '../utils/dateUtils';
import { downloadReportPdf } from '../utils/pdfGenerator';
import { useLanguage } from '../hooks/useLanguage';

const initialState = {
  name: '',
  weekStart: '',
  weekEnd: '',
  weekNumber: '',
  summary: '',
  activities: '',
  school: '',
  department: '',
  totalHours: '',
  yearOfTraining: '',
  remarks: '',
  status: 'DRAFT',
};

const WeeklyReportPage = () => {
  const [formData, setFormData] = useState(initialState);
  const { addToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const today = toInputDate(new Date());
    const week = getWeekRangeFromDate(today);
    if (week) {
      setFormData(prev => ({
        ...prev,
        weekStart: week.weekStart,
        weekEnd: week.weekEnd,
        weekNumber: String(week.weekNumber),
      }));
    }
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleWeekStartChange = (e) => {
    const selectedDate = e.target.value;
    const week = getWeekRangeFromDate(selectedDate);

    if (!week) {
      setFormData((prev) => ({ ...prev, weekStart: selectedDate, weekEnd: '', weekNumber: '' }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weekNumber: String(week.weekNumber),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      weekStart,
      weekEnd,
      weekNumber,
      summary,
      activities,
      remarks,
      school,
      department,
      totalHours,
      yearOfTraining,
      status,
    } = formData;

    if (
      !name ||
      !weekStart ||
      !weekEnd ||
      !weekNumber ||
      !summary ||
      !activities ||
      !school ||
      !department ||
      !totalHours ||
      !yearOfTraining ||
      !remarks
    ) {
      addToast(t('report.fill_all'), 'error');
      return;
    }

    try {
      const report = await weeklyReportApi.create({
        name,
        weekStart,
        weekEnd,
        weekNumber: parseInt(weekNumber, 10),
        department,
        summary,
        activities,
        school,
        remarks,
        totalHours: parseFloat(totalHours),
        yearOfTraining: parseInt(yearOfTraining, 10),
        status,
      });

      addToast(`Weekly report saved (ID: ${report.id})`, 'success');
      setFormData(initialState);
    } catch (error) {
      addToast(`Save failed: ${error.message}`, 'error');
    }
  };

  const handleDownloadPDF = () => {
    downloadReportPdf({
      title: 'Weekly Report',
      fileName: `WeeklyReport_CW${formData.weekNumber}_${formData.name}.pdf`,
      metadata: [
        { label: 'TEST Name', value: formData.name },
        { label: 'Calendar Week', value: formData.weekNumber },
        { label: 'Period from', value: toDisplayDate(formData.weekStart) },
        { label: 'Period to', value: toDisplayDate(formData.weekEnd) },
        { label: 'Training Year', value: formData.yearOfTraining },
        { label: 'Training Department', value: formData.department },
        { label: 'Total Hours', value: formData.totalHours },
        { label: 'Status', value: formData.status === 'DRAFT' ? 'Draft' : 'Submitted' },
      ],
      sections: [
        { label: 'Company Activities', value: formData.activities },
        {
          label:
            'Instructions, training discussions, in-house training, external training events, intermediate examination',
          value: formData.summary,
        },
        { label: 'Vocational school (topics)', value: formData.school },
        { label: 'Comments', value: formData.remarks },
      ],
    });
  };

  return (
    <div className="report-form-container">
      <h1>{t('report.weekly')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label>{t('weekly.name')}</label>
            <input type="text" value={formData.name} onChange={handleChange('name')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('weekly.from')}</label>
            <input
              type="date"
              value={formData.weekStart}
              onChange={handleWeekStartChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('weekly.to')}</label>
            <input type="date" value={formData.weekEnd} readOnly required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('weekly.calendar_week')}</label>
            <input type="number" value={formData.weekNumber} readOnly required />
          </div>
          <div className="form-group">
            <label>{t('weekly.total_hours')}</label>
            <input
              type="number"
              value={formData.totalHours}
              onChange={handleChange('totalHours')}
              required
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label>{t('weekly.department')}</label>
          <input
            type="text"
            value={formData.department}
            onChange={handleChange('department')}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>{t('weekly.year_of_training')}</label>
          <input
            type="number"
            value={formData.yearOfTraining}
            onChange={handleChange('yearOfTraining')}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>{t('weekly.company_activities')}</label>
          <textarea value={formData.activities} onChange={handleChange('activities')} required />
        </div>
        <div className="form-group full-width">
          <label>
            {t('weekly.summary_label')}
          </label>
          <textarea value={formData.summary} onChange={handleChange('summary')} required />
        </div>
        <div className="form-group full-width">
          <label>{t('weekly.school')}</label>
          <textarea value={formData.school} onChange={handleChange('school')} required />
        </div>
        <div className="form-group full-width">
          <label>{t('weekly.comments')}</label>
          <textarea value={formData.remarks} onChange={handleChange('remarks')} required />
        </div>
        <div className="form-group full-width">
          <label>{t('daily.status')}</label>
          <select value={formData.status} onChange={handleChange('status')}>
            <option value="DRAFT">{t('report.draft')}</option>
            <option value="SUBMITTED">{t('report.submitted')}</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit">{t('report.save_button')}</button>
          <button type="button" className="download-btn" onClick={handleDownloadPDF}>
            {t('report.download_pdf')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyReportPage;
