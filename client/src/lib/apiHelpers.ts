import { getApiUrl } from "./apiConfig";

// Helper function to make API calls with proper URL configuration
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  return fetch(url, {
    ...options,
    credentials: "include",
  });
};

// Helper for GET requests
export const apiGet = async (endpoint: string, headers: Record<string, string> = {}) => {
  return apiCall(endpoint, {
    method: 'GET',
    headers,
  });
};

// Helper for POST requests
export const apiPost = async (endpoint: string, data?: any, headers: Record<string, string> = {}) => {
  const isFormData = data instanceof FormData;
  
  const requestHeaders = { ...headers };
  if (!isFormData && data) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  return apiCall(endpoint, {
    method: 'POST',
    headers: requestHeaders,
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
};

// Helper for PATCH requests
export const apiPatch = async (endpoint: string, data?: any, headers: Record<string, string> = {}) => {
  const isFormData = data instanceof FormData;
  
  const requestHeaders = { ...headers };
  if (!isFormData && data) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  return apiCall(endpoint, {
    method: 'PATCH',
    headers: requestHeaders,
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
};

// Helper for DELETE requests
export const apiDelete = async (endpoint: string, headers: Record<string, string> = {}) => {
  return apiCall(endpoint, {
    method: 'DELETE',
    headers,
  });
};
