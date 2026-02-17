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
    options: RequestInit = {},
    attempt: number = 1
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
      'Accept': 'application/json',
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

      const status = response.status;
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      const makeHttpError = (message: string) => {
        const err: any = new Error(message);
        err.status = status;
        err.url = url;
        err.endpoint = endpoint;
        return err;
      };

      // Handle non-2xx responses
      if (!response.ok) {
        const errorText = await response.text();
        const errorSnippet = (errorText || '').slice(0, 500);
        // Avoid spamming LogBox overlays for transient gateway errors in dev:
        // log these as normal logs while still retaining details in Metro.
        if ([502, 503, 504].includes(status)) {
          console.log(`❌ API Error: ${status} - ${errorSnippet}`);
        } else {
          console.error(`❌ API Error: ${status} - ${errorSnippet}`);
        }

        // Retry transient server errors
        if (attempt < 3 && [502, 503, 504].includes(status)) {
          const backoffMs = 250 * Math.pow(2, attempt - 1);
          await new Promise(r => setTimeout(r, backoffMs));
          return this.makeRequest<T>(endpoint, options, attempt + 1);
        }

        // Prefer friendly messages over dumping HTML/nginx pages to the UI.
        const isHtml = contentType.includes('text/html') || /^\s*<(!doctype|html)\b/i.test(errorText || '');
        if ([502, 503, 504].includes(status)) {
          throw makeHttpError(ERROR_MESSAGES.SERVER_ERROR);
        }
        if (status === 401) {
          throw makeHttpError('Session expired. Please log in again.');
        }
        if (status === 403) {
          throw makeHttpError('Access denied. Please contact support if this persists.');
        }
        if (isHtml) {
          throw makeHttpError(`Server returned an unexpected response (HTTP ${status}). Please try again later.`);
        }

        throw makeHttpError(`${status}: ${errorText || response.statusText}`);
      }

      // No content
      if (status === 204) {
        // @ts-expect-error allow void return for no content
        return undefined;
      }

      // Parse JSON only when content-type is JSON
      if (contentType.includes('application/json')) {
        return await response.json();
      }

      // Fallback: try JSON parse first; if fails, surface text with hint
      const rawText = await response.text();
      try {
        return JSON.parse(rawText);
      } catch (parseErr) {
        const snippet = rawText.slice(0, 200);
        throw new Error(`Unexpected non-JSON response (content-type: ${contentType || 'unknown'}): ${snippet}`);
      }
    } catch (error: any) {
      // Keep failures visible in Metro, but don't force LogBox overlays for common transient failures.
      console.log(`💥 API Request Failed:`, error);

      // Handle timeout errors specifically
      if (error?.name === 'AbortError') {
        // Retry a couple times: production can be slow on cold starts
        if (attempt < 3) {
          const backoffMs = 500 * Math.pow(2, attempt - 1);
          await new Promise(r => setTimeout(r, backoffMs));
          return this.makeRequest<T>(endpoint, options, attempt + 1);
        }
        throw new Error('Request timeout - please check your connection');
      }

      // Retry on network errors for first 2 attempts
      const message = typeof error?.message === 'string' ? error.message : '';
      const isNetworkError = (
        message.includes('Network request failed') ||
        message.includes('Could not connect to the server') ||
        message.includes('The Internet connection appears to be offline')
      );
      if (attempt < 3 && isNetworkError) {
        const backoffMs = 250 * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, backoffMs));
        return this.makeRequest<T>(endpoint, options, attempt + 1);
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
    } catch (error: any) {
      const status = error?.status;
      const msg = typeof error?.message === 'string' ? error.message : '';

      // Only treat explicit unauthorized as "logged out".
      // For network/server issues (502/timeout/etc), throw so callers can decide
      // whether to fall back to cached local auth (offline mode).
      if (status === 401 || msg.toLowerCase().includes('session expired')) {
        console.log('No authenticated user found');
        return null;
      }

      throw error;
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