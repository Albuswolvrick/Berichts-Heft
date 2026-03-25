import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/NewReport.css';
import { useLanguage } from '../hooks/useLanguage';

const NewReportPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="new-report-container">
            <h1>{t('report.create_new')}</h1>
            <div className="report-options">
                <button className="report-option" onClick={() => navigate('/reports/daily')}>
                    <h2>{t('report.daily')}</h2>
                    <p>{t('report.daily_desc')}</p>
                </button>
                <button className="report-option" onClick={() => navigate('/reports/weekly')}>
                    <h2>{t('report.weekly')}</h2>
                    <p>{t('report.weekly_desc')}</p>
                </button>
                <button className="report-option" onClick={() => navigate('/reports/monthly')}>
                    <h2>{t('report.monthly')}</h2>
                    <p>{t('report.monthly_desc')}</p>
                </button>
                <button className="report-option" onClick={() => navigate('/reports/yearly')}>
                    <h2>{t('report.yearly')}</h2>
                    <p>{t('report.yearly_desc')}</p>
                </button>
            </div>
        </div>
    );
};

export default NewReportPage;
