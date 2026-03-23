// HomePage: The main landing page, displaying a grid of the user's reports.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';
import { toDisplayDate } from '../utils/dateUtils';
import '../../../public/css/HomePage.css';

const HomePage = () => {
  // State management for reports, loading status, and toast notifications.
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // On component mount, fetch all of the user's reports from the server.
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetches all reports of all types from a unified endpoint.
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
        setLoading(false); // Stop the loading indicator.
      }
    };
    fetchReports();
  }, [addToast]); // Re-run the effect if the addToast function changes.

  // getReportTitle: A helper function to get the correct title for a report based on its type.
  // This is needed because the title field is named differently across different report types.
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

      {/* Show a spinner while loading, a message if there are no reports, or the report grid. */}
      {loading ? (
        <Spinner />
      ) : reports.length === 0 ? (
        <p>No reports available yet.</p>
      ) : (
        <div className="report-grid">
          {/* Map over the reports and render a clickable card for each one. */}
          {reports.map((report) => {
            // The edit link must be specific to the report type to match the unified route.
            const editUrl = `/reports/${report.type.toLowerCase()}/${report.id}/edit`;

            return (
              <Link to={editUrl} key={`${report.type}-${report.id}`} className="report-card">
                <h3>{getReportTitle(report)}</h3>
                <p>Type: {report.type}</p>
                <p>Date: {toDisplayDate(report.reportDate || report.weekStart || report.monthStart || report.yearStart)}</p>
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
