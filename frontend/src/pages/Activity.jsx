import React, { useEffect, useState } from 'react';
import { getAnalysisHistoryAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  // Prepare chart data by reversing history so oldest is first
  const chartData = [...history].reverse().map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    ATS_Score: item.atsScore,
    Job_Match: item.jobMatchScore
  }));

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
        <>
          {history.length > 1 && (
            <div className="activity-chart-container glass-card">
              <h2>Progress Overview</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#a0aec0" tick={{ fill: '#a0aec0', fontSize: 13 }} />
                    <YAxis stroke="#a0aec0" domain={[0, 100]} tick={{ fill: '#a0aec0', fontSize: 13 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                      itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}
                      labelStyle={{ color: '#a0aec0', marginBottom: '8px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="ATS_Score" name="ATS Score" stroke="#48bb78" strokeWidth={4} dot={{ r: 4, fill: '#48bb78', strokeWidth: 0 }} activeDot={{ r: 8, fill: '#48bb78', stroke: 'rgba(72,187,120,0.3)', strokeWidth: 6 }} />
                    <Line type="monotone" dataKey="Job_Match" name="Job Match" stroke="#ecc94b" strokeWidth={4} dot={{ r: 4, fill: '#ecc94b', strokeWidth: 0 }} activeDot={{ r: 8, fill: '#ecc94b', stroke: 'rgba(236,201,75,0.3)', strokeWidth: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

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
        </>
      )}
    </div>
  );
};

export default Activity;
