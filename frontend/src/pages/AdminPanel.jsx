import React, { useEffect, useState } from 'react';
import { getAdminStatsAPI, getAdminLogsAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, logsData] = await Promise.all([
          getAdminStatsAPI(),
          getAdminLogsAPI()
        ]);
        setStats(statsData);
        setLogs(logsData);
      } catch (err) {
        setError(err.message || 'Failed to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <h3>Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">Global platform statistics and logs</p>
      
      {/* Stats Section */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.totalUsers || 0}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>Total Analyses</h3>
            <p className="stat-value">{stats?.totalAnalyses || 0}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>Avg ATS Score</h3>
            <p className="stat-value">{stats?.avgAtsScore || 0}%</p>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="admin-logs-section">
        <h2>Global Activity Logs</h2>
        {logs.length === 0 ? (
          <p className="admin-empty">No activity logs found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>ATS Score</th>
                  <th>Match</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>{log.user?.name || 'Unknown'}</td>
                    <td>{log.user?.email || 'N/A'}</td>
                    <td className={`score-cell ${log.atsScore >= 80 ? 'high' : log.atsScore >= 60 ? 'medium' : 'low'}`}>
                      {log.atsScore}%
                    </td>
                    <td className={`score-cell ${log.jobMatchScore >= 80 ? 'high' : log.jobMatchScore >= 60 ? 'medium' : 'low'}`}>
                      {log.jobMatchScore}%
                    </td>
                    <td className="recommendation-cell" title={log.recommendation}>
                      {log.recommendation?.substring(0, 40)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
