import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, CheckCircle } from 'lucide-react';
import './CoverLetter.css';

const CoverLetter = ({ content }) => {
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cover_letter.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="cover-letter-section">
      <div className="cover-letter-header">
        <h2 className="section-heading">✍️ AI Cover Letter</h2>
        <div className="cover-letter-actions">
          <button onClick={handleCopy} className="action-btn" title="Copy to clipboard">
            {copied ? <CheckCircle size={18} color="#48bb78" /> : <Copy size={18} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button onClick={handleDownload} className="action-btn" title="Download as TXT">
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>
      
      <motion.div 
        className="cover-letter-content glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <pre>{content}</pre>
      </motion.div>
    </div>
  );
};

export default CoverLetter;
