import React from 'react';
import { motion } from 'framer-motion';
import './CareerSuggestions.css';

const CareerSuggestions = ({ careerData }) => {
  if (!careerData) return null;

  const {
    skillsToImprove,
    certifications,
    technologiesToLearn,
    projectIdeas,
    interviewTopics
  } = careerData;

  const hasData = Object.values(careerData).some(arr => arr && arr.length > 0);
  if (!hasData) return null;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const renderListSection = (title, items, icon) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="career-card glass-card">
        <h3 className="career-card-title">
          <span className="career-icon">{icon}</span> {title}
        </h3>
        <ul className="career-list">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTagSection = (title, items, icon) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="career-card glass-card">
        <h3 className="career-card-title">
          <span className="career-icon">{icon}</span> {title}
        </h3>
        <div className="career-tags">
          {items.map((item, index) => (
            <span key={index} className="career-tag">{item}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="career-suggestions-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className="section-heading">🚀 Career Growth Suggestions</h2>
      
      <div className="career-grid">
        {renderTagSection("Skills to Improve", skillsToImprove, "💪")}
        {renderTagSection("Technologies to Learn", technologiesToLearn, "💻")}
        {renderListSection("Recommended Certifications", certifications, "📜")}
        {renderListSection("Project Ideas", projectIdeas, "🛠️")}
        {renderListSection("Interview Prep Topics", interviewTopics, "🗣️")}
      </div>
    </motion.div>
  );
};

export default CareerSuggestions;
