// API Configuration for different environments
const API_CONFIG = {
  development: {
    // Try these URLs in order - the first one that works will be used
    urls: [
      'https://api.servicepanda.com.au',  // Live production API
      'http://localhost:4000',            // Local development fallback
      'http://10.0.2.2:4000',            // Android emulator
      'http://127.0.0.1:4000',           // Localhost alternative
    ],
    defaultUrl: 'https://api.servicepanda.com.au'  // Use live API
  },
  production: {
    urls: ['https://api.servicepanda.com.au'],
    defaultUrl: 'https://api.servicepanda.com.au'
  }
};

// Detect environment
const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

// Export current configuration
const getCurrentApiConfig = () => {
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
};

// Export the base URL for use in API service
const API_BASE_URL = getCurrentApiConfig().defaultUrl;

module.exports = {
  API_CONFIG,
  getCurrentApiConfig,
  API_BASE_URL
};
