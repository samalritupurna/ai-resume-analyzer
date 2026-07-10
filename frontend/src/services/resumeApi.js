const getBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-4-jshl.onrender.com/api';
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getResumesAPI = async () => {
  const response = await fetch(`${getBaseUrl()}/resumes`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch resumes');
  return await response.json();
};

export const createResumeAPI = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  
  const response = await fetch(`${getBaseUrl()}/resumes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Do not set Content-Type, let the browser set it with the boundary for FormData
    },
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create resume');
  }
  return await response.json();
};

export const getHistoryEventsAPI = async () => {
  const response = await fetch(`${getBaseUrl()}/history-events`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch history events');
  return await response.json();
};

export const analyzeMultipleResumesAPI = async (resumeIds, jobDescription) => {
  const response = await fetch(`${getBaseUrl()}/analyze-multiple`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ resumeIds, jobDescription })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to analyze multiple resumes');
  }
  return await response.json();
};
