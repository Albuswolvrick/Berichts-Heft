import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';

const HomePage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
        showToast('Fehler beim Laden der Berichte', 'error');
      }
    } catch (error) {
      showToast('Fehler: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Berichts-Heft</h1>
      <h2>Meine Berichte</h2>
      
      {loading ? (
        <Spinner />
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
