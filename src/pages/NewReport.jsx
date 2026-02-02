import React, { useState } from 'react';

const NewReport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      // Handle successful report creation
      console.log('Report created successfully');
      setTitle('');
      setContent('');
    } else {
      // Handle error
      console.error('Failed to create report');
    }
  };

  return (
    <div>
      <h2>Create New Report</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Save Report</button>
      </form>
    </div>
  );
};

export default NewReport;
