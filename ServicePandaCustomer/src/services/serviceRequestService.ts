import { api } from '../config/api';
import type { ServiceRequest, ServiceCategory, Quote } from '../types';

export interface CreateServiceRequestData {
  categoryId: string;
  title: string;
  description: string;
  location: string;
  suburb: string;
  postcode: string;
  state: string;
  preferredDate?: string;
  preferredTime?: string;
  budget?: number;
  urgency: 'low' | 'medium' | 'high';
}

class ServiceRequestService {
  // Get all service categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    try {
      const response = await api.get('/api/service-categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service categories');
    }
  }

  // Create a new service request
  async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    try {
      const response = await api.post('/api/service-requests', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create service request');
    }
  }

  // Get user's service requests
  async getMyServiceRequests(): Promise<ServiceRequest[]> {
    try {
      const response = await api.get('/api/service-requests/my-requests');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service requests');
    }
  }

  // Get a specific service request by ID
  async getServiceRequest(id: string): Promise<ServiceRequest> {
    try {
      const response = await api.get(`/api/service-requests/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service request');
    }
  }

  // Get quotes for a service request
  async getQuotesForRequest(requestId: string): Promise<Quote[]> {
    try {
      const response = await api.get(`/api/service-requests/${requestId}/quotes`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quotes');
    }
  }

  // Accept a quote
  async acceptQuote(quoteId: string): Promise<Quote> {
    try {
      const response = await api.post(`/api/quotes/${quoteId}/accept`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to accept quote');
    }
  }

  // Reject a quote
  async rejectQuote(quoteId: string): Promise<void> {
    try {
      await api.post(`/api/quotes/${quoteId}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject quote');
    }
  }

  // Update service request
  async updateServiceRequest(id: string, updates: Partial<CreateServiceRequestData>): Promise<ServiceRequest> {
    try {
      const response = await api.put(`/api/service-requests/${id}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update service request');
    }
  }

  // Cancel service request
  async cancelServiceRequest(id: string): Promise<void> {
    try {
      await api.delete(`/api/service-requests/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel service request');
    }
  }

  // Mark service as completed
  async markServiceCompleted(requestId: string, rating?: number, review?: string): Promise<ServiceRequest> {
    try {
      const response = await api.post(`/api/service-requests/${requestId}/complete`, {
        rating,
        review,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark service as completed');
    }
  }

  // Get recent activity/notifications
  async getRecentActivity(): Promise<any[]> {
    try {
      const response = await api.get('/api/users/activity');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent activity');
    }
  }
}

export default new ServiceRequestService();