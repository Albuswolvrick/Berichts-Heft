import React, { useState } from 'react';

const NewReport = () => {
  const [formData, setFormData] = useState({
    traineeName: '',
    trainingYear: '',
    reportNumber: '',
    date: '',
    activities: '',
    schoolTopic: '',
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Report created successfully');
        // Reset form or redirect
      } else {
        console.error('Failed to create report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="report-form-container">
      <h1>Berichtsheft erstellen</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="traineeName">Name des Auszubildenden</label>
            <input
              type="text"
              id="traineeName"
              name="traineeName"
              value={formData.traineeName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="trainingYear">Ausbildungsjahr</label>
            <input
              type="number"
              id="trainingYear"
              name="trainingYear"
              value={formData.trainingYear}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reportNumber">Berichtsnummer</label>
            <input
              type="text"
              id="reportNumber"
              name="reportNumber"
              value={formData.reportNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Datum</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="activities">Betriebliche Tätigkeit</label>
          <textarea
            id="activities"
            name="activities"
            value={formData.activities}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="schoolTopic">Thema des Berufsschulunterrichts</label>
          <textarea
            id="schoolTopic"
            name="schoolTopic"
            value={formData.schoolTopic}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="comments">Bemerkungen/Fragen</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Bericht speichern</button>
      </form>
    </div>
  );
};

export default NewReport;
