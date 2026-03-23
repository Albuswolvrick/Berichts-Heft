import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import CommentSection from '../components/CommentSection';
import { useToast } from '../hooks/useToast';
import '../../../public/css/edit-report.css';
const EditReportPage = () => {
  const { reportType, id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const statusOptions = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "REVISION_REQUIRED"];
    switch (reportType) {
      case 'daily':
        return (
          <>
            <label>Title: <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} /></label>
            <label>Date: <input type="date" name="reportDate" value={formData.reportDate || ''} onChange={handleInputChange} /></label>
            <label>Activities: <textarea name="activities" value={formData.activities || ''} onChange={handleInputChange}></textarea></label>
            <label>Learnings: <textarea name="learnings" value={formData.learnings || ''} onChange={handleInputChange}></textarea></label>
            <label>Challenges: <textarea name="challenges" value={formData.challenges || ''} onChange={handleInputChange}></textarea></label>
            <label>Hours Worked: <input type="number" name="hoursWorked" value={formData.hoursWorked || ''} onChange={handleInputChange} /></label>
            <label>Status:
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      case 'weekly':
        return (
          <>
            <label>Name: <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /></label>
            <label>Week Start: <input type="date" name="weekStart" value={formData.weekStart || ''} onChange={handleInputChange} /></label>
            <label>Week End: <input type="date" name="weekEnd" value={formData.weekEnd || ''} onChange={handleInputChange} /></label>
            <label>Week Number: <input type="number" name="weekNumber" value={formData.weekNumber || ''} onChange={handleInputChange} /></label>
            <label>Department: <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} /></label>
            <label>Year of Training: <input type="number" name="yearOfTraining" value={formData.yearOfTraining || ''} onChange={handleInputChange} /></label>
            <label>Summary: <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>Activities: <textarea name="activities" value={formData.activities || ''} onChange={handleInputChange}></textarea></label>
            <label>School: <textarea name="school" value={formData.school || ''} onChange={handleInputChange}></textarea></label>
            <label>Total Hours: <input type="number" name="totalHours" value={formData.totalHours || ''} onChange={handleInputChange} /></label>
            <label>Remarks: <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange}></textarea></label>
            <label>Status:
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      case 'monthly':
        return (
          <>
            <label>Name: <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /></label>
            <label>Month: <input type="number" name="month" value={formData.month || ''} onChange={handleInputChange} /></label>
            <label>Year: <input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} /></label>
            <label>Month Start: <input type="date" name="monthStart" value={formData.monthStart || ''} onChange={handleInputChange} /></label>
            <label>Month End: <input type="date" name="monthEnd" value={formData.monthEnd || ''} onChange={handleInputChange} /></label>
            <label>Summary: <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>Key Achievements: <textarea name="keyAchievements" value={formData.keyAchievements || ''} onChange={handleInputChange}></textarea></label>
            <label>Goals: <textarea name="goals" value={formData.goals || ''} onChange={handleInputChange}></textarea></label>
            <label>Total Hours: <input type="number" name="totalHours" value={formData.totalHours || ''} onChange={handleInputChange} /></label>
            <label>Year of Training: <input type="number" name="yearOfTraining" value={formData.yearOfTraining || ''} onChange={handleInputChange} /></label>
            <label>Instructions: <textarea name="instructions" value={formData.instructions || ''} onChange={handleInputChange}></textarea></label>
            <label>Remarks: <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange}></textarea></label>
            <label>Status:
              <select name="status" value={formData.status || ''} onChange={handleInputChange}>
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </>
        );
      case 'yearly':
        return (
          <>
            <label>Year: <input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} /></label>
            <label>Training Year: <input type="text" name="trainingYear" value={formData.trainingYear || ''} onChange={handleInputChange} /></label>
            <label>Year Start: <input type="date" name="yearStart" value={formData.yearStart || ''} onChange={handleInputChange} /></label>
            <label>Year End: <input type="date" name="yearEnd" value={formData.yearEnd || ''} onChange={handleInputChange} /></label>
            <label>Summary: <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>Achievements: <textarea name="achievements" value={formData.achievements || ''} onChange={handleInputChange}></textarea></label>
            <label>Skills Improved: <textarea name="skillsImproved" value={formData.skillsImproved || ''} onChange={handleInputChange}></textarea></label>
            <label>Goals: <textarea name="goals" value={formData.goals || ''} onChange={handleInputChange}></textarea></label>
            <label>Total Hours: <input type="number" name="totalHours" value={formData.totalHours || ''} onChange={handleInputChange} /></label>
            <label>Status:
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
        <h2>Edit {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
        <form onSubmit={handleSubmit} className="edit-report-form">
          {renderFormFields()}
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <aside className="edit-report-sidebar">
        <CommentSection reportType={reportType} reportId={id} user={user} />
      </aside>
    </div>
  );
};

export default EditReportPage;
