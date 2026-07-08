import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getSharedAnalysisAPI } from '../services/api';
import ScoreCard from '../components/ScoreCard/ScoreCard';
import Skills from '../components/Skills/Skills';
import ResultCard from '../components/ResultCard/ResultCard';
import Suggestion from '../components/Suggestion/Suggestion';
import JobRecommendations from '../components/JobRecommendations/JobRecommendations';
import CareerSuggestions from '../components/CareerSuggestions/CareerSuggestions';
import CoverLetter from '../components/CoverLetter/CoverLetter';
import MockInterview from '../components/MockInterview/MockInterview';
import './Result.css'; // Re-use the exact same styling

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const SharedReport = () => {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedAnalysis = async () => {
      try {
        const data = await getSharedAnalysisAPI(id);
        setAnalysisData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch shared analysis", err);
        setError("This report could not be found or has been removed.");
        setLoading(false);
      }
    };
    if (id) fetchSharedAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#fff' }}>
        <Loader2 className="btn-spinner" size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem', color: '#3b82f6' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <h2>Loading Shared Report...</h2>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#fca5a5' }}>
        <h2>{error || "Report not found"}</h2>
      </div>
    );
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
      <motion.div className="result-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1>Shared Analysis Report</h1>
        <p>A comprehensive breakdown of this resume match.</p>
      </motion.div>

      <motion.div className="dashboard-grid" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="score-hero-container">
          <ScoreCard title="ATS Compatibility" score={atsScore} />
          <ScoreCard title="Job Match Score" score={jobMatchScore} />
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card result-section-card">
          <Skills matched={matchedSkills} missing={missingSkills} />
        </motion.div>

        <motion.div variants={itemVariants} className="two-col-grid">
          <div className="glass-card result-section-card">
            <ResultCard title="Strengths" items={strengths} type="strength" />
          </div>
          <div className="glass-card result-section-card">
            <ResultCard title="Weaknesses" items={weaknesses} type="weakness" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card result-section-card">
          <Suggestion suggestions={suggestions} recommendation={recommendation} />
        </motion.div>

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
        
        {interviewQuestions && interviewQuestions.length > 0 && (
          <motion.div variants={itemVariants} className="result-section-full">
            <MockInterview questions={interviewQuestions} />
          </motion.div>
        )}

        {coverLetter && (
          <motion.div variants={itemVariants} className="result-section-full">
            <CoverLetter content={coverLetter} />
          </motion.div>
        )}

        {(rawResumeText || rawJobDescription) && (
          <motion.div variants={itemVariants} className="glass-card result-section-card raw-comparison-section no-print">
            <h2 className="comparison-title">Text Comparison</h2>
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
      </motion.div>
    </div>
  );
};

export default SharedReport;
