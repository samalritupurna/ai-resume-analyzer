import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './ReportGenerator.css';

const ReportGenerator = ({ analysisData }) => {
  const pdfTemplateRef = useRef(null);

  const {
    atsScore = 0,
    jobMatchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    suggestions = [],
    recommendation = "No recommendation provided.",
  } = analysisData || {};

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a'; // Green
    if (score >= 60) return '#ea580c'; // Orange
    return '#dc2626'; // Red
  };

  const handlePrintPdf = () => {
    const element = pdfTemplateRef.current;
    if (!element) return;
    
    // Temporarily make it visible for html2pdf to render correctly
    element.style.display = 'block';

    const opt = {
      margin:       [15, 15, 15, 15],
      filename:     'Resume_Analysis_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Hide it back
      element.style.display = 'none';
    });
  };

  return (
    <div className="report-generator-container">
      <div className="report-actions no-print" style={{ justifyContent: 'center' }}>
        <button className="download-btn pdf-btn" onClick={handlePrintPdf} style={{ padding: '12px 24px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📄 Download Detailed PDF Report
        </button>
      </div>

      {/* Hidden Beautiful PDF Template */}
      <div style={{ display: 'none', position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={pdfTemplateRef} style={{ padding: '40px', backgroundColor: '#ffffff', color: '#1e293b', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', width: '800px' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '3px solid #3b82f6', paddingBottom: '20px', marginBottom: '30px' }}>
            <h1 style={{ color: '#1e3a8a', margin: '0 0 8px 0', fontSize: '32px', fontWeight: '800' }}>RituResume AI</h1>
            <h2 style={{ color: '#64748b', margin: '0', fontSize: '20px', fontWeight: '500' }}>Comprehensive Resume Analysis Report</h2>
            <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '14px' }}>Generated on: {today}</p>
          </div>
          
          {/* Scores Row */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>ATS Compatibility</h3>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: getScoreColor(atsScore) }}>{atsScore}%</div>
            </div>
            <div style={{ flex: 1, padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Job Match Score</h3>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: getScoreColor(jobMatchScore) }}>{jobMatchScore}%</div>
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '18px' }}>Executive Summary</h4>
            <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: '15px' }}>{recommendation}</p>
          </div>

          {/* Grid Layout for Skills & Missing */}
          <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#0f172a', fontSize: '18px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>✓ Matched Skills</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', lineHeight: '1.8' }}>
                {matchedSkills.length > 0 ? matchedSkills.slice(0, 10).map((s, i) => <li key={i}>{s}</li>) : <li>None detected</li>}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#0f172a', fontSize: '18px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>⚠ Missing Keywords</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#ef4444', lineHeight: '1.8' }}>
                {missingSkills.length > 0 ? missingSkills.slice(0, 10).map((s, i) => <li key={i}>{s}</li>) : <li style={{ color: '#16a34a' }}>None! Great job!</li>}
              </ul>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '18px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>💪 Key Strengths</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', lineHeight: '1.7' }}>
              {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>Not identified</li>}
            </ul>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '18px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>📉 Areas of Weakness</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#ea580c', lineHeight: '1.7' }}>
              {weaknesses.length > 0 ? weaknesses.map((s, i) => <li key={i}>{s}</li>) : <li>None identified</li>}
            </ul>
          </div>

          {/* Suggestions */}
          <div style={{ backgroundColor: '#fdfbe8', padding: '24px', borderRadius: '8px', border: '1px solid #fef08a', marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#a16207', fontSize: '18px' }}>💡 Suggestions for Improvement</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#713f12', lineHeight: '1.7' }}>
              {suggestions.length > 0 ? suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>Your resume looks great as is!</li>}
            </ul>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px' }}>
            © {new Date().getFullYear()} RituResume AI. This report was generated automatically.
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
