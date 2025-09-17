const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const {
  Provider,
  Lead,
  Service,
  ServiceArea,
  Document,
  CreditTransaction,
  Activity,
  ServiceCategory,
  PaymentMethod,
  BillingData
} = require('../types');

// Import API configuration dynamically to avoid caching issues
const getApiConfig = () => require('../config/api');

class ApiService {
  async getHeaders() {
    const headers = {
      'Accept': 'application/json',
    };

    // Get provider ID from AsyncStorage for authenticated requests
    const providerId = await AsyncStorage.getItem('providerId');
    if (providerId) {
      headers['x-provider-id'] = providerId;
    }

    return headers;
  }

  async getProviderId() {
    return await AsyncStorage.getItem('providerId');
  }

  async request(method: string, endpoint: string, body?: any) {
    const { API_BASE_URL } = getApiConfig();


    const headers: Record<string, string> = await this.getHeaders();
    console.log('📋 Request Headers:', headers);

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      if (body instanceof FormData) {
        // Don't set Content-Type for FormData, let the browser set it
      } else {
        headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
      }
    }

    if (body instanceof FormData) {
      config.body = body;
    }

    console.log('📤 Sending request with config:', config);
    console.log('📤 Request body stringified:', config.body);

    try {
      // Test network connectivity first
      console.log('🔍 Testing network connectivity...');
      const testResponse = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }).catch(() => null);

      if (testResponse) {
        console.log('✅ Network connectivity test passed');
      } else {
        console.log('⚠️ Network connectivity test failed - trying main request anyway');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ API Response data:', result);
      return result;
    } catch (error: any) {
      console.error('💥 API Request failed:', error);
      console.error('💥 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Provide helpful error messages for common issues
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        console.error('🌐 Network Error - Possible causes:');
        console.error('   - Server not running on port 3000');
        console.error('   - Wrong IP address in API configuration');
        console.error('   - Network/firewall blocking connection');
        console.error('   - Try updating API_BASE_URL in src/config/api.ts');
      }

      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('POST', '/api/provider/login', { email, password });
  }

  async logout() {
    return this.request('POST', '/api/provider/logout');
  }

  async register(data: any) {
    return this.request('POST', '/api/provider/register', data);
  }

  async forgotPassword(email: string) {
    return this.request('POST', '/api/provider/forgot-password', { email });
  }

  async resetPassword(token: string, password: string) {
    return this.request('POST', '/api/provider/reset-password', { token, password });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('POST', '/api/provider/change-password', { currentPassword, newPassword });
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('POST', '/api/provider/login', { email, password });
  }

  async logout() {
    return this.request('POST', '/api/provider/logout');
  }

  // Provider endpoints
  async getProfile() {
    return this.request('GET', '/api/provider/profile');
  }

  async updateProfile(providerId: string | number, data: any) {
    return this.request('PUT', `/api/provider/${providerId}/profile`, data);
  }

  // Leads endpoints
  async getLeads() {
    return this.request('GET', '/api/provider/leads');
  }

  async getClosedLeads() {
    return this.request('GET', '/api/provider/leads/closed');
  }

  async purchaseLead(requestId: string | number) {
    return this.request('POST', `/api/provider/leads/${requestId}/purchase`);
  }

  async updateLeadStatus(
    leadId: string | number,
    status: string,
    wasJobBooked: boolean
  ) {
    return this.request('PUT', `/api/provider/leads/${leadId}/status`, {
      status,
      wasJobBooked
    });
  }

  async closeLead(leadId: string | number, wasJobBooked: boolean) {
    return this.updateLeadStatus(leadId, 'closed', wasJobBooked);
  }

  async trackInteraction(
    leadId,
    interactionType
  ) {
    return this.request('POST', `/api/provider/leads/${leadId}/interaction`, {
      interactionType
    });
  }

  // Services endpoints
  async getServices() {
    return this.request('GET', '/api/provider/services');
  }

  async getServiceCategories() {
    return this.request('GET', '/api/service-categories');
  }

  async updateServices(providerId, categoryIds) {
    return this.request('POST', `/api/service-providers/${providerId}/services`, { categoryIds });
  }

  // Service Areas endpoints
  async getServiceAreas(providerId) {
    return this.request('GET', `/api/provider/${providerId}/location-service-areas`);
  }

  async addServiceArea(providerId, data) {
    return this.request('POST', `/api/provider/${providerId}/location-service-areas`, data);
  }

  async deleteServiceArea(providerId, areaId) {
    return this.request('DELETE', `/api/provider/${providerId}/location-service-areas/${areaId}`);
  }

  // Documents endpoints
  async getDocuments(providerId) {
    return this.request('GET', `/api/service-providers/${providerId}/documents`);
  }

  async uploadDocuments(providerId, documents) {
    return this.request('POST', `/api/service-providers/${providerId}/documents`, documents);
  }

  // Credit endpoints
  async getCreditBalance() {
    return this.request('GET', '/api/provider/credit/balance');
  }

  async getCreditTransactions() {
    return this.request('GET', '/api/provider/credit/transactions');
  }

  async redeemVoucher(voucherCode) {
    return this.request('POST', '/api/provider/credit/redeem-voucher', { voucherCode });
  }

  // Activity endpoints
  async getActivity() {
    return this.request('GET', '/api/provider/activity');
  }

  // Payment endpoints
  async getPaymentMethods(providerId) {
    return this.request('GET', `/api/provider/${providerId}/payment-methods`);
  }

  async addPaymentMethod(providerId, paymentMethodData) {
    // If it's a Stripe payment method ID (string), use the old endpoint
    if (typeof paymentMethodData === 'string') {
      return this.request('POST', `/api/provider/${providerId}/stripe-payment-methods`, {
        paymentMethodId: paymentMethodData
      });
    }

    // If it's payment method data object, use the new endpoint
    return this.request('POST', `/api/provider/${providerId}/payment-methods`, paymentMethodData);
  }

  async deletePaymentMethod(providerId, paymentMethodId) {
    return this.request('DELETE', `/api/provider/${providerId}/payment-methods/${paymentMethodId}`);
  }

  async setPrimaryPaymentMethod(providerId, paymentMethodId) {
    return this.request('PUT', `/api/provider/${providerId}/payment-methods/${paymentMethodId}/primary`);
  }

  // Billing endpoints
  async getBillingData() {
    return this.request('GET', '/api/provider/billing');
  }
}

module.exports = new ApiService();

