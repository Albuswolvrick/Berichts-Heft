
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { toInputDate, toDisplayDate } from '../utils/dateUtils';

const YearlyReportPage = () => {
  const [year, setYear] = useState('');
  const [trainingYear, setTrainingYear] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [achievements, setAchievements] = useState('');
  const [skillsImproved, setSkillsImproved] = useState('');
  const [goals, setGoals] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [status, setStatus] = useState('DRAFT');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const firstDay = new Date(currentYear, 0, 1);
    const lastDay = new Date(currentYear, 11, 31);

    setYear(String(currentYear));
    setYearStart(toInputDate(firstDay));
    setYearEnd(toInputDate(lastDay));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !trainingYear || !yearStart || !yearEnd || !summary || !achievements || !skillsImproved || !goals || !totalHours) {
        alert('Please fill out all fields.');
        return;
    }

    try {
      const response = await fetch('/api/yearly-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: parseInt(year),
          trainingYear,
          yearStart,
          yearEnd,
          summary,
          achievements,
          skillsImproved,
          goals,
          totalHours: parseFloat(totalHours),
          status,
        }),
      });

      if (response.ok) {
        alert('Yearly report saved successfully!');
        // Optionally, clear the form
        setYear('');
        setTrainingYear('');
        setYearStart('');
        setYearEnd('');
        setSummary('');
        setAchievements('');
        setSkillsImproved('');
        setGoals('');
        setTotalHours('');
        setStatus('DRAFT');
      } else {
        const errorData = await response.json();
        alert(`Failed to save yearly report: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save yearly report:', error);
      alert('Failed to save yearly report. Please try again later.');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Yearly Report', 10, 10);
    doc.text(`Year: ${year}`, 10, 20);
    doc.text(`Training Year: ${trainingYear}`, 10, 30);
    doc.text(`Year Start: ${toDisplayDate(yearStart)}`, 10, 40);
    doc.text(`Year End: ${toDisplayDate(yearEnd)}`, 10, 50);
    doc.text(`Total Hours: ${totalHours}`, 10, 60);
    doc.text(`Summary: ${summary}`, 10, 70);
    doc.text(`Achievements: ${achievements}`, 10, 80);
    doc.text(`Skills Improved: ${skillsImproved}`, 10, 90);
    doc.text(`Goals: ${goals}`, 10, 100);

    doc.save('yearly-report.pdf');
  };

  return (
    <div className="report-form-container">
      <h1>Yearly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-group">
                <label>Year:</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Training Year:</label>
                <input type="text" value={trainingYear} onChange={(e) => setTrainingYear(e.target.value)} required />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label>Year Start:</label>
                <input type="date" value={yearStart} onChange={(e) => setYearStart(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Year End:</label>
                <input type="date" value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} required />
            </div>
        </div>
        <div className="form-group full-width">
            <label>Total Hours:</label>
            <input type="number" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Summary:</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Achievements:</label>
            <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Skills Improved:</label>
            <textarea value={skillsImproved} onChange={(e) => setSkillsImproved(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Goals:</label>
            <textarea value={goals} onChange={(e) => setGoals(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
            </select>
        </div>
        <div className="button-group">
            <button type="submit">Save Report</button>
            <button type="button" className="download-btn" onClick={handleDownloadPDF}>Download as PDF</button>
        </div>
      </form>
    </div>
  );
};

export default YearlyReportPage;
