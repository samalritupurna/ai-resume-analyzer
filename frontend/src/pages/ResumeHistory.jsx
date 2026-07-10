import React, { useEffect, useState } from 'react';
import { getHistoryEventsAPI } from '../services/resumeApi';
import { Clock } from 'lucide-react';

const ResumeHistory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getHistoryEventsAPI();
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
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{event.title}</h3>
                <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>{event.description}</p>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(event.createdAt).toLocaleString()}
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
