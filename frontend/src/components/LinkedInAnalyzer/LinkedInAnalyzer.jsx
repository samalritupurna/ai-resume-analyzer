import React from 'react';
import { Briefcase } from 'lucide-react';
import './LinkedInAnalyzer.css';

const LinkedInAnalyzer = ({ linkedinText, setLinkedinText }) => {
  return (
    <div className="linkedin-analyzer-container glass-card">
      <div className="linkedin-header">
        <Briefcase size={24} className="linkedin-icon" />
        <h2>Paste LinkedIn Profile</h2>
      </div>
      <p className="linkedin-subtitle">
        Copy and paste the text from your LinkedIn profile (or upload a PDF export of it). We will analyze it against the job description!
      </p>

      <textarea
        className="saas-input linkedin-textarea"
        placeholder="Paste your LinkedIn profile text here..."
        value={linkedinText}
        onChange={(e) => setLinkedinText(e.target.value)}
        rows="8"
      />
    </div>
  );
};

export default LinkedInAnalyzer;
