import React, { useState } from 'react';
import { getResumesAPI, analyzeMultipleResumesAPI } from '../services/resumeApi';
import { toast } from 'sonner';

const ResumeRecommendation = () => {
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDesc) return toast.error("Please enter a job description");
    
    setLoading(true);
    try {
      // First fetch all user resumes
      const resumes = await getResumesAPI();
      if (resumes.length === 0) {
        toast.error("You don't have any saved resumes. Please create one first.");
        setLoading(false);
        return;
      }

      const resumeIds = resumes.map(r => r._id);
      const data = await analyzeMultipleResumesAPI(resumeIds, jobDesc);
      setResults(data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.message || "Failed to analyze resumes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>AI Resume <span className="gradient-text">Recommendation</span></h1>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px' }}>Paste a job description below and we will analyze all your saved resumes to recommend the best match.</p>
      
      <div className="glass-card" style={{ marginBottom: '40px' }}>
        <textarea 
          placeholder="Paste the Job Description here..." 
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', color: 'white', fontFamily: 'inherit', resize: 'vertical', marginBottom: '20px' }}
        />
        <button className="saas-btn" onClick={handleAnalyze} disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Analyzing All Resumes...' : 'Find Best Resume'}
        </button>
      </div>

      {results && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Explanation Card spanning full width */}
          <div className="glass-card" style={{ gridColumn: '1 / -1', border: '1px solid #F59E0B' }}>
            <h3 style={{ color: '#F59E0B', margin: '0 0 16px 0' }}>AI Recommendation</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--text-body)', margin: 0 }}>{results.explanation}</pre>
          </div>

          {/* Result Cards */}
          {results.results.map((res) => (
            <div key={res.resumeId} className="glass-card" style={{ border: res.resumeId === results.recommendedId ? '2px solid #F59E0B' : '', position: 'relative' }}>
              {res.resumeId === results.recommendedId && (
                <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#F59E0B', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Best Match
                </div>
              )}
              <h3 style={{ marginBottom: '8px' }}>{res.resumeName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{res.targetRole}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>ATS Score:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{res.atsScore}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Keyword Match:</span>
                <span style={{ color: 'var(--success)' }}>{res.jobMatchScore}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeRecommendation;
