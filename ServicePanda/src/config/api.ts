// API Configuration for ServicePanda Mobile App

// API Configuration for different environments
const API_CONFIG = {
  development: {
    // Try these URLs in order - the first one that works will be used
    urls: [ 
      'https://api.servicepanda.com.au',  // Live production API
      'http://localhost:3000',            // Local development fallback
      'http://10.0.2.2:3000',            // Android emulator
      'http://127.0.0.1:3000',           // Localhost alternative
    ],
    defaultUrl: 'https://api.servicepanda.com.au'  // Use live API
  },
  production: {
    urls: ['https://api.servicepanda.com.au'],
    defaultUrl: 'https://api.servicepanda.com.au'
  }
};

// Force production API for live deployment
// const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

// Export current configuration - always use production for live app
const getCurrentApiConfig = () => {
  return API_CONFIG.production; // Always use production API
};

// Export the base URL for use in API service
const API_BASE_URL = getCurrentApiConfig().defaultUrl;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  GET_CURRENT_USER: '/api/auth/user',
  
  // Provider Authentication
  PROVIDER_LOGIN: '/api/provider/login',
  PROVIDER_REGISTER: '/api/provider/register',
  
  // Service Requests
  SERVICE_REQUESTS: '/api/service-requests',
  CREATE_SERVICE_REQUEST: '/api/service-requests',
  MY_SERVICE_REQUESTS: '/api/service-requests/my-requests',
  
  // Service Categories
  SERVICE_CATEGORIES: '/api/service-categories',
  
  // User Profile
  UPDATE_PROFILE: '/api/profile',
  CHANGE_PASSWORD: '/api/change-password',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  MARK_NOTIFICATION_READ: '/api/notifications/:id/read',
  
  // Reviews
  MY_REVIEWS: '/api/reviews/my-reviews',
  SUBMIT_REVIEW: '/api/reviews',
  REVIEW_BY_TOKEN: '/api/reviews/token',
};

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Invalid email or password.',
  NOT_FOUND: 'Account not found. Please check your email.',
  CONFLICT: 'An account with this email already exists.',
  VALIDATION_ERROR: 'Please check your information and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

module.exports = {
  API_CONFIG,
  getCurrentApiConfig,
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  RETRY_CONFIG,
  ERROR_MESSAGES,
};