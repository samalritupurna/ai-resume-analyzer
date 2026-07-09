export const analyzeResumeAPI = async (file, jobDescription, linkedinProfileText = null) => {
  const formData = new FormData();
  
  if (file) {
    formData.append('resume', file);
  } else if (linkedinProfileText) {
    formData.append('linkedinProfileText', linkedinProfileText);
  }
  
  formData.append('jobDescription', jobDescription);

  // Hardcode the known working backend URL to bypass any Render environment variable issues
  const API_URL = 'https://ai-resume-analyzer-4-jshl.onrender.com/api/analyze';

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
      let errorMsg = 'Failed to analyze profile. Please try again.';
      try {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = `Server Error (${response.status}): ${errorText.substring(0, 100)}`;
        }
      } catch (e) {
        console.error('Failed to parse backend error response');
      }
      
      // Auto-logout if token is invalid (ONLY for 401 Unauthorized from OUR backend)
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '#/login';
        throw new Error('Session expired. Please log in again.');
      }
      
      throw new Error(errorMsg);
    }

    let finalData;
    try {
      finalData = await response.json();
    } catch (e) {
      console.error('Failed to parse successful backend response:', e);
      throw new Error('Server returned an invalid format. The backend is likely still deploying or temporarily busy. Please wait a minute and try again.');
    }
    return finalData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getAnalysisHistoryAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/history` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/history';
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
      
      if (response.status === 401) {
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
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/stats` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/admin/stats';
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
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/logs` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/admin/logs';
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
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/users` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/admin/users';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};

export const getAllAnalysesAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/analyses` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/admin/analyses';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch analyses');
  return await response.json();
};

export const deleteAnalysisAPI = async (id) => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/analyses/${id}` : `https://ai-resume-analyzer-4-jshl.onrender.com/api/admin/analyses/${id}`;
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to delete analysis');
  return await response.json();
};

export const getContactMessagesAPI = async () => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/contacts` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/admin/contacts';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authorized');
  const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch contact messages');
  return await response.json();
};

export const submitContactAPI = async (contactData) => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contact` : 'https://ai-resume-analyzer-4-jshl.onrender.com/api/contact';
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit contact message');
  }
  
  return await response.json();
};

export const getSharedAnalysisAPI = async (id) => {
  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/analyze/shared/${id}` : `https://ai-resume-analyzer-4-jshl.onrender.com/api/analyze/shared/${id}`;
  
  const response = await fetch(API_URL, {
    method: 'GET'
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch shared analysis');
  }
  
  return await response.json();
};
