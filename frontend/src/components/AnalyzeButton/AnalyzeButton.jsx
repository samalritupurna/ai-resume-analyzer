import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import './AnalyzeButton.css';

const AnalyzeButton = ({ isResumeUploaded = false, isJobDescriptionFilled = false, isAnalyzing = false, onAnalyze }) => {
  const isDisabled = !isResumeUploaded || !isJobDescriptionFilled || isAnalyzing;

  const handleClick = () => {
    if (isDisabled) return;
    if (onAnalyze) onAnalyze();
  };

  return (
    <div className="analyze-btn-container">
      <motion.button 
        className={`analyze-btn ${isAnalyzing ? 'loading' : ''} ${isDisabled && !isAnalyzing ? 'disabled' : ''}`}
        disabled={isDisabled}
        onClick={handleClick}
        whileHover={!isDisabled ? { y: -2, scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="btn-spinner" size={24} />
            Analyzing Resume...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Analyze Resume
          </>
        )}
        <div className="btn-glow"></div>
      </motion.button>
      
      {isDisabled && !isAnalyzing && (
        <motion.p 
          className="btn-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {!isResumeUploaded && !isJobDescriptionFilled 
            ? "Upload a resume and paste a job description to begin" 
            : !isResumeUploaded 
              ? "Upload a resume to begin" 
              : "Paste a job description to begin"}
        </motion.p>
      )}
    </div>
  );
};

export default AnalyzeButton;
