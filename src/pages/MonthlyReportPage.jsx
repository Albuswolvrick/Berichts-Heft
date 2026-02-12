
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

  const handleSave = async () => {
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
        }),
      });

      if (response.ok) {
        alert('Monthly report saved successfully!');
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
    <div>
      <h1>Monthly Report</h1>
      <form>
        <div>
          <label>Month:</label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div>
          <label>Month Start:</label>
          <input
            type="date"
            value={monthStart}
            onChange={(e) => setMonthStart(e.target.value)}
          />
        </div>
        <div>
          <label>Month End:</label>
          <input
            type="date"
            value={monthEnd}
            onChange={(e) => setMonthEnd(e.target.value)}
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
          <label>Key Achievements:</label>
          <textarea
            value={keyAchievements}
            onChange={(e) => setKeyAchievements(e.target.value)}
          />
        </div>
        <div>
          <label>Goals:</label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
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

export default MonthlyReportPage;
