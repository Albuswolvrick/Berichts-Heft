import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const DailyReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/daily-reports');
                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                } else {
                    addToast('Failed to fetch daily reports', { appearance: 'error' });
                }
            } catch (error) {
                addToast('An error occurred while fetching daily reports', { appearance: 'error' });
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
                <h1>Daily Reports</h1>
                <Link to="/new-report?type=daily" className="btn-create">New Daily Report</Link>
            </div>
            <div className="report-list">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <div key={report.id} className="report-item">
                            <Link to={`/reports/${report.id}?type=daily`}>
                                <h2>{report.title}</h2>
                                <p>{new Date(report.reportDate).toLocaleDateString()}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No daily reports found.</p>
                )}
            </div>
        </div>
    );
};

export default DailyReportPage;
