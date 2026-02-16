import React, { useState } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { yearlyReportApi } from '../services/api';
import { downloadReportPdf } from '../utils/pdfGenerator';

const initialState = {
  year: '',
  trainingYear: '',
  yearStart: '',
  yearEnd: '',
  summary: '',
  achievements: '',
  skillsImproved: '',
  goals: '',
  totalHours: '',
  status: 'DRAFT',
};

const YearlyReportPage = () => {
  const [formData, setFormData] = useState(initialState);
  const { addToast } = useToast();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      year,
      trainingYear,
      yearStart,
      yearEnd,
      summary,
      achievements,
      skillsImproved,
      goals,
      totalHours,
      status,
    } = formData;

    if (
      !year ||
      !trainingYear ||
      !yearStart ||
      !yearEnd ||
      !summary ||
      !achievements ||
      !skillsImproved ||
      !goals ||
      !totalHours
    ) {
      addToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
      return;
    }

    try {
      const report = await yearlyReportApi.create({
        year: parseInt(year, 10),
        trainingYear,
        yearStart,
        yearEnd,
        summary,
        achievements,
        skillsImproved,
        goals,
        totalHours: parseFloat(totalHours),
        status,
      });
      addToast(`Jahresbericht gespeichert (ID: ${report.id})`, 'success');
      setFormData(initialState);
    } catch (error) {
      addToast(`Speichern fehlgeschlagen: ${error.message}`, 'error');
    }
  };

  const handleDownloadPDF = () => {
    downloadReportPdf({
      title: 'Yearly Report',
      fileName: 'yearly-report.pdf',
      metadata: [
        { label: 'Year', value: formData.year },
        { label: 'Training Year', value: formData.trainingYear },
        { label: 'Year Start', value: formData.yearStart },
        { label: 'Year End', value: formData.yearEnd },
        { label: 'Total Hours', value: formData.totalHours },
        { label: 'Status', value: formData.status },
      ],
      sections: [
        { label: 'Summary', value: formData.summary },
        { label: 'Achievements', value: formData.achievements },
        { label: 'Skills Improved', value: formData.skillsImproved },
        { label: 'Goals', value: formData.goals },
      ],
    });
  };

  return (
    <div className="report-form-container">
      <h1>Yearly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Year:</label>
            <input type="number" value={formData.year} onChange={handleChange('year')} required />
          </div>
          <div className="form-group">
            <label>Training Year:</label>
            <input type="text" value={formData.trainingYear} onChange={handleChange('trainingYear')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Year Start:</label>
            <input type="date" value={formData.yearStart} onChange={handleChange('yearStart')} required />
          </div>
          <div className="form-group">
            <label>Year End:</label>
            <input type="date" value={formData.yearEnd} onChange={handleChange('yearEnd')} required />
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
          <label>Achievements:</label>
          <textarea value={formData.achievements} onChange={handleChange('achievements')} required />
        </div>
        <div className="form-group full-width">
          <label>Skills Improved:</label>
          <textarea value={formData.skillsImproved} onChange={handleChange('skillsImproved')} required />
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

export default YearlyReportPage;
