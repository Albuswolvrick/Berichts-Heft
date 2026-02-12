
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

  const handleSave = async () => {
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
        }),
      });

      if (response.ok) {
        alert('Weekly report saved successfully!');
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
    <div>
      <h1>Weekly Report</h1>
      <form>
        <div>
          <label>Week Start:</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
        </div>
        <div>
          <label>Week End:</label>
          <input
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
          />
        </div>
        <div>
          <label>Week Number:</label>
          <input
            type="number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div>
          <label>Total Hours:</label>
          <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
          />
        </div>
        <div>
          <label>Summary:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <label>Activities:</label>
          <textarea
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          />
        </div>
        <div>
          <label>School:</label>
          <textarea
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <div>
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSave}>
          Save Report
        </button>
        <button type="button" onClick={handleDownloadPDF}>
          Download as PDF
        </button>
      </form>
    </div>
  );
};

export default WeeklyReportPage;
