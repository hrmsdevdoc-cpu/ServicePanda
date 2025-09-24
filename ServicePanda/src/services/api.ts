const { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT, ERROR_MESSAGES } = require('../config/api');

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('🔍 API Request:', {
      url,
      method: options.method || 'GET',
      baseUrl: API_BASE_URL,
      endpoint
    });
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session-based auth
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} - ${errorText}`);
        throw new Error(`${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error(`💥 API Request Failed:`, error);
      
      // Handle timeout errors specifically
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      
      throw error;
    }
  }

  // Customer Authentication
  async login(credentials: LoginCredentials): Promise<User> {
    return this.makeRequest<User>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    return this.makeRequest<User>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.makeRequest<User>(API_ENDPOINTS.GET_CURRENT_USER);
    } catch (error) {
      console.log('No authenticated user found');
      return null;
    }
  }

  async updateProfile(data: { firstName: string; lastName: string; phoneNumber?: string }): Promise<User> {
    return this.makeRequest<User>('/api/auth/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<any> {
    return this.makeRequest(API_ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    } catch (error) {
      console.log('Logout request failed, but continuing with local cleanup');
    }
  }

  // Provider Authentication (for future use)
  async providerLogin(credentials: LoginCredentials): Promise<any> {
    return this.makeRequest(API_ENDPOINTS.PROVIDER_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Service Requests
  async getServiceRequests(): Promise<any[]> {
    return this.makeRequest(API_ENDPOINTS.SERVICE_REQUESTS);
  }

  async getMyServiceRequests(): Promise<any[]> {
    return this.makeRequest(API_ENDPOINTS.MY_SERVICE_REQUESTS);
  }

  async getRequestProfessionals(requestId: string | number): Promise<any[]> {
    return this.makeRequest(`${API_ENDPOINTS.MY_SERVICE_REQUESTS}/${requestId}/professionals`);
  }

  async createServiceRequest(data: any): Promise<any> {
    return this.makeRequest(API_ENDPOINTS.CREATE_SERVICE_REQUEST, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Service Categories
  async getServiceCategories(): Promise<any[]> {
    return this.makeRequest(API_ENDPOINTS.SERVICE_CATEGORIES);
  }

  async getTrendingServiceCategories(): Promise<any[]> {
    return this.makeRequest(`${API_ENDPOINTS.SERVICE_CATEGORIES}/trending`);
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    return this.makeRequest(API_ENDPOINTS.NOTIFICATIONS);
  }

  async markNotificationAsRead(notificationId: number): Promise<any> {
    return this.makeRequest(API_ENDPOINTS.MARK_NOTIFICATION_READ.replace(':id', notificationId.toString()), {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<any> {
    return this.makeRequest('/api/notifications/read-all', {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount(): Promise<{ count: number }> {
    return this.makeRequest('/api/notifications/unread-count');
  }

  // Reviews
  async getMyReviews(): Promise<any[]> {
    return this.makeRequest('/api/customer/reviews');
  }

  async submitReview(reviewData: any): Promise<any> {
    return this.makeRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviewByToken(token: string): Promise<any> {
    return this.makeRequest(`/api/reviews/token/${token}`);
  }

  // Generic HTTP methods for external use
  async get(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint);
  }

  async post(endpoint: string, data?: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export type { LoginCredentials, RegisterCredentials, User, ApiResponse };