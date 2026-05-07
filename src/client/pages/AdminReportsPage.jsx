// AdminReportsPage: A component for administrators to view and filter all user reports. 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import { handleReportDownload } from '../utils/reportPdfHelper';
import '../../../public/css/AdminReportsPage.css';
import '../../../public/css/HomePage.css';
import { useLanguage } from '../hooks/useLanguage';

const AdminReportsPage = () => {
    // State management for reports, users, search term, selected user, loading status, and errors.
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useLanguage();

    // On component mount, fetch all reports and users from the API.
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                // Fetch reports and users in parallel. Reports are fetched from the same unified endpoint as the HomePage.
                const [reportsResponse, usersData] = await Promise.all([
                    fetch('/api/reports/all-types'),
                    userApi.getAll(),
                ]);

                if (!reportsResponse.ok) {
                    throw new Error(`Failed to fetch reports: ${reportsResponse.statusText}`);
                }

                const reportsData = await reportsResponse.json();

                setReports(reportsData);
                setUsers(usersData);
                setError(null); // Clear any previous errors.
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false); // Stop the loading indicator.
            }
        };
        fetchInitialData();
    }, []);

    // getReportTitle: A helper function to get the correct title for a report based on its type.
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

    // Filter reports based on the search term and the selected user ID.
    const filteredReports = reports
        .filter(report => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const user = users.find(u => u.id === report.userId);
            const reportTitle = getReportTitle(report);

            const reportTitleMatch = reportTitle.toLowerCase().includes(lowerCaseSearchTerm);
            const userNameMatch = user && user.name && user.name.toLowerCase().includes(lowerCaseSearchTerm);
            const userUsernameMatch = user && user.username && user.username.toLowerCase().includes(lowerCaseSearchTerm);

            return reportTitleMatch || userNameMatch || userUsernameMatch;
        })
        .filter(report =>
            selectedUserId ? report.userId === parseInt(selectedUserId) : true
        );

    return (
        <div className="admin-reports-page">
            <h1>{t('admin.title')}</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder={t('home.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="user-select-list"
                    size={8}
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">{t('admin.all_users')}</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.role})
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p>{t('admin.loading')}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="report-grid">
                {!loading && !error && filteredReports.length > 0 ? (
                    filteredReports.map(report => {
                        const user = users.find(u => u.id === report.userId);
                        // The edit link is specific to the report type, matching the unified route.
                        const editUrl = `/reports/${report.type.toLowerCase()}/${report.id}/edit`;
                        return (
                            <Link to={editUrl} key={`${report.type}-${report.id}`} className="report-card">
                                <div className="report-card-header">
                                    <h3>{getReportTitle(report)}</h3>
                                    {/* the buton to download the report */}
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
                                    {/* the buton to deleate the report */}
                                    <button
                                        className="card-deleate-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleReportDelete(report.id, t);
                                        }}
                                        title={t('report.deleate')}
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <p><strong>{t('common.user')}</strong> {user ? `${user.name} (${user.username})` : 'N/A'}</p>
                                <p><strong>{t('common.date')}</strong> {report.reportDate ? formatDate(report.reportDate) : 'N/A'}</p>
                            </Link>
                        );
                    })
                ) : (
                    !loading && !error && <p>{t('admin.no_reports')}</p>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;
