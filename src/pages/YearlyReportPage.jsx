
import React, { useState } from 'react';
import jsPDF from 'jspdf';

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

  const handleSave = async () => {
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
        }),
      });

      if (response.ok) {
        alert('Yearly report saved successfully!');
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
    doc.text(`Year Start: ${yearStart}`, 10, 40);
    doc.text(`Year End: ${yearEnd}`, 10, 50);
    doc.text(`Total Hours: ${totalHours}`, 10, 60);
    doc.text(`Summary: ${summary}`, 10, 70);
    doc.text(`Achievements: ${achievements}`, 10, 80);
    doc.text(`Skills Improved: ${skillsImproved}`, 10, 90);
    doc.text(`Goals: ${goals}`, 10, 100);

    doc.save('yearly-report.pdf');
  };

  return (
    <div>
      <h1>Yearly Report</h1>
      <form>
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div>
          <label>Training Year:</label>
          <input
            type="text"
            value={trainingYear}
            onChange={(e) => setTrainingYear(e.target.value)}
          />
        </div>
        <div>
          <label>Year Start:</label>
          <input
            type="date"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value)}
          />
        </div>
        <div>
          <label>Year End:</label>
          <input
            type="date"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value)}
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
          <label>Achievements:</label>
          <textarea
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          />
        </div>
        <div>
          <label>Skills Improved:</label>
          <textarea
            value={skillsImproved}
            onChange={(e) => setSkillsImproved(e.target.value)}
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

export default YearlyReportPage;
