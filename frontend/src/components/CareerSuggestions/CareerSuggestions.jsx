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

  const getLearningLink = (skill) => {
    const s = skill.toLowerCase();
    if (s.includes('java') && !s.includes('javascript')) return 'https://www.geeksforgeeks.org/java/';
    if (s.includes('python')) return 'https://docs.python.org/3/';
    if (s.includes('react')) return 'https://react.dev/';
    if (s.includes('sql') || s.includes('database')) return 'https://www.w3schools.com/sql/';
    if (s.includes('javascript') || s.includes('js')) return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';
    if (s.includes('node')) return 'https://nodejs.org/en/docs/';
    if (s.includes('html') || s.includes('css')) return 'https://developer.mozilla.org/en-US/';
    if (s.includes('c++') || s.includes('cpp')) return 'https://cplusplus.com/doc/tutorial/';
    if (s.includes('c#') || s.includes('csharp')) return 'https://learn.microsoft.com/en-us/dotnet/csharp/';
    if (s.includes('aws') || s.includes('cloud')) return 'https://aws.amazon.com/training/';
    if (s.includes('azure')) return 'https://learn.microsoft.com/en-us/azure/';
    return `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`; // Trusted general fallback
  };

  const renderTagSection = (title, items, icon, showLearnLink = false) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="career-card glass-card">
        <h3 className="career-card-title">
          <span className="career-icon">{icon}</span> {title}
        </h3>
        <div className="career-tags">
          {items.map((item, index) => (
            <span key={index} className="career-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {item}
              {showLearnLink && (
                <a 
                  href={getLearningLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}
                >
                  Learn Free
                </a>
              )}
            </span>
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
        {renderTagSection("Skills to Improve", skillsToImprove, "💪", true)}
        {renderTagSection("Technologies to Learn", technologiesToLearn, "💻", false)}
        {renderListSection("Recommended Certifications", certifications, "📜")}
        {renderListSection("Project Ideas", projectIdeas, "🛠️")}
        {renderListSection("Interview Prep Topics", interviewTopics, "🗣️")}
      </div>
    </motion.div>
  );
};

export default CareerSuggestions;
