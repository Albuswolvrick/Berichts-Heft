import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const YearlyReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/yearly-reports');
                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                } else {
                    addToast('Failed to fetch yearly reports', { appearance: 'error' });
                }
            } catch (error) {
                addToast('An error occurred while fetching yearly reports', { appearance: 'error' });
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
                <h1>Yearly Reports</h1>
                <Link to="/new-report?type=yearly" className="btn-create">New Yearly Report</Link>
            </div>
            <div className="report-list">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <div key={report.id} className="report-item">
                            <Link to={`/reports/${report.id}?type=yearly`}>
                                <h2>{report.title}</h2>
                                <p>{new Date(report.reportDate).toLocaleDateString()}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No yearly reports found.</p>
                )}
            </div>
        </div>
    );
};

export default YearlyReportPage;
