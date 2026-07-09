import React from 'react';
import './KeywordHeatmap.css';

const KeywordHeatmap = ({ rawText, matchedSkills = [], missingSkills = [], title = "Keyword Match Heatmap" }) => {
  if (!rawText) return null;

  // Create a mapping of words to their highlight type
  const wordMap = new Map();
  
  matchedSkills.forEach(skill => {
    wordMap.set(skill.toLowerCase(), { type: 'matched', title: `Matched: ${skill}` });
  });
  
  missingSkills.forEach(skill => {
    wordMap.set(skill.toLowerCase(), { type: 'missing', title: `Missing: ${skill}` });
  });

  // Tokenize the text roughly by words and punctuation, preserving spaces
  const tokens = rawText.split(/(\s+|\b)/);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h3>{title}</h3>
        <div className="heatmap-legend">
          <span className="legend-item"><span className="legend-dot matched"></span> Matched</span>
          <span className="legend-item"><span className="legend-dot missing"></span> Missing</span>
          <span className="legend-item"><span className="legend-dot suggested"></span> Suggested</span>
        </div>
      </div>
      
      <div className="heatmap-content">
        {tokens.map((token, index) => {
          const lowerToken = token.toLowerCase().replace(/[^a-z0-9]/g, '');
          const match = wordMap.get(lowerToken);

          if (match && lowerToken.length > 2) {
            return (
              <mark 
                key={index} 
                className={`heatmap-mark ${match.type}`}
                title={match.title}
              >
                {token}
              </mark>
            );
          }
          
          return <span key={index}>{token}</span>;
        })}
      </div>
      
      {/* We append missing skills visually at the bottom to represent gaps in the resume text */}
      {title.includes('Resume') && missingSkills.length > 0 && (
        <div className="heatmap-gaps">
          <h4>Detected Gaps</h4>
          <p>The following keywords were completely absent from this document:</p>
          <div className="gap-badges">
            {missingSkills.map((skill, i) => (
              <span key={i} className="heatmap-mark missing" title={`Missing: ${skill}`}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordHeatmap;
