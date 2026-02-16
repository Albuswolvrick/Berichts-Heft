import React, { useState } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { dailyReportApi } from '../services/api';
import { downloadReportPdf } from '../utils/pdfGenerator';

const initialState = {
  reportDate: '',
  title: '',
  activities: '',
  learnings: '',
  challenges: '',
  hoursWorked: '',
  status: 'DRAFT',
};

const DailyReportPage = () => {
  const [formData, setFormData] = useState(initialState);
  const { addToast } = useToast();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { reportDate, title, activities, learnings, challenges, hoursWorked, status } = formData;

    if (!reportDate || !title || !activities || !learnings || !challenges || !hoursWorked) {
      addToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
      return;
    }

    try {
      const report = await dailyReportApi.create({
        reportDate,
        title,
        activities,
        learnings,
        challenges,
        hoursWorked: parseFloat(hoursWorked),
        status,
      });
      addToast(`Tagesbericht gespeichert (ID: ${report.id})`, 'success');
      setFormData(initialState);
    } catch (error) {
      addToast(`Speichern fehlgeschlagen: ${error.message}`, 'error');
    }
  };

  const handleDownloadPDF = () => {
    downloadReportPdf({
      title: 'Daily Report',
      fileName: 'daily-report.pdf',
      metadata: [
        { label: 'Report Date', value: formData.reportDate },
        { label: 'Title', value: formData.title },
        { label: 'Hours Worked', value: formData.hoursWorked },
        { label: 'Status', value: formData.status },
      ],
      sections: [
        { label: 'Activities', value: formData.activities },
        { label: 'Learnings', value: formData.learnings },
        { label: 'Challenges', value: formData.challenges },
      ],
    });
  };

  return (
    <div className="report-form-container">
      <h1>Daily Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Report Date:</label>
            <input type="date" value={formData.reportDate} onChange={handleChange('reportDate')} required />
          </div>
          <div className="form-group">
            <label>Hours Worked:</label>
            <input type="number" value={formData.hoursWorked} onChange={handleChange('hoursWorked')} required />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Title:</label>
          <input type="text" value={formData.title} onChange={handleChange('title')} required />
        </div>
        <div className="form-group full-width">
          <label>Activities:</label>
          <textarea value={formData.activities} onChange={handleChange('activities')} required />
        </div>
        <div className="form-group full-width">
          <label>Learnings:</label>
          <textarea value={formData.learnings} onChange={handleChange('learnings')} required />
        </div>
        <div className="form-group full-width">
          <label>Challenges:</label>
          <textarea value={formData.challenges} onChange={handleChange('challenges')} required />
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

export default DailyReportPage;
