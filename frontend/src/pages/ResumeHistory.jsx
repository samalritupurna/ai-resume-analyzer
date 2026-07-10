import React, { useEffect, useState } from 'react';
import { getAnalysisHistoryAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { Clock, Eye, FileText } from 'lucide-react';
import '../pages/Auth.css'; // Reuse glass-card styles

const ResumeHistory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAnalysisHistoryAPI();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Resume <span className="gradient-text">History</span></h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>Loading timeline...</div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No history found</h3>
          <p>Start interacting with your resumes to build a timeline.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid rgba(139, 92, 246, 0.3)' }}>
          {events.map((event) => (
            <div key={event._id} style={{ position: 'relative', marginBottom: '32px' }}>
              <div style={{ position: 'absolute', left: '-36px', top: '0', background: 'var(--bg-color)', border: '2px solid var(--primary)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={12} color="var(--primary)" />
              </div>
              <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--primary)" /> 
                    Resume Analysis
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Analyzed on {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString()}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#48bb78' }}>ATS Score: <strong>{event.atsScore}%</strong></span>
                    <span style={{ color: '#ecc94b' }}>Job Match: <strong>{event.jobMatchScore}%</strong></span>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <Link to={`/report/${event._id}`} className="saas-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', height: 'auto', fontSize: '0.9rem' }}>
                    <Eye size={16} /> View Full Report
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeHistory;
