import React, { useEffect, useState, useRef } from 'react';
import { getResumesAPI, createResumeAPI } from '../services/resumeApi';
import { Link } from 'react-router-dom';
import { FileText, Star, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import './Auth.css'; // Reusing some base styles

const ResumeVersions = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumesAPI();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload.");
    if (!resumeName) return toast.error("Please enter a name for this resume.");
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('resumeName', resumeName);
      formData.append('targetRole', targetRole || 'General');

      await createResumeAPI(formData);
      toast.success("Resume uploaded successfully!");
      setShowModal(false);
      setFile(null);
      setResumeName('');
      setTargetRole('');
      fetchResumes();
    } catch (err) {
      toast.error(err.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
      
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Upload New Resume</h2>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Resume File (PDF/Doc)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Resume Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Engineer Tech Resume" 
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Target Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Developer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} 
                />
              </div>
              <button type="submit" className="saas-btn" disabled={uploading} style={{ marginTop: '10px' }}>
                {uploading ? 'Uploading...' : 'Save Resume'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Resume <span className="gradient-text">Versions</span></h1>
        <button onClick={() => setShowModal(true)} className="saas-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={18} /> Add Resume
        </button>
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
