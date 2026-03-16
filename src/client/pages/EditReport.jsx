import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';

const EditReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reportType, setReportType] = useState('');
  const [weekId, setWeekId] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
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

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setReportType(data.reportType);
        setWeekId(data.weekId);
        setStatus(data.status);

        if (data.reportType === 'WEEK') {
            setTrainingYear(data.trainingYear || '');
            setReportNumber(data.reportNumber || '');
            setWeekStart(data.weekStart ? new Date(data.weekStart).toISOString().split('T')[0] : '');
            setWeekEnd(data.weekEnd ? new Date(data.weekEnd).toISOString().split('T')[0] : '');
            setDepartment(data.department || '');
            setActivities(data.activities || '');
            setInstructions(data.instructions || '');
            setSchool(data.school || '');
        }
      } else {
        addToast(`Failed to fetch report with id ${id}`, { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error: ' + error.message, { appearance: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reportData = {
        title,
        content,
        status,
        ...(reportType === 'WEEK' && { 
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
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        addToast('Report updated successfully', { appearance: 'success' });
        navigate(`/reports/${id}`);
      } else {
        const errorData = await response.json();
        addToast(errorData.error || 'Failed to update report', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error submitting report: ' + error.message, { appearance: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="report-form-container">
      <h1>Edit Report</h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
            <div className="form-group">
                <label>Report Type: {reportType}</label>
            </div>
            {reportType === 'WEEK' && weekId && (
                <div className="form-group">
                <label>Week ID: {weekId}</label>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="REVISION_REQUIRED">Revision Required</option>
                </select>
            </div>

            {reportType === 'WEEK' && (
            <>
                <div className="form-group">
                    <label htmlFor="trainingYear">Training Year</label>
                    <input type="number" id="trainingYear" value={trainingYear} onChange={(e) => setTrainingYear(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="reportNumber">Report No.</label>
                    <input type="number" id="reportNumber" value={reportNumber} onChange={(e) => setReportNumber(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="weekStart">for the week of</label>
                    <input type="date" id="weekStart" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="weekEnd">to</label>
                    <input type="date" id="weekEnd" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="department">Training Department</label>
                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="activities">Company Activities</label>
                    <textarea id="activities" value={activities} onChange={(e) => setActivities(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="instructions">Instructions, company lessons, other training</label>
                    <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} disabled={submitting} />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="school">Vocational School</label>
                    <textarea id="school" value={school} onChange={(e) => setSchool(e.target.value)} disabled={submitting} />
                </div>
            </>
            )}

            <div className="form-group full-width">
                <label htmlFor="content">Content</label>
                <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                />
            </div>
            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Report'}
            </button>
        </fieldset>
      </form>
    </div>
  );
};

export default EditReport;
