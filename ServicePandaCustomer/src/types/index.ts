// Types for ServicePanda Customer App
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
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
  status: 'pending' | 'quoted' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  serviceRequestId: string;
  providerId: string;
  amount: number;
  description: string;
  estimatedDuration?: string;
  proposedDate?: string;
  proposedTime?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
  provider?: ServiceProvider;
}

export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  abn?: string;
  phone: string;
  email: string;
  address: string;
  serviceCategories: string[];
  serviceAreas: string[];
  rating?: number;
  totalJobs?: number;
  isVerified: boolean;
  profileImage?: string;
  description?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}