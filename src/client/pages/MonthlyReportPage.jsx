import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { toInputDate, toDisplayDate } from '../utils/dateUtils';
import { useLanguage } from '../hooks/useLanguage';

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
  const { t } = useLanguage();

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
        alert(t('report.fill_all'));
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
        alert(t('report.save_success'));
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
        alert(`${t('report.save_failed')}: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save monthly report:', error);
      alert(t('report.save_error_generic'));
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
      <h1>{t('report.monthly')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group full-width">
            <label>{t('monthly.name')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-row">
            <div className="form-group">
                <label>{t('monthly.month')}</label>
                <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>{t('monthly.year')}</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label>{t('monthly.start')}</label>
                <input type="date" value={monthStart} onChange={(e) => setMonthStart(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>{t('monthly.end')}</label>
                <input type="date" value={monthEnd} onChange={(e) => setMonthEnd(e.target.value)} required />
            </div>
        </div>
        <div className="form-group full-width">
            <label>{t('weekly.total_hours')}</label>
            <input type="number" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('weekly.year_of_training')}</label>
            <input type="number" value={yearOfTraining} onChange={(e) => setYearOfTraining(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('monthly.summary')}</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('monthly.achievements')}</label>
            <textarea value={keyAchievements} onChange={(e) => setKeyAchievements(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('monthly.goals')}</label>
            <textarea value={goals} onChange={(e) => setGoals(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('monthly.instructions')}</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('monthly.remarks')}</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('daily.status')}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="DRAFT">{t('report.draft')}</option>
                <option value="SUBMITTED">{t('report.submitted')}</option>
            </select>
        </div>
        <div className="button-group">
            <button type="submit">{t('report.save_button')}</button>
            <button type="button" className="download-btn" onClick={handleDownloadPDF}>{t('report.download_pdf')}</button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyReportPage;
