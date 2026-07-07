import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ScoreCard.css';

const ScoreCard = ({ title, score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  // 200px size means radius 90 (to allow for stroke width)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';

  // Counting animation
  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1 second
    const increment = score / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="glass-card score-hero-card">
      <h2 className="score-title">{title}</h2>
      <div className="score-circle-container">
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <circle 
            cx="100" cy="100" r={radius} 
            className="circle-bg" 
          />
          <motion.circle 
            cx="100" cy="100" r={radius} 
            className="circle-progress" 
            style={{
              strokeDasharray: circumference,
              stroke: color,
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="score-value-overlay">
          <span className="score-number" style={{ color }}>{displayScore}</span>
          <span className="score-percent">%</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
