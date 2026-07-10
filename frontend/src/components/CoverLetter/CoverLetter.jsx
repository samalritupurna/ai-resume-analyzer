import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, CheckCircle, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import './CoverLetter.css';

const CoverLetter = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!content) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cover_letter.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    // Split text to fit width (A4 size is approx 210mm wide, subtract 30mm for margins)
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 15, 20);
    doc.save('cover_letter.pdf');
  };

  const handleReveal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRevealed(true);
    }, 1200); // Simulate generation time
  };

  return (
    <div className="cover-letter-section">
      <div className="cover-letter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-heading" style={{ margin: 0 }}>✍️ AI Cover Letter</h2>
        {isRevealed && (
          <div className="cover-letter-actions">
            <button onClick={handleCopy} className="action-btn" title="Copy to clipboard">
              {copied ? <CheckCircle size={18} color="#48bb78" /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button onClick={handleDownloadTxt} className="action-btn" title="Download as TXT">
              <FileText size={18} />
              <span>TXT</span>
            </button>
            <button onClick={handleDownloadPdf} className="action-btn" title="Download as PDF">
              <Download size={18} />
              <span>PDF</span>
            </button>
          </div>
        )}
      </div>
      
      {!isRevealed ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', marginTop: '20px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Our AI has prepared a highly personalized cover letter based on your matched skills and experience.</p>
          <button 
            onClick={handleReveal} 
            className="saas-btn"
            disabled={isLoading}
            style={{ minWidth: '220px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {isLoading ? <Loader2 size={18} className="spin" /> : <FileText size={18} />}
            {isLoading ? 'Generating...' : 'Generate AI Cover Letter'}
          </button>
        </div>
      ) : (
        <motion.div 
          className="cover-letter-content glass-card"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: '20px' }}
        >
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{content}</pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CoverLetter;
