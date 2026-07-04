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
    <section className="job-description-section">
      <div className="job-desc-container">
        <h2>Job Description</h2>
        <p className="job-desc-subtitle">Paste the job description you are targeting to get customized insights.</p>
        <div className="textarea-wrapper">
          <textarea
            className="job-textarea"
            placeholder="Paste the job description here (e.g., Responsibilities, Requirements, Qualifications...)"
            value={text}
            onChange={handleChange}
          ></textarea>
          <div className={`char-counter ${text.length === maxChars ? 'limit-reached' : ''}`}>
            {text.length} / {maxChars} characters
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDescription;
