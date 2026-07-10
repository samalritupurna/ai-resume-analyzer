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
