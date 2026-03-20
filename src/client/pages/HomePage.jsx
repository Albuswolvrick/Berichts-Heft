import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';
import '../../../public/css/HomePage.css';

const HomePage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // This fetches all reports of all types from the new, unified endpoint.
        const response = await fetch('/api/reports/all-types');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        } else {
          addToast('Error loading reports', 'error');
        }
      } catch (error) {
        addToast('Error: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [addToast]);

  /**
   * This function gets the correct title for a report based on its type.
   * This is necessary because the title field is named differently in each report type's database schema.
   */
  const getReportTitle = (report) => {
    switch (report.type) {
      case 'Daily':
        return report.title;
      case 'Weekly':
        return report.name || 'Weekly Report';
      case 'Monthly': {
        const monthName = new Date(report.year, report.month - 1, 1).toLocaleString('en-US', { month: 'long' });
        return `${monthName} ${report.year}`;
      }
      case 'Yearly':
        return `Yearly Report ${report.year}`;
      default:
        return report.title || report.name || 'Report';
    }
  };

  return (
    <div>
      <h1>Report Booklet</h1>
      <h2>My Reports</h2>

      {loading ? (
        <Spinner />
      ) : reports.length === 0 ? (
        <p>No reports available yet.</p>
      ) : (
        <div className="report-grid">
          {reports.map((report) => {
            // The edit link must be specific to the report type, matching the new unified route.
            // Example: /reports/daily/1/edit that was a headick
            const editUrl = `/reports/${report.type.toLowerCase()}/${report.id}/edit`;

            return (
              <Link to={editUrl} key={`${report.type}-${report.id}`} className="report-card">
                <h3>{getReportTitle(report)}</h3>
                <p>Type: {report.type}</p>
                <p>Status: {report.status}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
