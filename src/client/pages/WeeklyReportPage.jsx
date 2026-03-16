import { useState } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { weeklyReportApi } from '../services/api';
import { getWeekRangeFromDate } from '../utils/dateUtils';
import { downloadReportPdf } from '../utils/pdfGenerator';

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
      addToast('Please fill in all required fields.', 'error');
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
        { label: 'Trainee Name', value: formData.name },
        { label: 'Calendar Week', value: formData.weekNumber },
        { label: 'Period from', value: formData.weekStart },
        { label: 'Period to', value: formData.weekEnd },
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
      <h1>Weekly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Name:</label>
            <input type="text" value={formData.name} onChange={handleChange('name')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Training week from:</label>
            <input
              type="date"
              value={formData.weekStart}
              onChange={handleWeekStartChange}
              required
            />
          </div>
          <div className="form-group">
            <label>To:</label>
            <input type="date" value={formData.weekEnd} readOnly required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Calendar week (automatic):</label>
            <input type="number" value={formData.weekNumber} readOnly required />
          </div>
          <div className="form-group">
            <label>Total Hours:</label>
            <input
              type="number"
              value={formData.totalHours}
              onChange={handleChange('totalHours')}
              required
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Training Department:</label>
          <input
            type="text"
            value={formData.department}
            onChange={handleChange('department')}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Training Year</label>
          <input
            type="number"
            value={formData.yearOfTraining}
            onChange={handleChange('yearOfTraining')}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Company Activities:</label>
          <textarea value={formData.activities} onChange={handleChange('activities')} required />
        </div>
        <div className="form-group full-width">
          <label>
            Instructions, training discussions, in-house training, external training events, intermediate examination:
          </label>
          <textarea value={formData.summary} onChange={handleChange('summary')} required />
        </div>
        <div className="form-group full-width">
          <label>Vocational school (topics):</label>
          <textarea value={formData.school} onChange={handleChange('school')} required />
        </div>
        <div className="form-group full-width">
          <label>Comments:</label>
          <textarea value={formData.remarks} onChange={handleChange('remarks')} required />
        </div>
        <div className="form-group full-width">
          <label>Status:</label>
          <select value={formData.status} onChange={handleChange('status')}>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit">Save Report</button>
          <button type="button" className="download-btn" onClick={handleDownloadPDF}>
            Download as PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyReportPage;
