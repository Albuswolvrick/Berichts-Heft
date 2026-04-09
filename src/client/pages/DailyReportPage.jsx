
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { toInputDate, toDisplayDate } from '../utils/dateUtils';
import '../../../public/css/report.css';
import { useLanguage } from '../hooks/useLanguage';
import { useFavicon } from '../hooks/useFavicon';

const DailyReportPage = () => {
  const [reportDate, setReportDate] = useState(toInputDate(new Date()));
  const [title, setTitle] = useState('');
  const [activities, setActivities] = useState('');
  const [learnings, setLearnings] = useState('');
  const [challenges, setChallenges] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const { t } = useLanguage();
  useFavicon('/imgs/icons/opened_book/128x128.png');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportDate || !title || !activities || !learnings || !challenges || !hoursWorked) {
        alert(t('report.fill_all'));
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
        alert(t('report.save_success'));
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
        alert(`${t('report.save_failed')}: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save daily report:', error);
      alert(t('report.save_error_generic'));
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Daily Report', 10, 10);
    doc.text(`Report Date: ${toDisplayDate(reportDate)}`, 10, 20);
    doc.text(`Title: ${title}`, 10, 30);
    doc.text(`Activities: ${activities}`, 10, 40);
    doc.text(`Learnings: ${learnings}`, 10, 50);
    doc.text(`Challenges: ${challenges}`, 10, 60);
    doc.text(`Hours Worked: ${hoursWorked}`, 10, 70);
    doc.save('daily-report.pdf');
  };

  return (
    <div className="report-form-container">
      <h1>{t('report.daily')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-group">
                <label>{t('daily.report_date')}</label>
                <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>{t('daily.hours_worked')}</label>
                <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} required />
            </div>
        </div>
        <div className="form-group full-width">
            <label>{t('daily.title')}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('daily.activities')}</label>
            <textarea value={activities} onChange={(e) => setActivities(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('daily.learnings')}</label>
            <textarea value={learnings} onChange={(e) => setLearnings(e.target.value)} required />
        </div>
        <div className="form-group full-width">
            <label>{t('daily.challenges')}</label>
            <textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} required />
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

export default DailyReportPage;
