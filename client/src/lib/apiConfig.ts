// API Configuration
const getApiBaseUrl = (): string => {
  // Check for environment-specific API URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Always use live API URL
  return 'https://api.servicepanda.com.au';
};

const API_BASE_URL = getApiBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (API_BASE_URL) {
    // Use absolute URL if API_BASE_URL is set
    return `${API_BASE_URL}/${cleanEndpoint}`;
  } else {
    // Use relative URL
    return `/${cleanEndpoint}`;
  }
};

export default API_BASE_URL;
