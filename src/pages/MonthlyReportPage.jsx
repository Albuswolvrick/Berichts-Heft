
import React, { useState } from 'react';
import jsPDF from 'jspdf';

const MonthlyReportPage = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [monthStart, setMonthStart] = useState('');
  const [monthEnd, setMonthEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [keyAchievements, setKeyAchievements] = useState('');
  const [goals, setGoals] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !year || !monthStart || !monthEnd || !summary || !keyAchievements || !goals || !totalHours) {
        alert('Please fill out all fields.');
        return;
    }

    try {
      const response = await fetch('/api/monthly-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: parseInt(month),
          year: parseInt(year),
          monthStart,
          monthEnd,
          summary,
          keyAchievements,
          goals,
          totalHours: parseFloat(totalHours),
          status,
        }),
      });

      if (response.ok) {
        alert('Monthly report saved successfully!');
        // Optionally, clear the form
        setMonth('');
        setYear('');
        setMonthStart('');
        setMonthEnd('');
        setSummary('');
        setKeyAchievements('');
        setGoals('');
        setTotalHours('');
        setStatus('DRAFT');
      } else {
        const errorData = await response.json();
        alert(`Failed to save monthly report: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save monthly report:', error);
      alert('Failed to save monthly report. Please try again later.');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Monthly Report', 10, 10);
    doc.text(`Month: ${month}`, 10, 20);
    doc.text(`Year: ${year}`, 10, 30);
    doc.text(`Month Start: ${monthStart}`, 10, 40);
    doc.text(`Month End: ${monthEnd}`, 10, 50);
    doc.text(`Total Hours: ${totalHours}`, 10, 60);
    doc.text(`Summary: ${summary}`, 10, 70);
    doc.text(`Key Achievements: ${keyAchievements}`, 10, 80);
    doc.text(`Goals: ${goals}`, 10, 90);

    doc.save('monthly-report.pdf');
  };

  return (
    <div className="report-form-container">
      <h1>Monthly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-group">
                <label>Month:</label>
                <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Year:</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label>Month Start:</label>
                <input type="date" value={monthStart} onChange={(e) => setMonthStart(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Month End:</label>
                <input type="date" value={monthEnd} onChange={(e) => setMonthEnd(e.target.value)} required />
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
            <label>Key Achievements:</label>
            <textarea value={keyAchievements} onChange={(e) => setKeyAchievements(e.target.value)} required />
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

export default MonthlyReportPage;
