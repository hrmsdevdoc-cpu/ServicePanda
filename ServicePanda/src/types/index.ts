export interface Provider {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string;
  address?: string;
  businessName?: string;
  businessAbn?: string;
  status: 'pending' | 'approved' | 'rejected';
  providerStatus: 'activated' | 'deactivated';
  documentsUploaded: boolean;
  termsAccepted: boolean;
  rating?: string;
  totalReviews?: number;
  firstLeadsFreeUsed?: number;
  stripeCustomerId?: string;
  creditBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  requestId: number;
  categoryId: number;
  categoryName: string;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  suburb: string;
  postcode: string;
  address?: string;
  description?: string;
  urgency?: 'within_24_hours' | 'within_week' | 'flexible';
  preferredDate?: string;
  status: 'pending' | 'purchased';
  leadCost: string;
  paymentMethod?: 'free_lead' | 'credit' | 'card';
  offerType?: 'unique' | 'shared';
  isCurrentOffer?: boolean;
  expiresAt?: string;
  purchasedAt?: string;
  createdAt: string;
}

export interface Service {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ServiceArea {
  id: number;
  providerId: number;
  centerAddress: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  areaName?: string;
  createdAt: string;
}

export interface Document {
  id: number;
  providerId: number;
  documentType: 'license' | 'police_check' | 'insurance';
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'approved';
  uploadedAt: string;
}

export interface CreditTransaction {
  id: number;
  providerId: number;
  type: 'purchase' | 'voucher_redemption' | 'lead_purchase' | 'refund';
  amount: number;
  description: string;
  leadId?: number;
  voucherCode?: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  activityType: 'new_offer' | 'lead_purchased' | 'lead_lost' | 'offer_expired' | 'price_drop';
  message: string;
  description?: string;
  leadCost?: number;
  timestamp: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  leadCost?: number;
}

export interface PaymentMethod {
  id: number;
  providerId: number;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  cardBrand: string;
  cardLastFour: string;
  cardExpMonth: number;
  cardExpYear: number;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface BillingData {
  thisMonthPurchases: number;
  allPaidLeads: Array<{
    id: number;
    requestId: number;
    categoryName: string;
    customerName?: string;
    location?: string;
    amountCharged: number;
    creditUsed: number;
    paymentMethod: string;
    purchasedAt: string;
  }>;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  category?: 'lead' | 'payment' | 'system' | 'general';
}

export interface CustomerReview {
  id: number;
  customerId: string;
  providerId: number;
  requestId: number;
  overallRating: number; // 1-5 stars
  qualityRating: number; // 1-5 stars  
  professionalismRating: number; // 1-5 stars
  timelinessRating: number; // 1-5 stars
  valueRating: number; // 1-5 stars
  reviewText?: string; // Optional written review
  isPublic: boolean; // Can be displayed publicly
  createdAt: string;
  // Additional fields from API response
  providerFirstName?: string;
  providerLastName?: string;
  providerEmail?: string;
  providerBusinessName?: string;
  requestCategory?: string;
  requestDescription?: string;
  requestLocation?: string;
}

export interface ReviewToken {
  id: number;
  token: string;
  customerId: string;
  providerId: number;
  requestId: number;
  isUsed: boolean;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

