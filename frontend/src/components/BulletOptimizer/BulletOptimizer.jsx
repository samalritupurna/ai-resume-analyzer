import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import './BulletOptimizer.css';

const BulletOptimizer = () => {
  const [bullet, setBullet] = useState('');
  const [missingSkills, setMissingSkills] = useState('');
  const [optimizedBullet, setOptimizedBullet] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!bullet.trim()) {
      toast.error('Please enter a bullet point to optimize.');
      return;
    }

    setIsOptimizing(true);
    const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/optimize-bullet` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/optimize-bullet';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bullet, missingSkills })
      });

      if (!response.ok) {
        throw new Error('Failed to optimize bullet.');
      }

      const data = await response.json();
      setOptimizedBullet(data.optimizedBullet);
      toast.success('Bullet point optimized!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedBullet);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="bullet-optimizer-container glass-card">
      <div className="optimizer-header">
        <Sparkles size={24} className="optimizer-icon" />
        <h2>AI Resume Bullet Optimizer</h2>
      </div>
      <p className="optimizer-subtitle">Rewrite your bullet points to be ATS-friendly and seamlessly include missing skills.</p>

      <div className="optimizer-body">
        <div className="input-group">
          <label>Original Bullet Point</label>
          <textarea
            placeholder="e.g., Worked on React project."
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            className="saas-input"
            rows="3"
          />
        </div>

        <div className="input-group">
          <label>Missing Skills (Optional)</label>
          <textarea
            placeholder="e.g., React, Node.js, REST APIs"
            value={missingSkills}
            onChange={(e) => setMissingSkills(e.target.value)}
            className="saas-input"
            rows="2"
          />
        </div>

        <button 
          className={`saas-btn saas-btn-primary optimizer-btn ${isOptimizing ? 'loading' : ''}`}
          onClick={handleOptimize}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <span className="typing-animation">Generating...</span>
          ) : (
            <>
              <Sparkles size={18} /> Rewrite with AI
            </>
          )}
        </button>

        {optimizedBullet && (
          <div className="optimized-result-box">
            <div className="result-header">
              <h3>Improved Bullet</h3>
              <div className="result-actions">
                <button className="icon-btn" onClick={handleCopy} title="Copy">
                  <Copy size={16} />
                </button>
                <button className="icon-btn" onClick={handleOptimize} title="Regenerate">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            <div className="optimized-text">
              {optimizedBullet}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulletOptimizer;
