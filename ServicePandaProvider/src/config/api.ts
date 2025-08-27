// API Configuration for different environments
const API_CONFIG = {
  development: {
    // Try these URLs in order - the first one that works will be used
    urls: [
      'http://192.168.1.39:4000',       // Your computer's local network IP (UPDATED)
      'http://10.0.2.2:4000',           // Android emulator
      'http://localhost:4000',           // Local development
      'http://127.0.0.1:4000',          // Localhost alternative
    ],
    defaultUrl: 'http://192.168.1.39:4000'  // Use your actual IP address (UPDATED)
  },
  production: {
    urls: ['https://your-production-api.com'],
    defaultUrl: 'https://your-production-api.com'
  }
};

// Get the current environment
const isDevelopment = __DEV__;

// Export the current configuration
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
