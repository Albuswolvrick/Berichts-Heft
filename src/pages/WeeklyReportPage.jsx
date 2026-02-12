import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const WeeklyReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/weekly-reports');
                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                } else {
                    addToast('Failed to fetch weekly reports', { appearance: 'error' });
                }
            } catch (error) {
                addToast('An error occurred while fetching weekly reports', { appearance: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [addToast]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Weekly Reports</h1>
                <Link to="/new-report?type=weekly" className="btn-create">New Weekly Report</Link>
            </div>
            <div className="report-list">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <div key={report.id} className="report-item">
                            <Link to={`/reports/${report.id}?type=weekly`}>
                                <h2>{report.title}</h2>
                                <p>{new Date(report.reportDate).toLocaleDateString()}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No weekly reports found.</p>
                )}
            </div>
        </div>
    );
};

export default WeeklyReportPage;
