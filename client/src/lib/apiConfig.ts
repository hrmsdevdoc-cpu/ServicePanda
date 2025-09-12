// API Configuration - Static Live URL
const API_BASE_URL = 'https://api.servicepanda.com.au';

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default API_BASE_URL;
