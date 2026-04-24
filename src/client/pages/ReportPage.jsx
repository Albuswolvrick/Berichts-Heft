import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { useFavicon } from '../hooks/useFavicon';

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useLanguage();
  useFavicon('/imgs/icons/opened_book/128x128.png');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        showToast(`Failed to fetch report with id ${id}`, 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showToast('Report deleted successfully', 'success');
        navigate('/');
      } else {
        showToast('Failed to delete report', 'error');
      }
    } catch (error) {
      showToast('Error deleting report: ' + error.message, 'error');
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : report ? (
        <div>
          <h1>{report.title}</h1>
          <p>{report.content}</p>
          <p>Week ID: {report.weekId}</p>
          <p>{t('daily.status')} {report.status}</p>
          <Link to={`/reports/${id}/edit`}>{t('report.edit')}</Link>
          <button onClick={handleDelete}>{t('report.delete')}</button>
        </div>
      ) : (
        <p>{t('report.not_found')}</p>
      )}
    </div>
  );
};

export default ReportPage;
