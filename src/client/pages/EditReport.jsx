import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import CommentSection from '../components/CommentSection';
import { useToast } from '../hooks/useToast';
import { toDisplayDate } from '../utils/dateUtils';
import { handleReportDownload } from '../utils/reportPdfHelper';
import '../../../public/css/edit-report.css';
import { useLanguage } from '../hooks/useLanguage';
import { useFavicon } from '../hooks/useFavicon';

const EditReportPage = () => {
  const { reportType, id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  useFavicon('/imgs/icons/opened_book/128x128.png');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${reportType}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReport(data);
          // For date inputs, we need to format the date to YYYY-MM-DD
          const formattedData = { ...data };
          Object.keys(formattedData).forEach(key => {
            if (['weekStart', 'weekEnd', 'monthStart', 'monthEnd', 'yearStart', 'yearEnd', 'reportDate'].includes(key) && formattedData[key]) {
              formattedData[key] = new Date(formattedData[key]).toISOString().split('T')[0];
            }
          });
          setFormData(formattedData);
        } else {
          showToast('Error loading report', 'error');
        }
      } catch (error) {
        showToast('Error: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };
    fetchReport();
    fetchUser();
  }, [reportType, id, showToast]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleDownloadPDF = () => {
    handleReportDownload({ ...formData, type: reportType }, t);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reports/${reportType}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        showToast('Report updated successfully', 'success');
        navigate('/');
      } else {
        showToast('Error updating report', 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!report) {
    return <p>Report not found.</p>;
  }

  const renderFormFields = () => {
    const allStatusOptions = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "REVISION_REQUIRED"];
    const statusOptions = user?.role === 'ADMIN' 
      ? allStatusOptions 
      : ["DRAFT", "SUBMITTED"];
    switch (reportType) {
      case 'daily':
        return (
          <>
            <label>{t('daily.title')} <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} /></label>
            <label>{t('daily.report_date')} <input type="date" name="reportDate" value={formData.reportDate || ''} onChange={handleInputChange} /></label>
            <label>{t('daily.activities')} <textarea name="activities" value={formData.activities || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('daily.learnings')} <textarea name="learnings" value={formData.learnings || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('daily.challenges')} <textarea name="challenges" value={formData.challenges || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('daily.hours_worked')} <input type="number" name="hoursWorked" value={formData.hoursWorked || ''} onChange={handleInputChange} /></label>
            <label>{t('daily.status')}
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      case 'weekly':
        return (
          <>
            <label>{t('weekly.name')} <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /></label>
            <label>{t('weekly.from')} <input type="date" name="weekStart" value={formData.weekStart || ''} onChange={handleInputChange} /></label>
            <label>{t('weekly.to')} <input type="date" name="weekEnd" value={formData.weekEnd || ''} onChange={handleInputChange} /></label>
            <label>{t('weekly.calendar_week')} <input type="number" name="weekNumber" value={formData.weekNumber || ''} onChange={handleInputChange} /></label>
            <label>{t('weekly.department')} <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} /></label>
            <label>{t('weekly.year_of_training')} <input type="number" name="yearOfTraining" value={formData.yearOfTraining || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.summary')} <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('weekly.company_activities')} <textarea name="activities" value={formData.activities || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('weekly.school')} <textarea name="school" value={formData.school || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('weekly.total_hours')} <input type="number" name="totalHours" value={formData.totalHours || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.remarks')} <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('daily.status')}
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      case 'monthly':
        return (
          <>
            <label>{t('monthly.name')} <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.month')} <input type="number" name="month" value={formData.month || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.year')} <input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.start')} <input type="date" name="monthStart" value={formData.monthStart || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.end')} <input type="date" name="monthEnd" value={formData.monthEnd || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.summary')} <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('monthly.achievements')} <textarea name="keyAchievements" value={formData.keyAchievements || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('monthly.goals')} <textarea name="goals" value={formData.goals || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('weekly.total_hours')} <input type="number" name="totalHours" value={formData.totalHours || ''} onChange={handleInputChange} /></label>
            <label>{t('weekly.year_of_training')} <input type="number" name="yearOfTraining" value={formData.yearOfTraining || ''} onChange={handleInputChange} /></label>
            <label>{t('monthly.instructions')} <textarea name="instructions" value={formData.instructions || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('monthly.remarks')} <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('daily.status')}
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      case 'yearly':
        return (
          <>
            <label>{t('yearly.year')} <input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} /></label>
            <label>{t('yearly.training_year')} <input type="text" name="trainingYear" value={formData.trainingYear || ''} onChange={handleInputChange} /></label>
            <label>{t('yearly.start')} <input type="date" name="yearStart" value={formData.yearStart || ''} onChange={handleInputChange} /></label>
            <label>{t('yearly.end')} <input type="date" name="yearEnd" value={formData.yearEnd || ''} onChange={handleInputChange} /></label>
            <label>{t('yearly.summary')} <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('yearly.achievements')} <textarea name="achievements" value={formData.achievements || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('yearly.skills_improved')} <textarea name="skillsImproved" value={formData.skillsImproved || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('yearly.goals')} <textarea name="goals" value={formData.goals || ''} onChange={handleInputChange}></textarea></label>
            <label>{t('weekly.total_hours')} <input type="number" name="totalHours" value={formData.totalHours || ''} onChange={handleInputChange} /></label>
            <label>{t('daily.status')}
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      default:
        return <p>Unknown report type.</p>;
    }
  };

  return (
    <div className="edit-report-page">
      <div className="edit-report-main">
        <h2>{t('report.edit')} {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</h2>
        <form onSubmit={handleSubmit} className="edit-report-form">
          {renderFormFields()}
          <div className="button-group">
            <button type="submit">{t('edit.save')}</button>
            <button type="button" className="download-btn" onClick={handleDownloadPDF}>
              {t('report.download_pdf')}
            </button>
          </div>
        </form>
      </div>
      <aside className="edit-report-sidebar">
        <CommentSection reportType={reportType} reportId={id} user={user} />
      </aside>
    </div>
  );
};

export default EditReportPage;
