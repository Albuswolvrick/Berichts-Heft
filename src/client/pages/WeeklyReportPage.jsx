import { useState } from 'react';
import '../../../public/css/report.css';
import { useToast } from '../hooks/useToast';
import { weeklyReportApi } from '../services/api';
import { getWeekRangeFromDate } from '../utils/dateUtils';
import { downloadReportPdf } from '../utils/pdfGenerator';

const initialState = {
  name: '',
  weekStart: '',
  weekEnd: '',
  weekNumber: '',
  summary: '',
  activities: '',
  school: '',
  department: '',
  totalHours: '',
  yearOfTraining: '',
  remarks: '',
  status: 'DRAFT',
};

const WeeklyReportPage = () => {
  const [formData, setFormData] = useState(initialState);
  const { addToast } = useToast();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleWeekStartChange = (e) => {
    const selectedDate = e.target.value;
    const week = getWeekRangeFromDate(selectedDate);

    if (!week) {
      setFormData((prev) => ({ ...prev, weekStart: selectedDate, weekEnd: '', weekNumber: '' }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weekNumber: String(week.weekNumber),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      weekStart,
      weekEnd,
      weekNumber,
      summary,
      activities,
      remarks,
      school,
      department,
      totalHours,
      yearOfTraining,
      status,
    } = formData;

    if (
      !name ||
      !weekStart ||
      !weekEnd ||
      !weekNumber ||
      !summary ||
      !activities ||
      !school ||
      !department ||
      !totalHours ||
      !yearOfTraining ||
      !remarks
    ) {
      addToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
      return;
    }

    try {
      const report = await weeklyReportApi.create({
        name,
        weekStart,
        weekEnd,
        weekNumber: parseInt(weekNumber, 10),
        department,
        summary,
        activities,
        school,
        remarks,
        totalHours: parseFloat(totalHours),
        yearOfTraining: parseInt(yearOfTraining, 10),
        status,
      });

      addToast(`Wochenbericht gespeichert (ID: ${report.id})`, 'success');
      setFormData(initialState);
    } catch (error) {
      addToast(`Speichern fehlgeschlagen: ${error.message}`, 'error');
    }
  };

  const handleDownloadPDF = () => {
    downloadReportPdf({
      title: 'Wochenbericht',
      fileName: `Wochenbericht_KW${formData.weekNumber}_${formData.name}.pdf`,
      metadata: [
        { label: 'Name des Auszubildenden', value: formData.name },
        { label: 'Kalenderwoche', value: formData.weekNumber },
        { label: 'Zeitraum von', value: formData.weekStart },
        { label: 'Zeitraum bis', value: formData.weekEnd },
        { label: 'Ausbildungsjahr', value: formData.yearOfTraining },
        { label: 'Ausbildungsabteilung', value: formData.department },
        { label: 'Gesamtstunden', value: formData.totalHours },
        { label: 'Status', value: formData.status === 'DRAFT' ? 'Entwurf' : 'Eingereicht' },
      ],
      sections: [
        { label: 'Betriebliche Tätigkeiten', value: formData.activities },
        {
          label:
            'Unterweisungen, Lehrgespräche, betrieblicher Unterricht, außerbetriebliche Schulungsveranstaltungen, Zwischenprüfung',
          value: formData.summary,
        },
        { label: 'Berufsschule (Unterrichtsthemen)', value: formData.school },
        { label: 'Bemerkungen', value: formData.remarks },
      ],
    });
  };

  return (
    <div className="report-form-container">
      <h1>Wochenbericht</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Name:</label>
            <input type="text" value={formData.name} onChange={handleChange('name')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Ausbildungswoche vom :</label>
            <input
              type="date"
              value={formData.weekStart}
              onChange={handleWeekStartChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Bis :</label>
            <input type="date" value={formData.weekEnd} readOnly required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Kalenderwoche (automatisch):</label>
            <input type="number" value={formData.weekNumber} readOnly required />
          </div>
          <div className="form-group">
            <label>Gesamtstunden:</label>
            <input
              type="number"
              value={formData.totalHours}
              onChange={handleChange('totalHours')}
              required
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Ausbildungsabteilung:</label>
          <input
            type="text"
            value={formData.department}
            onChange={handleChange('department')}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Ausbildungsjahr</label>
          <input
            type="number"
            value={formData.yearOfTraining}
            onChange={handleChange('yearOfTraining')}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Betriebliche Tätigkeiten:</label>
          <textarea value={formData.activities} onChange={handleChange('activities')} required />
        </div>
        <div className="form-group full-width">
          <label>
            Unterweisungen, Lehrgespräche, betrieblicher Unterricht, außerbetriebliche
            Schulungsveranstaltungen, Zwischenprüfung:
          </label>
          <textarea value={formData.summary} onChange={handleChange('summary')} required />
        </div>
        <div className="form-group full-width">
          <label>Berufsschule (Unterrichtsthemen):</label>
          <textarea value={formData.school} onChange={handleChange('school')} required />
        </div>
        <div className="form-group full-width">
          <label>Bemerkungen:</label>
          <textarea value={formData.remarks} onChange={handleChange('remarks')} required />
        </div>
        <div className="form-group full-width">
          <label>Status:</label>
          <select value={formData.status} onChange={handleChange('status')}>
            <option value="DRAFT">Entwurf</option>
            <option value="SUBMITTED">Eingereicht</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit">Bericht speichern</button>
          <button type="button" className="download-btn" onClick={handleDownloadPDF}>
            Als PDF herunterladen
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyReportPage;
