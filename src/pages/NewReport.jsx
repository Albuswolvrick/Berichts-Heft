import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const NewReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weekId, setWeekId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, weekId: parseInt(weekId) }),
      });

      if (response.ok) {
        addToast('Report created successfully');
        navigate('/');
      } else {
        addToast('Failed to create report', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error submitting report', { appearance: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report-form-container">
      <h1>Create New Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Report'}
        </button>
      </form>
    </div>
  );
};

export default NewReport;
