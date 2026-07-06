import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
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
    e.target.value = '';
  };

  const onBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFile = (uploadedFile) => {
    if (uploadedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(uploadedFile.type) || uploadedFile.name.endsWith('.pdf') || uploadedFile.name.endsWith('.docx')) {
        setFile(uploadedFile);
        toast.success('Resume attached successfully!');
      } else {
        toast.error('Invalid file format. Please upload a PDF or DOCX file.');
      }
    }
  };

  return (
    <div className="glass-card upload-card">
      <div 
        className={`drop-zone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!file ? onBrowseClick : undefined}
      >
        {!file ? (
          <>
            <div className="upload-icon-wrapper">
              <UploadCloud size={48} strokeWidth={1.5} className="upload-icon" />
            </div>
            <p className="upload-text">
              Drop your resume here<br />or <span className="browse-link">click to browse</span>
            </p>
            <p className="upload-hint">Supported: PDF, DOCX</p>
          </>
        ) : (
          <div className="file-success-state">
            <CheckCircle2 size={48} className="success-icon" />
            <h3 className="success-text">Resume Uploaded</h3>
            <p className="file-name">{file.name}</p>
            <button className="remove-btn" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
              <X size={16} /> Remove
            </button>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ResumeUpload;
