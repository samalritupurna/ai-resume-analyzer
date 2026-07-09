import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './ScoreCard.css';

const ScoreCard = ({ title, score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  let color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = score / (duration / 16);

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
      <div className="speedometer-container">
        <CircularProgressbar
          value={displayScore}
          text={`${displayScore}%`}
          circleRatio={0.75} /* 270 degree arc for a true speedometer look */
          styles={buildStyles({
            rotation: 1 / 8 + 0.5, // Rotate to start at bottom left
            strokeLinecap: 'round',
            pathTransitionDuration: 0.1,
            pathColor: color,
            textColor: color,
            trailColor: 'rgba(255, 255, 255, 0.1)',
            textSize: '24px',
          })}
        />
      </div>
    </div>
  );
};

export default ScoreCard;
