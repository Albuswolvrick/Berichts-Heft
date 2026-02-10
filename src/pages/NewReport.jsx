import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import '../../public/css/NewReport.css';

const NewReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reportType, setReportType] = useState('DAY');
  const [weekId, setWeekId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // State for detailed weekly report fields
  const [trainingYear, setTrainingYear] = useState('');
  const [reportNumber, setReportNumber] = useState('');
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [department, setDepartment] = useState('');
  const [activities, setActivities] = useState('');
  const [instructions, setInstructions] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const reportData = {
      title,
      content,
      reportType,
      ...(reportType === 'WEEK' && { 
        weekId,
        trainingYear,
        reportNumber,
        weekStart,
        weekEnd,
        department,
        activities,
        instructions,
        school,
      }),
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        addToast('Report created successfully');
        navigate('/');
      } else {
        const errorData = await response.json();
        addToast(errorData.error || 'Failed to create report', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error submitting report', { appearance: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report-form-container">
      <div className="report-form-header">
        <h1>New Report</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="report-form-grid">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="form-group">
            <label htmlFor="reportType">Report Type</label>
            <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)} required disabled={isLoading}>
              <option value="DAY">Day</option>
              <option value="WEEK">Week</option>
              <option value="MONTH">Month</option>
              <option value="YEAR">Year</option>
            </select>
          </div>

          {reportType === 'WEEK' && (
            <>
                <div className="form-group">
                    <label htmlFor="trainingYear">Ausbildungsjahr</label>
                    <input type="number" id="trainingYear" value={trainingYear} onChange={(e) => setTrainingYear(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label htmlFor="reportNumber">Berichts-Nr.</label>
                    <input type="number" id="reportNumber" value={reportNumber} onChange={(e) => setReportNumber(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label htmlFor="weekStart">für die Woche vom</label>
                    <input type="date" id="weekStart" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label htmlFor="weekEnd">bis</label>
                    <input type="date" id="weekEnd" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="department">Ausbildungsabteilung</label>
                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="activities">Betriebliche Tätigkeiten</label>
                    <textarea id="activities" value={activities} onChange={(e) => setActivities(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="instructions">Unterweisungen, betrieblicher Unterricht, sonstige Schulungen</label>
                    <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="school">Berufsschule</label>
                    <textarea id="school" value={school} onChange={(e) => setSchool(e.target.value)} disabled={isLoading} />
                </div>
            </>
          )}

          <div className="form-group full-width">
            <label htmlFor="content">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required disabled={isLoading} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewReport;
