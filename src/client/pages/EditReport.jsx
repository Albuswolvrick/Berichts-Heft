import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';

const EditReportPage = () => {
  const { reportType, id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // This fetches the specific report to edit from the new, general endpoint.
        const response = await fetch(`/api/reports/${reportType}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReport(data);
          setFormData(data);
        } else {
          showToast('Error loading report', 'error');
        }
      } catch (error) {
        showToast('Error: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType, id, showToast]);

  // This function handles changes to any input field in the form.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // This function handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This sends the updated report data to the unified endpoint.
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

  /**
   * This function dynamically renders the correct form fields based on the report type.
   * This is necessary because each report type has a different set of fields.
   */
  const renderFormFields = () => {
    switch (reportType) {
      case 'daily':
        return (
          <>
            <label>Title: <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} /></label>
            <label>Activities: <textarea name="activities" value={formData.activities || ''} onChange={handleInputChange}></textarea></label>
            <label>Learnings: <textarea name="learnings" value={formData.learnings || ''} onChange={handleInputChange}></textarea></label>
            <label>Challenges: <textarea name="challenges" value={formData.challenges || ''} onChange={handleInputChange}></textarea></label>
            <label>Hours Worked: <input type="number" name="hoursWorked" value={formData.hoursWorked || ''} onChange={handleInputChange} /></label>
            <label>Status: <input type="text" name="status" value={formData.status || ''} onChange={handleInputChange} /></label>
          </>
        );
      case 'weekly':
        return (
          <>
            <label>Name: <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /></label>
            <label>Summary: <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>Activities: <textarea name="activities" value={formData.activities || ''} onChange={handleInputChange}></textarea></label>
            <label>Remarks: <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange}></textarea></label>
          </>
        );
      case 'monthly':
        return (
          <>
            <label>Summary: <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>Key Achievements: <textarea name="keyAchievements" value={formData.keyAchievements || ''} onChange={handleInputChange}></textarea></label>
            <label>Goals: <textarea name="goals" value={formData.goals || ''} onChange={handleInputChange}></textarea></label>
          </>
        );
      case 'yearly':
        return (
          <>
            <label>Summary: <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange}></textarea></label>
            <label>Achievements: <textarea name="achievements" value={formData.achievements || ''} onChange={handleInputChange}></textarea></label>
            <label>Skills Improved: <textarea name="skillsImproved" value={formData.skillsImproved || ''} onChange={handleInputChange}></textarea></label>
            <label>Goals: <textarea name="goals" value={formData.goals || ''} onChange={handleInputChange}></textarea></label>
          </>
        );
      default:
        return <p>Unknown report type.</p>;
    }
  };

  return (
    <div>
      <h2>Edit {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditReportPage;
