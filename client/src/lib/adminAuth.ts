// Admin authentication utility for handling token expiration
export const adminApiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('adminToken');
  console.log("Frontend sending admin token:", token ? `${token.substring(0, 20)}...` : "None");
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || '',
    },
    body: data ? JSON.stringify(data) : undefined,
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