import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

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
        console.error(`Failed to fetch report with id ${id}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading report...</p>
      ) : report ? (
        <div>
          <h1>{report.title}</h1>
          <p>{report.content}</p>
          <p>Week ID: {report.weekId}</p>
          <p>Status: {report.status}</p>
        </div>
      ) : (
        <p>Report not found.</p>
      )}
    </div>
  );
};

export default ReportPage;
