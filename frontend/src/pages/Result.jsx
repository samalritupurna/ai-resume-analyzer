import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ScoreCard from '../components/ScoreCard/ScoreCard';
import Skills from '../components/Skills/Skills';
import ResultCard from '../components/ResultCard/ResultCard';
import Suggestion from '../components/Suggestion/Suggestion';
import ReportGenerator from '../components/ReportGenerator/ReportGenerator';
import JobRecommendations from '../components/JobRecommendations/JobRecommendations';
import CareerSuggestions from '../components/CareerSuggestions/CareerSuggestions';
import CoverLetter from '../components/CoverLetter/CoverLetter';
import MockInterview from '../components/MockInterview/MockInterview';
import KeywordHeatmap from '../components/KeywordHeatmap/KeywordHeatmap';
import './Result.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Result = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData;

  useEffect(() => {
    // Fire confetti if the user has a great ATS score!
    if (analysisData?.atsScore >= 80) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [analysisData]);

  if (!analysisData) {
    return <Navigate to="/" />;
  }

  const {
    atsScore = 0,
    jobMatchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    suggestions = [],
    recommendation = "No recommendation provided.",
    rawResumeText = "",
    rawJobDescription = "",
    recommendedRoles = [],
    careerSuggestions = null,
    coverLetter = "",
    interviewQuestions = []
  } = analysisData;

  return (
    <div className="result-page">
      <motion.div 
        className="result-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h1>Analysis Results</h1>
            <p>Comprehensive breakdown of your resume match.</p>
          </div>
          {analysisData._id && (
            <button 
              className="saas-btn saas-btn-secondary"
              onClick={() => {
                const url = `${window.location.origin}/#/report/${analysisData._id}`;
                navigator.clipboard.writeText(url);
                alert('Public share link copied to clipboard!');
              }}
              style={{ height: '44px' }}
            >
              🔗 Share Analysis
            </button>
          )}
        </div>
      </motion.div>

      <motion.div 
        className="dashboard-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ATS Score & Job Match Score Hero */}
        <motion.div variants={itemVariants} className="score-hero-container">
          <ScoreCard title="ATS Compatibility" score={atsScore} />
          <ScoreCard title="Job Match Score" score={jobMatchScore} />
        </motion.div>

        {/* Skills */}
        <motion.div variants={itemVariants} className="glass-card result-section-card">
          <Skills matched={matchedSkills} missing={missingSkills} />
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div variants={itemVariants} className="two-col-grid">
          <div className="glass-card result-section-card">
            <ResultCard title="Strengths" items={strengths} type="strength" />
          </div>
          <div className="glass-card result-section-card">
            <ResultCard title="Weaknesses" items={weaknesses} type="weakness" />
          </div>
        </motion.div>

        {/* Suggestions & Recommendation */}
        <motion.div variants={itemVariants} className="glass-card result-section-card">
          <Suggestion suggestions={suggestions} recommendation={recommendation} />
        </motion.div>

        {/* New Sections: Job Recommendations & Career Suggestions */}
        {recommendedRoles && recommendedRoles.length > 0 && (
          <motion.div variants={itemVariants} className="result-section-full">
            <JobRecommendations roles={recommendedRoles} />
          </motion.div>
        )}

        {careerSuggestions && (
          <motion.div variants={itemVariants} className="result-section-full">
            <CareerSuggestions careerData={careerSuggestions} />
          </motion.div>
        )}
        
        {/* Mock Interview */}
        {interviewQuestions && interviewQuestions.length > 0 && (
          <motion.div variants={itemVariants} className="result-section-full">
            <MockInterview questions={interviewQuestions} />
          </motion.div>
        )}

        {/* Cover Letter */}
        {coverLetter && (
          <motion.div variants={itemVariants} className="result-section-full">
            <CoverLetter content={coverLetter} />
          </motion.div>
        )}

        {/* Keyword Match Heatmap */}
        {(rawResumeText || rawJobDescription) && (
          <motion.div variants={itemVariants} className="glass-card result-section-card raw-comparison-section no-print">
            <div className="comparison-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <KeywordHeatmap 
                title="Resume Keyword Heatmap" 
                rawText={rawResumeText} 
                matchedSkills={matchedSkills} 
                missingSkills={missingSkills} 
              />
              <KeywordHeatmap 
                title="Job Description Heatmap" 
                rawText={rawJobDescription} 
                matchedSkills={matchedSkills} 
                missingSkills={[]} 
              />
            </div>
          </motion.div>
        )}

        {/* Export Report Section */}
        <motion.div variants={itemVariants} className="glass-card result-section-card">
          <ReportGenerator analysisData={analysisData} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Result;
