import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weekId, setWeekId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, weekId: parseInt(weekId) }),
      });

      if (response.ok) {
        console.log('Report created successfully');
        navigate('/');
      } else {
        console.error('Failed to create report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
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
        <button type="submit">Save Report</button>
      </form>
    </div>
  );
};

export default NewReport;
