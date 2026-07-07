import React, { useEffect, useState } from 'react';
import { getAnalysisHistoryAPI } from '../services/api';
import './Activity.css';

const Activity = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAnalysisHistoryAPI();
        setHistory(data);
      } catch (err) {
        if (err.message.toLowerCase().includes('token') || err.message.toLowerCase().includes('authorized')) {
          setError('Your session has expired. Please click Logout in the top right, and log back in.');
        } else {
          setError(err.message || 'Failed to load activity history.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div className="activity-container">
      <h1 className="activity-title">Your Activity History</h1>
      <p className="activity-subtitle">Review your past resume analyses</p>
      
      {loading ? (
        <div className="activity-loading">
          <div className="spinner"></div>
          <p>Loading your history...</p>
        </div>
      ) : error ? (
        <div className="activity-error">{error}</div>
      ) : history.length === 0 ? (
        <div className="activity-empty">
          <p>You haven't run any analyses yet.</p>
        </div>
      ) : (
        <div className="activity-grid">
          {history.map((item) => (
            <div key={item._id} className="activity-card">
              <div className="activity-card-header">
                <span className="activity-date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="activity-scores">
                <div className="score-item">
                  <span className="score-label">ATS Score</span>
                  <span className={`score-value ${item.atsScore >= 80 ? 'high' : item.atsScore >= 60 ? 'medium' : 'low'}`}>
                    {item.atsScore}%
                  </span>
                </div>
                <div className="score-item">
                  <span className="score-label">Job Match</span>
                  <span className={`score-value ${item.jobMatchScore >= 80 ? 'high' : item.jobMatchScore >= 60 ? 'medium' : 'low'}`}>
                    {item.jobMatchScore}%
                  </span>
                </div>
              </div>
              <div className="activity-recommendation">
                <p>{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
