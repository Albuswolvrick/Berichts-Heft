
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import '../../../public/css/report.css';

const DailyReportPage = () => {
  const [reportDate, setReportDate] = useState('');
  const [title, setTitle] = useState('');
  const [activities, setActivities] = useState('');
  const [learnings, setLearnings] = useState('');
  const [challenges, setChallenges] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportDate || !title || !activities || !learnings || !challenges || !hoursWorked) {
        alert('Please fill out all fields.');
        return;
    }

    try {
      const response = await fetch('/api/daily-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportDate,
          title,
          activities,
          learnings,
          challenges,
          hoursWorked: parseFloat(hoursWorked),
          status,
        }),
      });

      if (response.ok) {
        alert('Daily report saved successfully!');
        // Optionally, clear the form
        setReportDate('');
        setTitle('');
        setActivities('');
        setLearnings('');
        setChallenges('');
        setHoursWorked('');
        setStatus('DRAFT');
      } else {
        const errorData = await response.json();
        alert(`Failed to save daily report: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save daily report:', error);
      alert('Failed to save daily report. Please try again later.');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Daily Report', 10, 10);
    doc.text(`Report Date: ${reportDate}`, 10, 20);
    doc.text(`Title: ${title}`, 10, 30);
    doc.text(`Activities: ${activities}`, 10, 40);
    doc.text(`Learnings: ${learnings}`, 10, 50);
    doc.text(`Challenges: ${challenges}`, 10, 60);
    doc.text(`Hours Worked: ${hoursWorked}`, 10, 70);
    doc.save('daily-report.pdf');
  };

  return (
    <div className="report-form-container">
      <h1>Daily Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-group">
                <label>Report Date:</label>
                <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Hours Worked:</label>
                <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} required />
            </div>
        </div>
        <div className="form-group full-width">
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Activities:</label>
            <textarea value={activities} onChange={(e) => setActivities(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Learnings:</label>
            <textarea value={learnings} onChange={(e) => setLearnings(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Challenges:</label>
            <textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} required />
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

export default DailyReportPage;
