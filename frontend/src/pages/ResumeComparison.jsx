import React from 'react';
import { Link } from 'react-router-dom';

const ResumeComparison = () => {
  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Resume <span className="gradient-text">Comparison</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '600px', textAlign: 'center', marginBottom: '40px' }}>
        Select two of your resume versions to compare them side-by-side and see an AI analysis of which is stronger for specific roles.
      </p>
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <p style={{ marginBottom: '24px' }}>Please go to the Resume Versions dashboard to select resumes for comparison.</p>
        <Link to="/resumes" className="saas-btn">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default ResumeComparison;
