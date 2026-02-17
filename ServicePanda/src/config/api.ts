// API Configuration for ServicePanda Mobile App

// API Configuration for different environments
const API_CONFIG = {
  development: {
    // Try these URLs in order - the first one that works will be used
    urls: [
      'http://10.0.2.2:3000',            // Android emulator (primary)
      'http://localhost:3000',            // Local development server
      'http://127.0.0.1:3000',           // Localhost alternative
      'https://api.servicepanda.com.au',  // Live production API fallback
    ],
    defaultUrl: 'http://10.0.2.2:3000'  // Use Android emulator URL
  },
  production: {
    urls: ['https://api.servicepanda.com.au'],
    defaultUrl: 'https://api.servicepanda.com.au'
  }
};

// Use production API for login and registration
const isDevelopment = false; // Set to false to use production API

// Export current configuration - now using production API
const getCurrentApiConfig = () => {
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
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
export const REQUEST_TIMEOUT = 30000; // 30 seconds (prod can be slow on cold starts)

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