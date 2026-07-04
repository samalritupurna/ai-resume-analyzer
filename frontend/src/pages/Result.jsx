import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard/ScoreCard';
import Skills from '../components/Skills/Skills';
import ResultCard from '../components/ResultCard/ResultCard';
import Suggestion from '../components/Suggestion/Suggestion';
import './Result.css';

const Result = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData;

  if (!analysisData) {
    return <Navigate to="/" />;
  }

  const {
    atsScore = 0,
    matchPercentage = 0,
    matchedSkills = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    suggestions = [],
    recommendation = "No recommendation provided.",
    rawResumeText = "",
    rawJobDescription = ""
  } = analysisData;

  return (
    <div className="result-page">
      <div className="result-header">
        <h1>Analysis Results</h1>
        <p>Here is how your resume stacks up against the job description.</p>
      </div>

      <div className="dashboard-grid">
        {/* Scores */}
        <div className="scores-row">
          <ScoreCard title="ATS Score" score={atsScore} type="circular" />
          <ScoreCard title="Match Percentage" score={matchPercentage} type="linear" />
        </div>

        {/* Skills */}
        <div className="full-width-card">
          <Skills matched={matchedSkills} missing={missingSkills} />
        </div>

        {/* Strengths & Weaknesses */}
        <div className="two-col-grid">
          <ResultCard title="💪 Strengths" items={strengths} type="strength" />
          <ResultCard title="⚠️ Weaknesses" items={weaknesses} type="weakness" />
        </div>

        {/* Suggestions & Recommendation */}
        <div className="full-width-card">
          <Suggestion suggestions={suggestions} recommendation={recommendation} />
        </div>

        {/* Raw Text Comparison */}
        {(rawResumeText || rawJobDescription) && (
          <div className="full-width-card raw-comparison-section">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
