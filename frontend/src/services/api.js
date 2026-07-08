export const analyzeResumeAPI = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  // Use the live Render backend URL or local
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/analyze` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/analyze';

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error || 'Failed to analyze resume';
      
      // Auto-logout if token is invalid
      if (response.status === 401 || errorMsg.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '#/login';
        throw new Error('Session expired. Please log in again.');
      }
      
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getAnalysisHistoryAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/history` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/history';
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error || 'Failed to fetch history';
      
      if (response.status === 401 || errorMsg.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '#/login';
        throw new Error('Session expired. Please log in again.');
      }
      
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error('API History Error:', error);
    throw error;
  }
};

export const getAdminStatsAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/stats` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/stats';
  const token = localStorage.getItem('token');
  
  if (!token) throw new Error('Authentication required');

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error('Backend is updating. Please wait a minute and try again.');
    }
    throw new Error(errorData.error || 'Failed to fetch admin stats');
  }
  
  try {
    return await response.json();
  } catch (e) {
    throw new Error('Backend is updating. Please wait a minute and try again.');
  }
};

export const getAdminLogsAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/logs` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/logs';
  const token = localStorage.getItem('token');
  
  if (!token) throw new Error('Authentication required');

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error('Backend is updating. Please wait a minute and try again.');
    }
    throw new Error(errorData.error || 'Failed to fetch admin logs');
  }
  
  try {
    return await response.json();
  } catch (e) {
    throw new Error('Backend is updating. Please wait a minute and try again.');
  }
};

export const getAdminUsersAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/users` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/users';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};

export const getAllAnalysesAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/analyses` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/analyses';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch analyses');
  return await response.json();
};

export const deleteAnalysisAPI = async (id) => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/analyses/${id}` : `https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/analyses/${id}`;
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to delete analysis');
  return await response.json();
};

export const getContactMessagesAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/contacts` : 'https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/contacts';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch contact messages');
  return await response.json();
};
