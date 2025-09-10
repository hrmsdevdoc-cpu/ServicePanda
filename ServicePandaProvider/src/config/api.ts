// API Configuration for different environments
const API_CONFIG = {
  development: {
    // Try these URLs in order - the first one that works will be used
    urls: [
      'http://10.0.2.2:3000',   // Android emulator (this should be first!)
      'http://127.0.0.1:3000',  // Localhost alternative
      'http://localhost:3000',  // Local dev server
    ],
    defaultUrl: 'http://10.0.2.2:3000'  // Use Android emulator IP as default
  },
  production: {
    urls: ['https://api.yourdomain.com'],   // ✅ Replace with real server URL
    defaultUrl: 'https://api.yourdomain.com'
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
