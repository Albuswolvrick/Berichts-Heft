import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { toInputDate, toDisplayDate } from '../utils/dateUtils';

const MonthlyReportPage = () => {
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [monthStart, setMonthStart] = useState('');
  const [monthEnd, setMonthEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [keyAchievements, setKeyAchievements] = useState('');
  const [goals, setGoals] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [instructions, setInstructions] = useState('');
  const [remarks, setRemarks] = useState('');
  const [yearOfTraining, setYearOfTraining] = useState('');

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const firstDay = new Date(currentYear, now.getMonth(), 1);
    const lastDay = new Date(currentYear, now.getMonth() + 1, 0);

    setMonth(String(currentMonth));
    setYear(String(currentYear));
    setMonthStart(toInputDate(firstDay));
    setMonthEnd(toInputDate(lastDay));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !month || !year || !monthStart || !monthEnd || !summary || !keyAchievements || !goals || !totalHours || !instructions || !remarks || !yearOfTraining) {
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
          name,
          month: parseInt(month),
          year: parseInt(year),
          monthStart,
          monthEnd,
          summary,
          keyAchievements,
          goals,
          totalHours: parseFloat(totalHours),
          status,
          instructions,
          remarks,
          yearOfTraining: parseInt(yearOfTraining),
        }),
      });

      if (response.ok) {
        alert('Monthly report saved successfully!');
        // Optionally, clear the form
        setName('');
        setMonth('');
        setYear('');
        setMonthStart('');
        setMonthEnd('');
        setSummary('');
        setKeyAchievements('');
        setGoals('');
        setTotalHours('');
        setStatus('DRAFT');
        setInstructions('');
        setRemarks('');
        setYearOfTraining('');
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
    doc.text(`Name: ${name}`, 10, 20);
    doc.text(`Month: ${month}`, 10, 30);
    doc.text(`Year: ${year}`, 10, 40);
    doc.text(`Month Start: ${toDisplayDate(monthStart)}`, 10, 50);
    doc.text(`Month End: ${toDisplayDate(monthEnd)}`, 10, 60);
    doc.text(`Total Hours: ${totalHours}`, 10, 70);
    doc.text(`Summary: ${summary}`, 10, 80);
    doc.text(`Key Achievements: ${keyAchievements}`, 10, 90);
    doc.text(`Goals: ${goals}`, 10, 100);
    doc.text(`Instructions: ${instructions}`, 10, 110);
    doc.text(`Remarks: ${remarks}`, 10, 120);
    doc.text(`Year of Training: ${yearOfTraining}`, 10, 130);

    doc.save('monthly-report.pdf');
  };

  return (
    <div className="report-form-container">
      <h1>Monthly Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group full-width">
            <label>Report Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
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
            <label>Year of Training:</label>
            <input type="number" value={yearOfTraining} onChange={(e) => setYearOfTraining(e.target.value)} required />
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
            <label>Instructions:</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>Remarks:</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} required />
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
