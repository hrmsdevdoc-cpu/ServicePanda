// API Configuration - Auto-detect environment
const getBaseUrl = () => {
  // If we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Production/Staging - use current domain
    if (hostname === 'staging.servicepanda.com.au' || hostname === 'servicepanda.com.au') {
      return `${protocol}//${hostname}`;
    }
    
    // Development - use localhost with port 3000
    return 'http://localhost:3000';
  }
  
  // Fallback for server-side rendering
  return 'http://localhost:3000';
};

const API_BASE_URL = getBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default API_BASE_URL;
