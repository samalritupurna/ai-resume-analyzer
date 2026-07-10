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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Explanation Card */}
          <div className="glass-card" style={{ border: '1px solid #F59E0B' }}>
            <h3 style={{ color: '#F59E0B', margin: '0 0 16px 0' }}>AI Recommendation</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--text-body)', margin: 0 }}>{results.explanation}</pre>
          </div>

          {/* Detailed Comparison Table */}
          <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '16px' }}>Rank</th>
                  <th style={{ padding: '16px' }}>Resume Name</th>
                  <th style={{ padding: '16px' }}>ATS Score</th>
                  <th style={{ padding: '16px' }}>Match %</th>
                  <th style={{ padding: '16px' }}>Top Strengths</th>
                  <th style={{ padding: '16px' }}>Missing Keywords</th>
                </tr>
              </thead>
              <tbody>
                {results.results.map((res, index) => (
                  <tr key={res.resumeId} style={{ borderBottom: '1px solid var(--border-color)', background: res.resumeId === results.recommendedId ? 'rgba(245, 158, 11, 0.1)' : 'transparent', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      {res.resumeId === results.recommendedId ? (
                        <span style={{ background: '#F59E0B', color: '#000', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>#1 Match</span>
                      ) : (
                        <span style={{ padding: '4px 10px', color: 'var(--text-muted)', fontWeight: 'bold' }}>#{index + 1}</span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: res.resumeId === results.recommendedId ? '#F59E0B' : 'white' }}>{res.resumeName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{res.targetRole}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{res.atsScore}%</td>
                    <td style={{ padding: '16px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>{res.jobMatchScore}%</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', maxWidth: '250px' }}>
                      <ul style={{ paddingLeft: '16px', margin: 0, color: 'var(--text-body)' }}>
                        {res.strengths?.slice(0, 2).map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>) || <li>N/A</li>}
                      </ul>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#ef4444', maxWidth: '200px', lineHeight: '1.5' }}>
                      {(res.missingSkills || res.missingKeywords || []).slice(0, 4).join(', ') || 'None found'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeRecommendation;
