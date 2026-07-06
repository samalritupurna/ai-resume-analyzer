import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './ResultCard.css';

const ResultCard = ({ title, items, type }) => {
  const Icon = type === 'strength' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`result-card-inner ${type}`}>
      <h3 className="result-card-title">
        <Icon size={20} className="title-icon" />
        {title}
      </h3>
      <ul className="result-list">
        {items.map((item, index) => (
          <li key={index} className="result-item">
            <span className="bullet-dot"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultCard;
