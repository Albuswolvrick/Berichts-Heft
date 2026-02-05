import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error('Fehler beim Laden der Berichte');
      }
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Berichts-Heft</h1>
      <h2>Meine Berichte</h2>
      
      {loading ? (
        <p>Berichte werden geladen...</p>
      ) : reports.length === 0 ? (
        <p>Noch keine Berichte vorhanden.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              <Link to={`/reports/${report.id}`}>
                <h3>{report.title}</h3>
              </Link>
              <p>{report.content}</p>
              <p>Week ID: {report.weekId}</p>
              <p>Status: {report.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
