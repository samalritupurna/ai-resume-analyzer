import React, { useState, useRef } from 'react';
import './ResumeUpload.css';

const ResumeUpload = ({ file, setFile }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
    // Clear the input value so the browser allows selecting the exact same file again
    e.target.value = '';
  };

  const onBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFile = (uploadedFile) => {
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return (
    <section className="resume-upload-section">
      <div className="upload-container">
        <h2>Upload Your Resume</h2>
        <div 
          className={`drop-zone ${isDragActive ? 'active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={onBrowseClick}
        >
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#486581" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className="upload-text">
            Drag & Drop your resume here, or <span className="browse-link">browse</span>
          </p>
          <p className="upload-hint">Supported formats: PDF, DOCX</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          style={{ display: 'none' }}
        />

        {file && (
          <div className="file-display">
            <div className="file-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              <span className="file-name">{file.name}</span>
            </div>
            <button className="remove-btn" onClick={() => setFile(null)}>Remove</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeUpload;
