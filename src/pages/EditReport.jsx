import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weekId, setWeekId] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

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
        console.error(`Failed to fetch report with id ${id}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, weekId: parseInt(weekId) }),
      });

      if (response.ok) {
        console.log('Report updated successfully');
        navigate(`/reports/${id}`);
      } else {
        console.error('Failed to update report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="report-form-container">
      <h1>Edit Report</h1>
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

export default EditReport;
