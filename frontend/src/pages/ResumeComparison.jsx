import React, { useEffect, useState } from 'react';
import { getResumesAPI } from '../services/resumeApi';
import { Link } from 'react-router-dom';
import { CheckSquare, Square, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const ResumeComparison = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const data = await getResumesAPI();
        setResumes(data);
      } catch (err) {
        toast.error("Failed to load resumes.");
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selId => selId !== id));
    } else {
      if (selectedIds.length >= 3) {
        return toast.error("You can only compare up to 3 resumes at a time.");
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) {
      return toast.error("Please select at least 2 resumes to compare.");
    }
    setIsComparing(true);
  };

  const selectedResumes = resumes.filter(r => selectedIds.includes(r._id));

  if (loading) {
    return <div className="page-container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading resumes...</div>;
  }

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Resume <span className="gradient-text">Comparison</span></h1>
        {isComparing && (
          <button onClick={() => setIsComparing(false)} className="saas-btn saas-btn-secondary" style={{ padding: '8px 16px' }}>
            Back to Selection
          </button>
        )}
      </div>

      {resumes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No resumes found</h3>
          <p style={{ marginBottom: '20px' }}>You haven't uploaded any resumes yet. Go to the Resumes dashboard to add one.</p>
          <Link to="/resumes" className="saas-btn">Go to Resumes Dashboard</Link>
        </div>
      ) : !isComparing ? (
        <div className="selection-view">
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Select up to 3 resumes to compare their raw content side-by-side.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            {resumes.map(resume => (
              <div 
                key={resume._id} 
                className="glass-card" 
                onClick={() => toggleSelect(resume._id)}
                style={{ 
                  cursor: 'pointer', 
                  border: selectedIds.includes(resume._id) ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={24} color="var(--primary)" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{resume.resumeName}</h3>
                  </div>
                  {selectedIds.includes(resume._id) ? <CheckSquare color="var(--primary)" /> : <Square color="var(--text-muted)" />}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0' }}>Role: {resume.targetRole}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          
          <button 
            className="saas-btn" 
            onClick={handleCompare}
            disabled={selectedIds.length < 2}
            style={{ opacity: selectedIds.length < 2 ? 0.5 : 1, width: '100%', maxWidth: '300px', display: 'block', margin: '0 auto' }}
          >
            Compare Selected ({selectedIds.length})
          </button>
        </div>
      ) : (
        <div className="comparison-view">
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedResumes.length}, 1fr)`, gap: '20px' }}>
            {selectedResumes.map(resume => (
              <div key={resume._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px', color: 'var(--primary)' }}>
                  {resume.resumeName}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span>{resume.targetRole}</span>
                  <span>v{resume.versionNumber}</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {resume.rawText || "No content extracted."}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeComparison;
