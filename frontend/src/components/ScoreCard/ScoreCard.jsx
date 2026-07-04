import React from 'react';
import './ScoreCard.css';

const ScoreCard = ({ title, score, type = "circular" }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545';

  return (
    <div className="score-card">
      <h3 className="score-card-title">{title}</h3>
      <div className="score-indicator">
        {type === "circular" ? (
          <div className="circular-progress">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} className="circle-bg" />
              <circle 
                cx="60" cy="60" r={radius} 
                className="circle-progress" 
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  stroke: color
                }}
              />
            </svg>
            <div className="score-value" style={{ color }}>{score}%</div>
          </div>
        ) : (
          <div className="linear-progress">
            <div className="linear-bg">
              <div 
                className="linear-fill" 
                style={{ width: `${score}%`, backgroundColor: color }}
              ></div>
            </div>
            <div className="linear-value" style={{ color }}>{score}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
