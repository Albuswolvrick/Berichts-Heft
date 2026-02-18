
import React, { useState } from 'react';
import jsPDF from 'jspdf';

const WeeklyReportPage = () => {
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [summary, setSummary] = useState('');
  const [activities, setActivities] = useState('');
  const [instructions, setInstructions] = useState('');
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weekStart || !weekEnd || !weekNumber || !summary || !activities || !instructions || !school || !department || !totalHours) {
        alert('Please fill out all fields.');
        return;
    }

    try {
      const response = await fetch('/api/weekly-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekStart,
          weekEnd,
          weekNumber: parseInt(weekNumber),
          summary,
          activities,
          instructions,
          school,
          department,
          totalHours: parseFloat(totalHours),
          status,
        }),
      });

      if (response.ok) {
        alert('Weekly report saved successfully!');
        // Optionally, clear the form
        setWeekStart('');
        setWeekEnd('');
        setWeekNumber('');
        setSummary('');
        setActivities('');
        setInstructions('');
        setSchool('');
        setDepartment('');
        setTotalHours('');
        setStatus('DRAFT');
      } else {
        const errorData = await response.json();
        alert(`Failed to save weekly report: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save weekly report:', error);
      alert('Failed to save weekly report. Please try again later.');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Weekly Report', 10, 10);
    doc.text(`Week Start: ${weekStart}`, 10, 20);
    doc.text(`Week End: ${weekEnd}`, 10, 30);
    doc.text(`Week Number: ${weekNumber}`, 10, 40);
    doc.text(`Department: ${department}`, 10, 50);
    doc.text(`Total Hours: ${totalHours}`, 10, 60);
    doc.text(`Summary: ${summary}`, 10, 70);
    doc.text(`Activities: ${activities}`, 10, 80);
    doc.text(`School: ${school}`, 10, 90);
    doc.text(`Instructions: ${instructions}`, 10, 100);

    doc.save('weekly-report.pdf');
  };

  return (
    <div className="report-form-container">
      <h1>Weekly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-group">
                <label>Week Start:</label>
                <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Week End:</label>
                <input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} required />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label>Week Number:</label>
                <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Total Hours:</label>
                <input type="number" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} required />
            </div>
        </div>
         <div className="form-group full-width">
            <label>Department:</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Summary:</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Activities:</label>
            <textarea value={activities} onChange={(e) => setActivities(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>School:</label>
            <textarea value={school} onChange={(e) => setSchool(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Instructions:</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
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

export default WeeklyReportPage;
