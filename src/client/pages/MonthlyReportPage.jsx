import React, { useState } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { monthlyReportApi } from '../services/api';
import { downloadReportPdf } from '../utils/pdfGenerator';

const initialState = {
  month: '',
  year: '',
  monthStart: '',
  monthEnd: '',
  summary: '',
  keyAchievements: '',
  goals: '',
  totalHours: '',
  status: 'DRAFT',
};

const MonthlyReportPage = () => {
  const [formData, setFormData] = useState(initialState);
  const { addToast } = useToast();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { month, year, monthStart, monthEnd, summary, keyAchievements, goals, totalHours, status } = formData;

    if (!month || !year || !monthStart || !monthEnd || !summary || !keyAchievements || !goals || !totalHours) {
      addToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
      return;
    }

    try {
      const report = await monthlyReportApi.create({
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        monthStart,
        monthEnd,
        summary,
        keyAchievements,
        goals,
        totalHours: parseFloat(totalHours),
        status,
      });
      addToast(`Monatsbericht gespeichert (ID: ${report.id})`, 'success');
      setFormData(initialState);
    } catch (error) {
      addToast(`Speichern fehlgeschlagen: ${error.message}`, 'error');
    }
  };

  const handleDownloadPDF = () => {
    downloadReportPdf({
      title: 'Monthly Report',
      fileName: 'monthly-report.pdf',
      metadata: [
        { label: 'Month', value: formData.month },
        { label: 'Year', value: formData.year },
        { label: 'Month Start', value: formData.monthStart },
        { label: 'Month End', value: formData.monthEnd },
        { label: 'Total Hours', value: formData.totalHours },
        { label: 'Status', value: formData.status },
      ],
      sections: [
        { label: 'Summary', value: formData.summary },
        { label: 'Key Achievements', value: formData.keyAchievements },
        { label: 'Goals', value: formData.goals },
      ],
    });
  };

  return (
    <div className="report-form-container">
      <h1>Monthly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Month:</label>
            <input type="number" value={formData.month} onChange={handleChange('month')} required />
          </div>
          <div className="form-group">
            <label>Year:</label>
            <input type="number" value={formData.year} onChange={handleChange('year')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Month Start:</label>
            <input type="date" value={formData.monthStart} onChange={handleChange('monthStart')} required />
          </div>
          <div className="form-group">
            <label>Month End:</label>
            <input type="date" value={formData.monthEnd} onChange={handleChange('monthEnd')} required />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Total Hours:</label>
          <input type="number" value={formData.totalHours} onChange={handleChange('totalHours')} required />
        </div>
        <div className="form-group full-width">
          <label>Summary:</label>
          <textarea value={formData.summary} onChange={handleChange('summary')} required />
        </div>
        <div className="form-group full-width">
          <label>Key Achievements:</label>
          <textarea value={formData.keyAchievements} onChange={handleChange('keyAchievements')} required />
        </div>
        <div className="form-group full-width">
          <label>Goals:</label>
          <textarea value={formData.goals} onChange={handleChange('goals')} required />
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

export default MonthlyReportPage;
