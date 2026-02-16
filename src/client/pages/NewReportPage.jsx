import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/NewReport.css';

const NewReportPage = () => {
    const navigate = useNavigate();

    return (
        <div className="new-report-container">
            <h1>Create a New Report</h1>
            <div className="report-options">
                <button className="report-option" onClick={() => navigate('/reports/daily')}>
                    <h2>Daily Report</h2>
                    <p>Submit a report for your daily activities.</p>
                </button>
                <button className="report-option" onClick={() => navigate('/reports/weekly')}>
                    <h2>Weekly Report</h2>
                    <p>Submit a weekly summary of your progress.</p>
                </button>
                <button className="report-option" onClick={() => navigate('/reports/monthly')}>
                    <h2>Monthly Report</h2>
                    <p>Submit a monthly overview of your achievements.</p>
                </button>
                <button className="report-option" onClick={() => navigate('/reports/yearly')}>
                    <h2>Yearly Report</h2>
                    <p>Submit a yearly performance review.</p>
                </button>
            </div>
        </div>
    );
};

export default NewReportPage;
