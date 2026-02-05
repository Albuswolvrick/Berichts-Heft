import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';

const EditReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weekId, setWeekId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
        setWeekId(data.weekId);
      } else {
        showToast(`Failed to fetch report with id ${id}`, 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, weekId: parseInt(weekId) }),
      });

      if (response.ok) {
        showToast('Report updated successfully', 'success');
        navigate(`/reports/${id}`);
      } else {
        showToast('Failed to update report', 'error');
      }
    } catch (error) {
      showToast('Error submitting report: ' + error.message, 'error');
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
            <label htmlFor="weekId">Week ID</label>
            <input
              type="number"
              id="weekId"
              name="weekId"
              value={weekId}
              onChange={(e) => setWeekId(e.target.value)}
              required
            />
          </div>
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
