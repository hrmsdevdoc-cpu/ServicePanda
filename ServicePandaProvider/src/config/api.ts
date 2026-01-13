// API Configuration for different environments
const API_CONFIG = {
  development: {
    // Try these URLs in order - the first one that works will be used
    urls: [
      'http://10.0.2.2:3000',            // Android emulator localhost (primary)
      'http://localhost:3000',            // Local development server 
      'http://127.0.0.1:3000',           // Localhost alternative
      'https://api.servicepanda.com.au',  // Live production API (fallback)
    ],
    defaultUrl: 'http://10.0.2.2:3000'  // Use Android emulator localhost for testing
  },
  production: {
    urls: ['https://api.servicepanda.com.au'],
    defaultUrl: 'https://api.servicepanda.com.au'
  }
};

// Force production API for live deployment
// const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

// Export current configuration - switch to production for live deployment
const getCurrentApiConfig = () => {
  // For LIVE: return API_CONFIG.production
  // For LOCAL: return API_CONFIG.development
  return API_CONFIG.production; // Now using LIVE production API
};

// Export the base URL for use in API service
const API_BASE_URL = getCurrentApiConfig().defaultUrl;

module.exports = {
  API_CONFIG,
  getCurrentApiConfig,
  API_BASE_URL
};
