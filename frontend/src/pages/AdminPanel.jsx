import React, { useEffect, useState } from 'react';
import { getAdminStatsAPI, getAdminLogsAPI, getAdminUsersAPI, getAllAnalysesAPI, deleteAnalysisAPI, getContactMessagesAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'dashboard') {
        const [statsData, logsData] = await Promise.all([
          getAdminStatsAPI(),
          getAdminLogsAPI()
        ]);
        setStats(statsData);
        setLogs(logsData);
      } else if (activeTab === 'users') {
        const usersData = await getAdminUsersAPI();
        setUsers(usersData);
      } else if (activeTab === 'analyses') {
        const analysesData = await getAllAnalysesAPI();
        setAnalyses(analysesData);
      } else if (activeTab === 'contacts') {
        const contactsData = await getContactMessagesAPI();
        setContacts(contactsData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await deleteAnalysisAPI(id);
        // Refresh the list
        setAnalyses(analyses.filter(a => a._id !== id));
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const sortedAnalyses = [...analyses].sort((a, b) => {
    const scoreA = a.jobMatchScore || 0;
    const scoreB = b.jobMatchScore || 0;
    return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
  });

  const renderDashboard = () => (
    <>
      <h1 className="admin-section-title">Dashboard</h1>
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

      <div className="admin-logs-header">
        <h2>Recent Activity Logs</h2>
      </div>
      
      {logs.length === 0 ? (
        <p className="admin-empty">No activity logs found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>ATS Score</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.user?.name || 'Unknown'}</td>
                  <td className={`score-cell ${log.atsScore >= 80 ? 'high' : log.atsScore >= 60 ? 'medium' : 'low'}`}>
                    {log.atsScore}%
                  </td>
                  <td className={`score-cell ${log.jobMatchScore >= 80 ? 'high' : log.jobMatchScore >= 60 ? 'medium' : 'low'}`}>
                    {log.jobMatchScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const renderUsers = () => (
    <>
      <h1 className="admin-section-title">Registered Users</h1>
      {users.length === 0 ? (
        <p className="admin-empty">No users found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="score-cell high">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const renderAnalyses = () => (
    <>
      <div className="admin-logs-header">
        <h1 className="admin-section-title" style={{marginBottom: 0}}>Resume Analyses</h1>
        <div className="admin-sort-control">
          <label htmlFor="sortOrder">Sort by Match:</label>
          <select 
            id="sortOrder" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="admin-select"
          >
            <option value="desc">Descending (Highest First)</option>
            <option value="asc">Ascending (Lowest First)</option>
          </select>
        </div>
      </div>
      
      {sortedAnalyses.length === 0 ? (
        <p className="admin-empty">No analyses found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>ATS Score</th>
                <th>Match</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAnalyses.map((analysis) => (
                <tr key={analysis._id}>
                  <td>{new Date(analysis.createdAt).toLocaleString()}</td>
                  <td>{analysis.user?.name || 'Unknown'}</td>
                  <td>{analysis.user?.email || 'N/A'}</td>
                  <td className={`score-cell ${analysis.atsScore >= 80 ? 'high' : analysis.atsScore >= 60 ? 'medium' : 'low'}`}>
                    {analysis.atsScore}%
                  </td>
                  <td className={`score-cell ${analysis.jobMatchScore >= 80 ? 'high' : analysis.jobMatchScore >= 60 ? 'medium' : 'low'}`}>
                    {analysis.jobMatchScore}%
                  </td>
                  <td>
                    <button className="action-btn">View Details</button>
                    <button className="action-btn delete" onClick={() => handleDeleteAnalysis(analysis._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const renderContacts = () => (
    <>
      <h1 className="admin-section-title">Contact Messages</h1>
      {contacts.length === 0 ? (
        <p className="admin-empty">No contact messages found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((msg) => (
                <tr key={msg._id}>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Panel</div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'analyses' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyses')}
          >
            📄 Analyses
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            ✉️ Contact Messages
          </button>
        </nav>
      </aside>
      
      <main className="admin-main-content">
        {loading && (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="admin-error">
            <h3>Access Denied</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'analyses' && renderAnalyses()}
            {activeTab === 'contacts' && renderContacts()}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
