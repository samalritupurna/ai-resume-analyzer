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
    careerSuggestions = null
  } = analysisData;

  return (
    <div className="result-page">
      <motion.div 
        className="result-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Analysis Results</h1>
        <p>Comprehensive breakdown of your resume match.</p>
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

        {/* Raw Text Comparison */}
        {(rawResumeText || rawJobDescription) && (
          <motion.div variants={itemVariants} className="glass-card result-section-card raw-comparison-section no-print">
            <h2 className="comparison-title">Text Comparison</h2>
            <p className="comparison-subtitle">This is the raw data that the AI used to evaluate your match.</p>
            <div className="comparison-grid">
              <div className="comparison-card">
                <h3>Extracted Resume Text</h3>
                <div className="raw-text-box">{rawResumeText || "No resume text extracted."}</div>
              </div>
              <div className="comparison-card">
                <h3>Job Description</h3>
                <div className="raw-text-box">{rawJobDescription || "No job description provided."}</div>
              </div>
            </div>
          </motion.div>
        )}

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

        {/* Export Report Section */}
        <motion.div variants={itemVariants} className="glass-card result-section-card">
          <ReportGenerator analysisData={analysisData} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Result;
