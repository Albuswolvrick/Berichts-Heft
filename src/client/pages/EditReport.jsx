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
  const { addToast } = useToast();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [hasAutoTranslated, setHasAutoTranslated] = useState(false);
  const { t, locale } = useLanguage();
  const [targetLanguage, setTargetLanguage] = useState(locale || 'de');
  useFavicon('/imgs/icons/opened_book/128x128.png');

  /**
   * Array defining all languages supported by the local M2M100 model.
   * This is used to populate the language selection dropdown and validate user choices.
   * @type {Array<{code: string, label: string}>}
   */
  const SUPPORTED_LANGS = [
    { code: 'de', label: 'German' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ar', label: 'Arabic' },
    { code: 'hi', label: 'Hindi' },
    { code: 'nl', label: 'Dutch' },
    { code: 'la', label: 'Latin' },
    { code: 'ru', label: 'Russian' },
    { code: 'uk', label: 'Ukrainian' },
    { code: 'sv', label: 'Swedish' },
    { code: 'es', label: 'Spanish' },
    { code: 'ga', label: 'Irish' }
  ];

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
          addToast('Error loading report', 'error');
        }
      } catch (error) {
        addToast('Error: ' + error.message, 'error');
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
  }, [reportType, id, addToast]);

  /**
   * Initiates the translation process for the current report's text fields.
   * This function interacts with the backend SSE endpoint to receive real-time progress updates.
   * If the requested language is not natively supported, it defaults to German.
   *
   * @param {string} targetLangParam - The 2-letter ISO language code for translation.
   * @returns {Promise<void>}
   */
  const handleTranslate = async (targetLangParam) => {
    if (!formData || translating) return;
    
    let targetLang = targetLangParam;
    const isSupported = SUPPORTED_LANGS.some(lang => lang.code === targetLang);
    
    if (!isSupported) {
      addToast('nicht suportete Sprache, Auto translate to german', 'warning');
      targetLang = 'de';
      setTargetLanguage('de');
    }

    // Extract applicable text properties to be sent to the translation API
    const textFields = {};
    const fieldsToTranslate = ['title', 'activities', 'learnings', 'challenges', 'summary', 'keyAchievements', 'goals', 'instructions', 'remarks', 'achievements', 'skillsImproved'];
    
    fieldsToTranslate.forEach(field => {
      if (formData[field] && typeof formData[field] === 'string') {
        textFields[field] = formData[field];
      }
    });

    // Explicitly ensure no sensitive data is passed to the local LLM.
    // Note: The translation model (M2M100) runs completely locally on the server.
    // No data is ever sent to external APIs or third-party cloud providers.
    // never the les I do not want any API problems in the future I am not good enough to ensure 100 % securety nore can I ever do that 
    if (textFields.password) delete textFields.password;
    if (Object.keys(textFields).length === 0) return;

    setTranslating(true);
    setTranslationProgress(0);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: textFields, targetLang })
      });

      if (!response.ok) {
        throw new Error(t('report.translation_failed') || 'Translation failed');
      }

      // Establish a connection to the SSE endpoint to stream the translation results
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let done = false;
      let buffer = '';
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop(); // retain the last incomplete chunk in the buffer

          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.substring(6));
                  
                  // Process Server-Sent Events based on their declared type
                  if (data.type === 'progress') {
                    setTranslationProgress(data.progress);
                  } else if (data.type === 'complete') {
                    setFormData(prev => ({ ...prev, ...data.translatedTexts }));
                    addToast(t('report.translated') || 'Report translated successfully', 'success');
                  }
                } catch (err) {
                  console.error('Error parsing stream chunk', err);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setTranslating(false);
      setTranslationProgress(0);
    }
  
  };
  /*
  // to try to make this work it stoped working again I do not like that probleme pls fix it
    useEffect(() => {
    // Fully automated translation on first load to the currently chosen language
    if (!loading && report && !hasAutoTranslated) {
      setHasAutoTranslated(true);
      handleTranslate(targetLanguage);
    }
  }, [loading, report, targetLanguage, hasAutoTranslated]);*/
 

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
        addToast(t('reports.saved.success.toast'), 'success');
        navigate('/');
      } else {
        addToast(t('reports.saved.failed.toast'), 'error');
      }
    } catch (error) {
      addToast(`${t('reports.saved.failed.toast')}: ${error.message}`, 'error');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!report) {
    return <p>Report not found.</p>;
  }

  const renderFormFields = () => {
    const allStatusOptions = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "DENIED", "REVISION_REQUIRED"];
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
    <div className="edit-report-page" style={{ position: 'relative' }}>
      {translating && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '200px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '8px',
          zIndex: 9999,
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '0.8rem', marginBottom: '5px', textAlign: 'center' }}>
            {t('report.translating') || 'Translating...'} {translationProgress}%
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#444', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${translationProgress}%`, height: '100%', backgroundColor: '#4caf50', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>
      )}
      <div className="edit-report-main">
        <h2>{t('report.edit')} {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</h2>
        <form onSubmit={handleSubmit} className="edit-report-form">
          {renderFormFields()}
          <div className="button-group">
            <div className="translate-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={translating}
                className="translate-lang-select"
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {SUPPORTED_LANGS.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
              <button type="button" className="translate-btn" onClick={() => handleTranslate(targetLanguage)} disabled={translating}>
                {translating ? (t('report.translating') || 'Translating...') : (t('report.translate') || 'Translate')}
              </button>
            </div>
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
