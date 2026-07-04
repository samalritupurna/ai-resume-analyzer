import React from 'react';
import './Skills.css';

const Skills = ({ matched, missing }) => {
  return (
    <div className="skills-container">
      <div className="skills-section matched">
        <h3 className="skills-title">Matched Skills</h3>
        <div className="skills-list">
          {matched.map((skill, index) => (
            <span key={index} className="skill-pill matched-pill">
              <span className="skill-icon">✓</span> {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="skills-section missing">
        <h3 className="skills-title">Missing Skills</h3>
        <div className="skills-list">
          {missing.map((skill, index) => (
            <span key={index} className="skill-pill missing-pill">
              <span className="skill-icon">✕</span> {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
