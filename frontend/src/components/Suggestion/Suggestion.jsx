import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import './Suggestion.css';

const Suggestion = ({ suggestions, recommendation }) => {
  return (
    <div className="suggestion-container">
      <div className="recommendation-box">
        <h3>
          <Lightbulb size={20} className="title-icon" />
          Final Recommendation
        </h3>
        <p>{recommendation}</p>
      </div>
      <div className="suggestions-box">
        <h3>Actionable Suggestions</h3>
        <ul className="suggestion-list">
          {suggestions.map((sug, index) => (
            <li key={index} className="suggestion-item">
              <ArrowRight size={16} className="arrow-icon" />
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Suggestion;
