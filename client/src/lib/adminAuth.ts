import { getApiUrl } from "./apiConfig";

// Admin authentication utility for handling token expiration
export const adminApiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('adminToken');
  
  // Check if data is FormData
  const isFormData = data instanceof FormData;
  
  const headers: Record<string, string> = {
    'x-admin-token': token || '',
  };
  
  // Only set Content-Type for JSON data, not for FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(getApiUrl(url), {
    method,
    headers,
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
  
  // Check for 401 Unauthorized (token expired)
  if (response.status === 401) {
    console.log("Admin session expired, clearing token and redirecting to login");
    localStorage.removeItem('adminToken');
    // Use window.location to ensure page reload and clear any cached state
    window.location.href = '/admin-login';
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }
  
  return response;
};

// React Query helper for admin API calls with automatic logout
export const createAdminQueryFn = (url: string) => {
  return async () => {
    const response = await adminApiRequest('GET', url);
    return response.json();
  };
};

// Debug function to clear admin session
export const clearAdminSession = () => {
  console.log("Clearing admin session data");
  localStorage.removeItem('adminToken');
  window.location.href = '/admin-login';
};