import React from 'react';
import './ResultCard.css';

const ResultCard = ({ title, items, type }) => {
  return (
    <div className={`result-card ${type}`}>
      <h3 className="result-card-title">{title}</h3>
      <ul className="result-list">
        {items.map((item, index) => (
          <li key={index} className="result-item">
            <span className={`bullet ${type}`}></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultCard;
