import React from 'react';
import { motion } from 'framer-motion';
import './JobRecommendations.css';

const JobRecommendations = ({ roles }) => {
  if (!roles || roles.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const getMatchClass = (score) => {
    if (score >= 85) return 'match-excellent';
    if (score >= 70) return 'match-good';
    return 'match-needs-improvement';
  };

  return (
    <div className="job-recommendations-section">
      <h2 className="section-heading">🎯 Recommended Job Roles</h2>
      <motion.div 
        className="roles-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {roles.map((role, index) => (
          <motion.div key={index} variants={itemVariants} className="role-card glass-card">
            <div className="role-header">
              <h3 className="role-title">{role.role}</h3>
              <div className={`role-match-badge ${getMatchClass(role.matchPercentage)}`}>
                Match: {role.matchPercentage}%
              </div>
            </div>
            
            <div className="role-details">
              <div className="detail-row">
                <span className="detail-label">Why it matches:</span>
                <ul className="match-reasons">
                  {role.matchReasons?.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>

              {role.missingSkills && role.missingSkills.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Missing Skills:</span>
                  <div className="missing-skills-tags">
                    {role.missingSkills.map((skill, i) => (
                      <span key={i} className="skill-tag missing">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="role-footer">
                <div className="footer-item">
                  <span className="footer-icon">📊</span>
                  <span className="footer-text">Difficulty: {role.difficultyLevel}</span>
                </div>
                <div className="footer-item">
                  <span className="footer-icon">📈</span>
                  <span className="footer-text">Hiring Potential: {role.hiringPotential}</span>
                </div>
              </div>

              <div className="job-search-actions">
                <a 
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role.role)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="search-btn linkedin-btn"
                >
                  Search on LinkedIn
                </a>
                <a 
                  href={`https://www.naukri.com/${role.role.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-jobs`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="search-btn naukri-btn"
                >
                  Search on Naukri
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default JobRecommendations;
