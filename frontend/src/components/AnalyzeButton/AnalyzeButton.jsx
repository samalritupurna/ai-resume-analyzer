import React, { useState } from 'react';
import './AnalyzeButton.css';

const AnalyzeButton = ({ isResumeUploaded = false, isJobDescriptionFilled = false, onAnalyze }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const isDisabled = !isResumeUploaded || !isJobDescriptionFilled || isLoading;

  const handleClick = () => {
    if (isDisabled) return;
    if (onAnalyze) onAnalyze();
  };

  return (
    <div className="analyze-btn-section">
      <div className="analyze-btn-container">
        <button 
          className={`analyze-btn ${isLoading ? 'loading' : ''} ${isDisabled ? 'disabled' : ''}`}
          disabled={isDisabled}
          onClick={handleClick}
        >
          {isLoading ? (
            <span className="btn-loader"></span>
          ) : (
            "Analyze Resume"
          )}
        </button>
        {isDisabled && !isLoading && (
          <p className="btn-hint">
            {!isResumeUploaded && !isJobDescriptionFilled 
              ? "Upload a resume and paste a job description to analyze." 
              : !isResumeUploaded 
                ? "Upload a resume to analyze." 
                : "Paste a job description to analyze."}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyzeButton;
