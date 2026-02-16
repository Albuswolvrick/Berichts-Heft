import React, { useState } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { weeklyReportApi } from '../services/api';
import { getWeekRangeFromDate } from '../utils/dateUtils';
import { downloadReportPdf } from '../utils/pdfGenerator';

const initialState = {
  weekStart: '',
  weekEnd: '',
  weekNumber: '',
  summary: '',
  activities: '',
  instructions: '',
  school: '',
  department: '',
  totalHours: '',
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
      weekStart,
      weekEnd,
      weekNumber,
      summary,
      activities,
      instructions,
      school,
      department,
      totalHours,
      status,
    } = formData;

    if (
      !weekStart ||
      !weekEnd ||
      !weekNumber ||
      !summary ||
      !activities ||
      !instructions ||
      !school ||
      !department ||
      !totalHours
    ) {
      addToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
      return;
    }

    try {
      const report = await weeklyReportApi.create({
        weekStart,
        weekEnd,
        weekNumber: parseInt(weekNumber, 10),
        summary,
        activities,
        instructions,
        school,
        department,
        totalHours: parseFloat(totalHours),
        status,
      });

      addToast(`Wochenbericht gespeichert (ID: ${report.id})`, 'success');
      setFormData(initialState);
    } catch (error) {
      addToast(`Speichern fehlgeschlagen: ${error.message}`, 'error');
    }
  };

  const handleDownloadPDF = () => {
    downloadReportPdf({
      title: 'Weekly Report',
      fileName: 'weekly-report.pdf',
      metadata: [
        { label: 'Calendar Week', value: formData.weekNumber },
        { label: 'Week Start', value: formData.weekStart },
        { label: 'Week End', value: formData.weekEnd },
        { label: 'Department', value: formData.department },
        { label: 'School', value: formData.school },
        { label: 'Total Hours', value: formData.totalHours },
        { label: 'Status', value: formData.status },
      ],
      sections: [
        { label: 'Summary', value: formData.summary },
        { label: 'Activities', value: formData.activities },
        { label: 'Instructions', value: formData.instructions },
      ],
    });
  };

  return (
    <div className="report-form-container">
      <h1>Weekly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Week (pick any day):</label>
            <input type="date" value={formData.weekStart} onChange={handleWeekStartChange} required />
          </div>
          <div className="form-group">
            <label>Week End (auto):</label>
            <input type="date" value={formData.weekEnd} readOnly required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Calendar Week (auto):</label>
            <input type="number" value={formData.weekNumber} readOnly required />
          </div>
          <div className="form-group">
            <label>Total Hours:</label>
            <input type="number" value={formData.totalHours} onChange={handleChange('totalHours')} required />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Department:</label>
          <input type="text" value={formData.department} onChange={handleChange('department')} required />
        </div>
        <div className="form-group full-width">
          <label>School:</label>
          <textarea value={formData.school} onChange={handleChange('school')} required />
        </div>
        <div className="form-group full-width">
          <label>Summary:</label>
          <textarea value={formData.summary} onChange={handleChange('summary')} required />
        </div>
        <div className="form-group full-width">
          <label>Activities:</label>
          <textarea value={formData.activities} onChange={handleChange('activities')} required />
        </div>
        <div className="form-group full-width">
          <label>Instructions:</label>
          <textarea value={formData.instructions} onChange={handleChange('instructions')} required />
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
