import React from 'react';
import './Suggestion.css';

const Suggestion = ({ suggestions, recommendation }) => {
  return (
    <div className="suggestion-container">
      <div className="recommendation-box">
        <h3>💡 Final Recommendation</h3>
        <p>{recommendation}</p>
      </div>
      <div className="suggestions-box">
        <h3>Actionable Suggestions</h3>
        <ul className="suggestion-list">
          {suggestions.map((sug, index) => (
            <li key={index} className="suggestion-item">
              <span className="arrow">→</span> {sug}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Suggestion;
