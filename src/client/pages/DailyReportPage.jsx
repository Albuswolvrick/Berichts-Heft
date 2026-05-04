import React, { useState, useEffect } from 'react';
import { toInputDate, toDisplayDate } from '../utils/dateUtils';
import '../../../public/css/report.css';
import { handleReportDownload } from '../utils/reportPdfHelper';
import { useLanguage } from '../hooks/useLanguage';
import { useFavicon } from '../hooks/useFavicon';
import { useToast } from '../hooks/useToast';

const DailyReportPage = () => {
  const [reportDate, setReportDate] = useState(toInputDate(new Date()));
  const [title, setTitle] = useState('');
  const [activities, setActivities] = useState('');
  const [learnings, setLearnings] = useState('');
  const [challenges, setChallenges] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const { t } = useLanguage();
  const { addToast } = useToast();
  useFavicon('/imgs/icons/opened_book/128x128.png');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportDate || !title || !activities || !learnings || !challenges || !hoursWorked) {
      addToast(t('report.fill_all'), 'error');
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
        addToast(t('reports.saved.success.toast'), 'success');
        // Optionally, clear the form
        setReportDate(toInputDate(new Date()));
        setTitle('');
        setActivities('');
        setLearnings('');
        setChallenges('');
        setHoursWorked('');
        setStatus('DRAFT');
      } else {
        const errorData = await response.json();
        addToast(`${t('reports.saved.failed.toast')}: ${errorData.error}`, 'error');
      }
    } catch (error) {
      console.error('Failed to save daily report:', error);
      addToast(t('reports.saved.failed.toast'), 'error');
    }
  };

  const handleDownloadPDF = () => {
    handleReportDownload({
      type: 'Daily',
      reportDate,
      title,
      hoursWorked,
      status,
      activities,
      learnings,
      challenges,
    }, t);
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
