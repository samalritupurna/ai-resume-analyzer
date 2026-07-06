import React from 'react';
import './JobDescription.css';

const JobDescription = ({ text, setText }) => {
  const maxChars = 5000;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxChars) {
      setText(inputValue);
    }
  };

  return (
    <div className="glass-card job-desc-card">
      <div className="textarea-wrapper">
        <textarea
          className="job-textarea"
          placeholder="Paste the complete job description..."
          value={text}
          onChange={handleChange}
        ></textarea>
        <div className={`char-counter ${text.length === maxChars ? 'limit-reached' : ''}`}>
          {text.length} / {maxChars}
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
