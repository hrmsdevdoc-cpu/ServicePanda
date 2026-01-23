// API Configuration - Auto-detect environment
const getBaseUrl = () => {
  // If we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check for forced localhost override (useful for local development)
    const forceLocalhost = localStorage.getItem('forceLocalhostAPI') === 'true' || 
                          new URLSearchParams(window.location.search).get('useLocalhost') === 'true';
    
    if (forceLocalhost) {
      console.log('API Config: Using localhost API (forced)');
      return 'http://localhost:3000';
    }
    
    // Localhost or 127.0.0.1 - always use local API
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.0.')) {
      return 'http://localhost:3000';
    }
    
    // Production/Staging - use API subdomain
    if (hostname === 'staging.servicepanda.com.au' || hostname === 'servicepanda.com.au' || hostname.includes('servicepanda.com.au')) {
      return 'https://api.servicepanda.com.au';
    }
    
    // Development - use localhost with port 3000
    return 'http://localhost:3000';
  }
  
  // Fallback for server-side rendering
  return 'http://localhost:3000';
};

const API_BASE_URL = getBaseUrl();

// Log the API base URL in development
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  console.log('API Base URL:', API_BASE_URL);
}

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default API_BASE_URL;
