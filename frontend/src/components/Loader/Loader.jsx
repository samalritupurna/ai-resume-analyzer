import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = ({ isVisible }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner-wrapper">
          <div className="saas-spinner"></div>
        </div>
        <h2 className="loader-title">Analyzing Resume...</h2>
        <p className="loader-subtitle">Evaluating skills, experience, and job fit.</p>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.min(progress, 100)}%</span>
      </div>
    </div>
  );
};

export default Loader;
