// HomePage: The main landing page, displaying a grid of the user's reports.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { toDisplayDate } from '../utils/dateUtils';
import { handleReportDownload } from '../utils/reportPdfHelper';
import '../../../public/css/HomePage.css';

const HomePage = ({ user }) => {
  // State management for reports, loading status, search, and toast notifications.
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();
  const { t } = useLanguage();

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
  }, [addToast]);

  // Filter reports whenever they are loaded or the search term changes.
  useEffect(() => {
    let filtered = reports;

    // RULE: Only show user's own reports on the home page.
    if (user && user.id) {
        filtered = filtered.filter((r) => r.userId === user.id);
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((r) => {
        const title = (r.title || r.name || '').toLowerCase();
        const type = (r.type || '').toLowerCase();
        const status = (r.status || '').toLowerCase();
        return title.includes(term) || type.includes(term) || status.includes(term);
      });
    }

    setFilteredReports(filtered);
  }, [reports, search, user]);

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
      <h1>{t('home.title')}</h1>
      <h2>{t('home.my_reports')}</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder={t('home.search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
            <button onClick={() => setSearch('')} className="search-clear">
                {t('home.clear')}
            </button>
        )}
      </div>

      {/* Show a spinner while loading, a message if there are no reports, or the report grid. */}
      {loading ? (
        <Spinner />
      ) : filteredReports.length === 0 ? (
        <p>{search ? t('home.no_reports_search') : t('home.no_reports_yet')}</p>
      ) : (
        <div className="report-grid">
          {/* Map over the reports and render a clickable card for each one. */}
          {filteredReports.map((report) => {
            // The edit link must be specific to the report type to match the unified route.
            const editUrl = `/reports/${report.type.toLowerCase()}/${report.id}/edit`;

            return (
              <Link to={editUrl} key={`${report.type}-${report.id}`} className={`report-card ${report.status.toLowerCase()}`}>
                <div className="report-card-header">
                  <h3>{getReportTitle(report)}</h3>
                  <button 
                    className="card-download-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReportDownload(report, t);
                    }}
                    title={t('report.download_pdf')}
                  >
                    ⬇️
                  </button>
                </div>
                <p>{t('home.type', { type: report.type })}</p>
                <p>{t('home.date', { date: toDisplayDate(report.reportDate || report.weekStart || report.monthStart || report.yearStart) })}</p>
                <p>{t('home.status', { status: report.status })}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
