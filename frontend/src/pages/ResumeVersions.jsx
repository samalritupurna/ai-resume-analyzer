import React, { useEffect, useState } from 'react';
import { getResumesAPI } from '../services/resumeApi';
import { Link } from 'react-router-dom';
import { FileText, Star, Plus } from 'lucide-react';
import './Auth.css'; // Reusing some base styles

const ResumeVersions = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumesAPI();
        setResumes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Resume <span className="gradient-text">Versions</span></h1>
        <button className="saas-btn"><Plus size={18} /> Add Resume</button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No resumes found</h3>
          <p>You haven't uploaded any resumes yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {resumes.map((resume, index) => (
            <div key={resume._id} className="glass-card" style={{ position: 'relative', border: index === 0 ? '1px solid #F59E0B' : '' }}>
              {index === 0 && (
                <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#F59E0B', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} /> Recommended
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{resume.resumeName}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{resume.targetRole}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                <span>Version {resume.versionNumber}</span>
                <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/recommend" className="saas-btn" style={{ flex: 1, height: '40px', fontSize: '0.9rem' }}>Analyze</Link>
                <Link to="/compare" className="saas-btn saas-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '0.9rem', background: 'transparent' }}>Compare</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeVersions;
