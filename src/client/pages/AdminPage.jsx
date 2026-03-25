import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import ThemeManager from '../components/ThemeManager';
import { useLanguage } from '../hooks/useLanguage';

const AdminPage = () => {
    const [reportType, setReportType] = useState('daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const { t } = useLanguage();

    const handleFetchReports = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            addToast('Please select a start and end date', { appearance: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/${reportType}-reports/all?startDate=${startDate}&endDate=${endDate}`);
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            } else {
                addToast('Failed to fetch reports', { appearance: 'error' });
            }
        } catch (error) {
            addToast('An error occurred while fetching reports', { appearance: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>{t('admin.title')}</h1>
            <ThemeManager />
            <form onSubmit={handleFetchReports}>
                <div className="form-group">
                    <label htmlFor="reportType">{t('admin.report_type')}</label>
                    <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">{t('admin.start_date')}</label>
                    <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">{t('admin.end_date')}</label>
                    <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? t('admin.fetching') : t('admin.fetch')}
                </button>
            </form>

            <div className="report-list">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <div key={report.id} className="report-item">
                            <h3>{report.title}</h3>
                            <p><strong>{t('common.user')}</strong> {report.user.username}</p>
                            <p><strong>{t('common.date')}</strong> {new Date(report.reportDate).toLocaleDateString()}</p>
                            <Link to={`/reports/${report.id}?type=${reportType}`}>{t('common.view_report')}</Link>
                        </div>
                    ))
                ) : (
                    <p>{t('admin.no_reports')}</p>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
