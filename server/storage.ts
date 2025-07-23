import {
  users,
  serviceProviders,
  serviceCategories,
  providerServices,
  australianStates,
  australianRegions,
  australianSuburbs,
  providerServiceAreas,
  providerDocuments,
  serviceRequests,
  leadAssignments,
  emailTemplates,
  sentEmails,
  userActivityLogs,
  systemSettings,
  type User,
  type UpsertUser,
  type ServiceProvider,
  type InsertServiceProvider,
  type ServiceCategory,
  type InsertServiceCategory,
  type InsertProviderService,
  type InsertProviderServiceArea,
  type ProviderServiceArea,
  type InsertProviderDocument,
  type ProviderDocument,
  type InsertServiceRequest,
  type ServiceRequest,
  type InsertLeadAssignment,
  type LeadAssignment,
  type InsertEmailTemplate,
  type EmailTemplate,
  type InsertSentEmail,
  type SentEmail,
  type InsertUserActivityLog,
  type UserActivityLog,
  type InsertSystemSetting,
  type SystemSetting,
  type AustralianState,
  type AustralianRegion,
  type AustralianSuburb,
  providerPaymentMethods,
  type InsertProviderPaymentMethod,
  type ProviderPaymentMethod,
  passwordResetTokens,
  type InsertPasswordResetToken,
  type PasswordResetToken,
  providerPasswordResetTokens,
  type InsertProviderPasswordResetToken,
  type ProviderPasswordResetToken,
  providerActivityLogs,
  type ProviderActivityLog,
  type InsertProviderActivityLog,
  leadSettings,
  categoryLeadPricing,
  providerPostcodeCoverage,
  leadNotes,
  type LeadSettings,
  type InsertLeadSettings,
  type CategoryLeadPricing,
  type InsertCategoryLeadPricing,
  type LeadNote,
  type InsertLeadNote,
  providerRatings,
  leadOffers,
  leadDistributionLog,
  type ProviderRating,
  type InsertProviderRating,
  type LeadOffer,
  type InsertLeadOffer,
  type LeadDistributionLog,
  type InsertLeadDistributionLog,
  providerVouchers,
  providerCreditTransactions,
  adminDepartments,
  adminUsers,
  adminUserDepartments,
  type AdminDepartment,
  type InsertAdminDepartment,
  type AdminUser,
  type InsertAdminUser,
  type AdminUserDepartment,
  type InsertAdminUserDepartment,
  leadPurchases,
  type ProviderVoucher,
  type InsertProviderVoucher,
  type ProviderCreditTransaction,
  type InsertProviderCreditTransaction,
  type LeadPurchase,
  type InsertLeadPurchase,
  providerLeadInteractions,
  type ProviderLeadInteraction,
  type InsertProviderLeadInteraction,
  providerLeadStatus,
  type ProviderLeadStatus,
  type InsertProviderLeadStatus,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, inArray, isNotNull, isNull, sql, ne } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getUsersWithStats(): Promise<Array<User & { lastLogin?: string; isActive: boolean }>>;
  getLeadsWithMetrics(): Promise<Array<ServiceRequest & { leadOffers?: any[], offerMetrics?: any, leadAssignments?: any[] }>>;
  
  // Service provider operations
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderById(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider>;
  updateProviderStatus(id: number, providerStatus: string): Promise<void>;
  getServiceProvidersByStatus(status: string): Promise<ServiceProvider[]>;
  getServiceProvidersForAdmin(status?: string): Promise<any[]>;
  
  // Service category operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Provider service operations
  addProviderService(providerService: InsertProviderService): Promise<void>;
  replaceProviderServices(providerId: number, categoryIds: number[]): Promise<void>;
  getProviderServices(providerId: number): Promise<any[]>;
  
  // Location operations
  getAustralianStates(): Promise<AustralianState[]>;
  getSuburbsByPostcode(postcode: string): Promise<AustralianSuburb[]>;
  addProviderServiceArea(area: InsertProviderServiceArea): Promise<void>;
  addProviderLocationServiceArea(serviceAreaData: {
    providerId: number;
    centerAddress: string;
    centerLat?: string;
    centerLng?: string;
    radiusKm: number;
    areaName?: string;
  }): Promise<ProviderServiceArea>;
  getProviderServiceAreas(providerId: number): Promise<AustralianSuburb[]>;
  getProviderLocationServiceAreas(providerId: number): Promise<ProviderServiceArea[]>;
  deleteProviderLocationServiceArea(providerId: number, areaId: number): Promise<void>;
  
  // Document operations
  uploadProviderDocument(document: InsertProviderDocument): Promise<ProviderDocument>;
  getProviderDocuments(providerId: number): Promise<ProviderDocument[]>;
  getProviderDocument(id: number): Promise<ProviderDocument | undefined>;
  updateDocumentStatus(id: number, status: string): Promise<void>;
  
  // Service request operations
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequests(customerId?: string): Promise<ServiceRequest[]>;
  getServiceRequestsByArea(postcode: string, categoryId: number): Promise<ServiceRequest[]>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  updateServiceRequestStatus(id: number, status: string): Promise<void>;
  
  // Lead assignment operations
  createLeadAssignment(assignment: InsertLeadAssignment): Promise<LeadAssignment>;
  getProviderLeads(providerId: number, status?: string): Promise<LeadAssignment[]>;
  updateLeadStatus(id: number, status: string): Promise<void>;
  
  // Email operations
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  getEmailTemplates(): Promise<EmailTemplate[]>;
  logSentEmail(email: InsertSentEmail): Promise<SentEmail>;
  
  // Activity logging
  logUserActivity(log: InsertUserActivityLog): Promise<UserActivityLog>;
  
  // System settings
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  updateSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
  
  // Regional operations
  getAllRegions(): Promise<AustralianRegion[]>;
  getRegionsByStateId(stateId: number): Promise<AustralianRegion[]>;
  getSuburbsByRegion(regionId: number): Promise<AustralianSuburb[]>;

  // Admin operations
  getServiceProviderCount(status?: string): Promise<number>;
  getUserCount(): Promise<number>;
  getServiceRequestCount(status?: string): Promise<number>;
  getServiceProvidersForAdmin(status?: string): Promise<ServiceProvider[]>;
  updateServiceProviderStatus(id: number, status: string): Promise<void>;
  getAllServiceRequestsForAdmin(): Promise<ServiceRequest[]>;
  getProviderDetailsForAdmin(providerId: number): Promise<any>;
  addProviderServiceArea(serviceAreaData: { providerId: number; centerAddress: string; radiusKm: number; areaName?: string | null; }): Promise<ProviderServiceArea>;
  removeProviderServiceArea(areaId: number): Promise<void>;
  updateProviderAdminFields(providerId: number, fields: { adminNotes?: string; insuranceExpiryDate?: Date | null; }): Promise<void>;

  // Admin settings operations
  getAdminSettings(): Promise<{ stripeConfigured: boolean; mailgunConfigured: boolean }>;
  updateAdminSetting(key: string, value: string): Promise<void>;
  getDecryptedSetting(key: string): Promise<string | null>;
  
  // Mailgun settings operations
  getDecryptedMailgunKeys(): Promise<{ apiKey: string; domain: string; domainSendingKey: string } | null>;

  // Payment operations
  getProviderPaymentMethods(providerId: number): Promise<ProviderPaymentMethod[]>;
  addProviderPaymentMethod(paymentMethod: InsertProviderPaymentMethod): Promise<ProviderPaymentMethod>;
  updateProviderPaymentMethodPrimary(providerId: number, paymentMethodId: number): Promise<void>;
  removeProviderPaymentMethod(providerId: number, paymentMethodId: number): Promise<void>;
  deleteProviderPaymentMethod(paymentMethodId: number): Promise<void>;
  updateProviderStripeCustomerId(providerId: number, stripeCustomerId: string): Promise<void>;
  
  // Stripe settings operations
  getDecryptedStripeKeys(): Promise<{ secretKey: string; publicKey: string } | null>;
  
  // Password reset operations
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markTokenAsUsed(token: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<User>;

  // Provider password reset operations
  createProviderPasswordResetToken(token: InsertProviderPasswordResetToken): Promise<ProviderPasswordResetToken>;
  getProviderPasswordResetToken(token: string): Promise<ProviderPasswordResetToken | undefined>;
  markProviderTokenAsUsed(token: string): Promise<void>;
  updateProviderPassword(providerId: number, hashedPassword: string): Promise<ServiceProvider>;

  // Activity logging methods
  logProviderActivity(activity: InsertProviderActivityLog): Promise<void>;
  getProviderActivityLogs(providerId: number, actorType?: 'admin' | 'provider'): Promise<ProviderActivityLog[]>;

  // Lead notes operations
  addLeadNote(leadId: number, note: string, adminName: string): Promise<LeadNote>;
  getLeadNotes(leadId: number): Promise<LeadNote[]>;

  // Lead sharing system operations
  initializeLeadDistribution(requestId: number): Promise<void>;
  getEligibleProviders(categoryId: number, postcode: string): Promise<Array<{providerId: number, rating: number, firstName: string, lastName: string}>>;
  getLeadCost(categoryId: number, offerType: 'unique' | 'shared'): Promise<number>;
  activateNextUniqueOffer(requestId: number): Promise<void>;
  startSharedPhase(requestId: number): Promise<void>;
  purchaseLead(requestId: number, providerId: number): Promise<{success: boolean, message: string}>;
  endLeadDistribution(requestId: number): Promise<void>;
  getLeadOfferDetails(requestId: number): Promise<any>;
  getProviderActiveLeads(providerId: number): Promise<any[]>;
  getProviderActivityHistory(providerId: number): Promise<any[]>;
  
  // Credit system operations
  getProviderCreditBalance(providerId: number): Promise<number>;
  addProviderCredit(providerId: number, amount: number, description: string, transactionType?: string): Promise<void>;
  deductProviderCredit(providerId: number, amount: number, description: string, leadOfferId?: number): Promise<boolean>;
  redeemVoucher(providerId: number, voucherCode: string): Promise<{ success: boolean; message: string; creditAdded?: number }>;
  getProviderCreditTransactions(providerId: number): Promise<ProviderCreditTransaction[]>;
  purchaseLeadWithCredit(providerId: number, offerId: number): Promise<{ success: boolean; message: string; paymentDetails?: any }>;
  getAvailableVouchers(): Promise<ProviderVoucher[]>;
  getVoucherByCode(code: string): Promise<ProviderVoucher | undefined>;

  // Admin voucher management
  getAllVouchersAdmin(): Promise<ProviderVoucher[]>;
  createVoucherAdmin(voucher: InsertProviderVoucher): Promise<ProviderVoucher>;
  createBulkVouchersAdmin(vouchers: InsertProviderVoucher[]): Promise<{ count: number; vouchers: ProviderVoucher[] }>;
  updateVoucherAdmin(id: number, updates: Partial<InsertProviderVoucher>): Promise<ProviderVoucher | undefined>;
  deleteVoucherAdmin(id: number): Promise<boolean>;
  resetVoucherAdmin(id: number): Promise<ProviderVoucher | undefined>;

  // Provider lead interaction tracking
  logProviderLeadInteraction(interaction: InsertProviderLeadInteraction): Promise<void>;
  getProviderLeadInteractions(leadId: number): Promise<ProviderLeadInteraction[]>;

  // Admin department operations
  getAllDepartments(): Promise<AdminDepartment[]>;
  createDepartment(department: InsertAdminDepartment): Promise<AdminDepartment>;
  updateDepartment(id: number, updates: Partial<AdminDepartment>): Promise<AdminDepartment>;
  deleteDepartment(id: number): Promise<boolean>;

  // Admin user operations  
  getAllAdminUsers(): Promise<AdminUser[]>;
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser>;
  deleteAdminUser(id: number): Promise<boolean>;
  
  // Admin user department operations
  getUserDepartments(userId: number): Promise<AdminDepartment[]>;
  assignUserToDepartment(userId: number, departmentId: number): Promise<void>;
  removeUserFromDepartment(userId: number, departmentId: number): Promise<void>;
  updateUserDepartments(userId: number, departmentIds: number[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'servicepanda-encryption-key-default-32chars';
  private readonly ALGORITHM = 'aes-256-gcm';

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) throw new Error('Invalid encrypted format');
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const key = crypto.scryptSync(this.ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id));
  }

  async getUsersWithStats(): Promise<Array<User & { lastLogin?: string; isActive: boolean }>> {
    const allUsers = await this.getAllUsers();
    
    // Return users with real last login data from database
    return allUsers.map(user => ({
      ...user,
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : undefined,
      isActive: true // For now, assume all users are active
    }));
  }

  async getLeadsWithMetrics(): Promise<Array<ServiceRequest & { leadOffers?: any[], offerMetrics?: any }>> {
    try {
      // Get all service requests first
      const requestsData = await db
        .select()
        .from(serviceRequests)
        .orderBy(desc(serviceRequests.createdAt));

      // Get customer and category details separately to avoid join issues
      const requestsWithDetails = await Promise.all(
        requestsData.map(async (request) => {
          // Get customer details
          const customer = await db
            .select({
              firstName: users.firstName,
              lastName: users.lastName,
              email: users.email,
              phoneNumber: users.phoneNumber,
            })
            .from(users)
            .where(eq(users.id, request.customerId))
            .limit(1);

          // Get category details
          const category = await db
            .select({
              name: serviceCategories.name,
            })
            .from(serviceCategories)
            .where(eq(serviceCategories.id, request.categoryId))
            .limit(1);

          return {
            ...request,
            customerFirstName: customer[0]?.firstName || '',
            customerLastName: customer[0]?.lastName || '',
            customerEmail: customer[0]?.email || '',
            customerPhoneNumber: customer[0]?.phoneNumber || '',
            categoryName: category[0]?.name || '',
          };
        })
      );

      // Get lead offers for each service request with offer metrics
      const requestsWithOffers = await Promise.all(
        requestsWithDetails.map(async (request: any) => {
          // Get all lead offers for this request
          const offers = await db
            .select({
              id: leadOffers.id,
              providerId: leadOffers.providerId,
              offerType: leadOffers.offerType,
              status: leadOffers.status,
              isCurrentOffer: leadOffers.isCurrentOffer,
              offerStartTime: leadOffers.offerStartTime,
              expiresAt: leadOffers.expiresAt,
              createdAt: leadOffers.createdAt,
              // Provider info
              providerFirstName: serviceProviders.firstName,
              providerLastName: serviceProviders.lastName,
            })
            .from(leadOffers)
            .leftJoin(serviceProviders, eq(leadOffers.providerId, serviceProviders.id))
            .where(eq(leadOffers.requestId, request.id))
            .orderBy(desc(leadOffers.createdAt));

          // Format the offers for frontend consumption
          const formattedOffers = offers.map(offer => ({
            ...offer,
            providerName: `${offer.providerFirstName || ''} ${offer.providerLastName || ''}`.trim(),
          }));

          // Calculate offer metrics
          const totalOffered = offers.length;
          const totalAccepted = offers.filter(offer => offer.status === 'purchased').length;
          const totalPending = offers.filter(offer => offer.status === 'pending').length;
          const totalExpired = offers.filter(offer => offer.status === 'expired').length;

          const offerMetrics = {
            totalOffered,
            totalAccepted,
            totalPending,
            totalExpired
          };

          // Get notes for this lead
          const notes = await this.getLeadNotes(request.id);

          // Calculate proper lead status based on business rules
          let leadStatus = request.status;
          const purchasedOffers = offers.filter(offer => offer.status === 'purchased');
          const uniqueOfferPurchased = purchasedOffers.some(offer => offer.offerType === 'unique');
          const sharedOffersPurchased = purchasedOffers.filter(offer => offer.offerType === 'shared').length;
          
          // Check if job date has passed (expired)
          const now = new Date();
          const jobDate = request.preferredDate ? new Date(request.preferredDate) : null;
          if (jobDate && now > jobDate) {
            leadStatus = 'expired';
          }
          // Check if should be assigned
          else if (uniqueOfferPurchased || sharedOffersPurchased >= 3) {
            leadStatus = 'assigned';
          }
          // Otherwise remains active
          else {
            leadStatus = 'active';
          }

          return {
            ...request,
            status: leadStatus, // Use calculated status
            customerName: `${request.customerFirstName || ''} ${request.customerLastName || ''}`.trim(),
            customerPhone: request.customerPhoneNumber || '',
            // Add computed location and state from postcode/suburb
            location: `${request.suburb || ''}, ${request.postcode || ''}`,
            state: 'NSW', // Default state for now
            leadOffers: formattedOffers,
            offerMetrics,
            notes: notes,
            // Keep legacy field for backward compatibility
            leadAssignments: formattedOffers.map(offer => ({
              id: offer.id,
              providerId: offer.providerId,
              providerName: offer.providerName,
              status: offer.status === 'purchased' ? 'accepted' : offer.status,
              assignedAt: offer.createdAt
            }))
          };
        })
      );

      return requestsWithOffers;
    } catch (error) {
      console.error('Error fetching leads with metrics:', error);
      throw error;
    }
  }

  // Service provider operations
  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    const [serviceProvider] = await db
      .insert(serviceProviders)
      .values(provider)
      .returning();
    return serviceProvider;
  }

  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider;
  }

  async getServiceProviderById(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider;
  }

  async getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.email, email));
    return provider;
  }

  async updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider> {
    const [provider] = await db
      .update(serviceProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id))
      .returning();
    return provider;
  }

  async updateProviderStatus(id: number, providerStatus: string): Promise<void> {
    await db
      .update(serviceProviders)
      .set({ providerStatus, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id));
  }

  async getServiceProvidersByStatus(status: string): Promise<ServiceProvider[]> {
    return await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.status, status))
      .orderBy(desc(serviceProviders.createdAt));
  }

  // Service category operations
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.active, true))
      .orderBy(asc(serviceCategories.name));
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [serviceCategory] = await db
      .insert(serviceCategories)
      .values(category)
      .returning();
    return serviceCategory;
  }

  // Provider service operations
  async addProviderService(providerService: InsertProviderService): Promise<void> {
    await db.insert(providerServices).values(providerService);
  }

  async replaceProviderServices(providerId: number, categoryIds: number[]): Promise<void> {
    // First, delete all existing services for this provider
    await db.delete(providerServices).where(eq(providerServices.providerId, providerId));
    
    // Then, add the new services
    if (categoryIds.length > 0) {
      const newServices = categoryIds.map(categoryId => ({
        providerId,
        categoryId,
      }));
      await db.insert(providerServices).values(newServices);
    }
  }

  async getProviderServices(providerId: number): Promise<any[]> {
    const services = await db
      .select({
        id: providerServices.id,
        categoryId: providerServices.categoryId,
        name: serviceCategories.name,
        icon: serviceCategories.icon,
      })
      .from(providerServices)
      .innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id))
      .where(eq(providerServices.providerId, providerId));
    return services;
  }

  // Location operations
  async getAustralianStates(): Promise<AustralianState[]> {
    return await db
      .select()
      .from(australianStates)
      .orderBy(asc(australianStates.name));
  }

  async getSuburbsByPostcode(postcode: string): Promise<AustralianSuburb[]> {
    return await db
      .select()
      .from(australianSuburbs)
      .where(eq(australianSuburbs.postcode, postcode))
      .orderBy(asc(australianSuburbs.suburb));
  }



  // New location-based service area methods
  async addProviderLocationServiceArea(serviceAreaData: {
    providerId: number;
    centerAddress: string;
    centerLat?: string;
    centerLng?: string;
    radiusKm: number;
    areaName?: string;
  }): Promise<ProviderServiceArea> {
    const [result] = await db
      .insert(providerServiceAreas)
      .values(serviceAreaData)
      .returning();
    return result;
  }

  async getProviderLocationServiceAreas(providerId: number): Promise<ProviderServiceArea[]> {
    return await db
      .select()
      .from(providerServiceAreas)
      .where(
        and(
          eq(providerServiceAreas.providerId, providerId),
          isNotNull(providerServiceAreas.centerAddress) // Only get location-based service areas
        )
      );
  }

  async deleteProviderLocationServiceArea(providerId: number, areaId: number): Promise<void> {
    await db
      .delete(providerServiceAreas)
      .where(and(
        eq(providerServiceAreas.providerId, providerId),
        eq(providerServiceAreas.id, areaId)
      ));
  }

  async getServiceAreaById(areaId: number): Promise<ProviderServiceArea | undefined> {
    const [serviceArea] = await db
      .select()
      .from(providerServiceAreas)
      .where(eq(providerServiceAreas.id, areaId));
    return serviceArea;
  }

  async getProviderServiceAreas(providerId: number): Promise<AustralianSuburb[]> {
    return await db
      .select({
        id: australianSuburbs.id,
        postcode: australianSuburbs.postcode,
        suburb: australianSuburbs.suburb,
        stateId: australianSuburbs.stateId,
        regionId: australianSuburbs.regionId,
      })
      .from(providerServiceAreas)
      .innerJoin(australianSuburbs, eq(providerServiceAreas.suburbId, australianSuburbs.id))
      .where(eq(providerServiceAreas.providerId, providerId));
  }

  async getRegionsByStateId(stateId: number): Promise<AustralianRegion[]> {
    return await db
      .select()
      .from(australianRegions)
      .where(eq(australianRegions.stateId, stateId))
      .orderBy(asc(australianRegions.name));
  }

  async getAllRegions(): Promise<AustralianRegion[]> {
    return await db
      .select()
      .from(australianRegions)
      .orderBy(asc(australianRegions.name));
  }

  async getSuburbsByRegion(regionId: number): Promise<AustralianSuburb[]> {
    return await db
      .select()
      .from(australianSuburbs)
      .where(eq(australianSuburbs.regionId, regionId))
      .orderBy(asc(australianSuburbs.suburb));
  }

  // Document operations
  async uploadProviderDocument(document: InsertProviderDocument): Promise<ProviderDocument> {
    const [doc] = await db
      .insert(providerDocuments)
      .values(document)
      .returning();
    return doc;
  }

  async getProviderDocuments(providerId: number): Promise<ProviderDocument[]> {
    return await db
      .select()
      .from(providerDocuments)
      .where(eq(providerDocuments.providerId, providerId))
      .orderBy(desc(providerDocuments.uploadedAt));
  }

  async getProviderDocument(id: number): Promise<ProviderDocument | undefined> {
    const [document] = await db
      .select()
      .from(providerDocuments)
      .where(eq(providerDocuments.id, id));
    return document;
  }

  async updateDocumentStatus(id: number, status: string): Promise<void> {
    await db
      .update(providerDocuments)
      .set({ status })
      .where(eq(providerDocuments.id, id));
  }

  // Service request operations
  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [serviceRequest] = await db
      .insert(serviceRequests)
      .values(request)
      .returning();
    
    // Automatically start lead distribution for the new request
    try {
      console.log(`Starting automatic lead distribution for request ${serviceRequest.id}`);
      await this.initializeLeadDistribution(serviceRequest.id);
      console.log(`Lead distribution initialized successfully for request ${serviceRequest.id}`);
    } catch (error) {
      console.error(`Error initializing lead distribution for request ${serviceRequest.id}:`, error);
      // Don't throw error - the service request was created successfully
      // Lead distribution will be retried by the background processor
    }
    
    return serviceRequest;
  }

  async getServiceRequests(customerId?: string): Promise<ServiceRequest[]> {
    const query = db.select().from(serviceRequests);
    
    if (customerId) {
      return await query
        .where(eq(serviceRequests.customerId, customerId))
        .orderBy(desc(serviceRequests.createdAt));
    }
    
    return await query.orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByArea(postcode: string, categoryId: number): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .where(
        and(
          eq(serviceRequests.postcode, postcode),
          eq(serviceRequests.categoryId, categoryId),
          eq(serviceRequests.status, "active")
        )
      )
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return request;
  }

  async updateServiceRequestStatus(id: number, status: string): Promise<void> {
    await db
      .update(serviceRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id));
  }

  // Lead assignment operations
  async createLeadAssignment(assignment: InsertLeadAssignment): Promise<LeadAssignment> {
    const [leadAssignment] = await db
      .insert(leadAssignments)
      .values(assignment)
      .returning();
    return leadAssignment;
  }

  async findProvidersInArea(postcode: string, categoryId: number): Promise<ServiceProvider[]> {
    // Find all providers who service the given postcode and category
    return await db
      .select()
      .from(serviceProviders)
      .innerJoin(providerServices, eq(serviceProviders.id, providerServices.providerId))
      .innerJoin(providerServiceAreas, eq(serviceProviders.id, providerServiceAreas.providerId))
      .innerJoin(australianSuburbs, eq(providerServiceAreas.suburbId, australianSuburbs.id))
      .where(
        and(
          eq(providerServices.categoryId, categoryId),
          eq(australianSuburbs.postcode, postcode),
          eq(serviceProviders.status, "approved")
        )
      )
      .groupBy(serviceProviders.id);
  }

  async createLeadsForRequest(requestId: number, postcode: string, categoryId: number): Promise<LeadAssignment[]> {
    // Find all eligible providers
    const providers = await this.findProvidersInArea(postcode, categoryId);
    
    // Create lead assignments for each provider
    const leads: LeadAssignment[] = [];
    for (const provider of providers) {
      const lead = await this.createLeadAssignment({
        requestId,
        providerId: provider.id,
        status: "pending",
      });
      leads.push(lead);
    }
    
    return leads;
  }

  async getProviderLeads(providerId: number, status?: string): Promise<LeadAssignment[]> {
    const query = db.select().from(leadAssignments);
    
    if (status) {
      return await query
        .where(
          and(
            eq(leadAssignments.providerId, providerId),
            eq(leadAssignments.status, status)
          )
        )
        .orderBy(desc(leadAssignments.createdAt));
    }
    
    return await query
      .where(eq(leadAssignments.providerId, providerId))
      .orderBy(desc(leadAssignments.createdAt));
  }

  async updateLeadStatus(id: number, status: string): Promise<void> {
    const updates: any = { status };
    
    if (status === "accepted") {
      updates.acceptedAt = new Date();
    } else if (status === "declined") {
      updates.declinedAt = new Date();
    }
    
    await db
      .update(leadAssignments)
      .set(updates)
      .where(eq(leadAssignments.id, id));
  }

  // Email operations
  async createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const [emailTemplate] = await db
      .insert(emailTemplates)
      .values(template)
      .returning();
    return emailTemplate;
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.isActive, true))
      .orderBy(asc(emailTemplates.name));
  }

  async logSentEmail(email: InsertSentEmail): Promise<SentEmail> {
    const [sentEmail] = await db
      .insert(sentEmails)
      .values(email)
      .returning();
    return sentEmail;
  }

  // Activity logging
  async logUserActivity(log: InsertUserActivityLog): Promise<UserActivityLog> {
    const [activityLog] = await db
      .insert(userActivityLogs)
      .values(log)
      .returning();
    return activityLog;
  }

  // System settings
  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key));
    return setting;
  }

  async updateSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting> {
    const [systemSetting] = await db
      .insert(systemSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: setting.value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return systemSetting;
  }

  // Admin-specific methods
  async getServiceProviderCount(status?: string): Promise<number> {
    const query = db.select().from(serviceProviders);
    
    if (status) {
      const result = await query.where(eq(serviceProviders.status, status));
      return result.length;
    }
    
    const result = await query;
    return result.length;
  }

  async getUserCount(): Promise<number> {
    const result = await db.select().from(users);
    return result.length;
  }

  async getServiceRequestCount(status?: string): Promise<number> {
    const query = db.select().from(serviceRequests);
    
    if (status) {
      const result = await query.where(eq(serviceRequests.status, status));
      return result.length;
    }
    
    const result = await query;
    return result.length;
  }

  async getServiceProvidersForAdmin(status?: string): Promise<any[]> {
    // Get all providers first
    let providers;
    if (status) {
      providers = await db
        .select()
        .from(serviceProviders)
        .where(eq(serviceProviders.status, status))
        .orderBy(desc(serviceProviders.createdAt));
    } else {
      providers = await db
        .select()
        .from(serviceProviders)
        .orderBy(desc(serviceProviders.createdAt));
    }

    // Get services for each provider
    const providersWithServices = await Promise.all(
      providers.map(async (provider) => {
        const services = await db
          .select({
            id: providerServices.id,
            categoryId: providerServices.categoryId,
            categoryName: serviceCategories.name,
            categoryIcon: serviceCategories.icon,
          })
          .from(providerServices)
          .innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id))
          .where(eq(providerServices.providerId, provider.id));

        return {
          ...provider,
          services: services,
        };
      })
    );

    return providersWithServices;
  }

  async updateServiceProviderStatus(id: number, status: string): Promise<void> {
    await db
      .update(serviceProviders)
      .set({ status, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id));
  }

  // Get detailed provider information for admin review
  async getProviderDetailsForAdmin(providerId: number): Promise<any> {
    // Get basic provider info
    const provider = await this.getServiceProvider(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    // Get provider services with category names
    const services = await db
      .select({
        id: providerServices.id,
        categoryId: providerServices.categoryId,
        name: serviceCategories.name,
        categoryName: serviceCategories.name,
      })
      .from(providerServices)
      .innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id))
      .where(eq(providerServices.providerId, providerId));

    // Get service areas
    const serviceAreas = await db
      .select()
      .from(providerServiceAreas)
      .where(eq(providerServiceAreas.providerId, providerId));

    // Get documents
    const documents = await db
      .select()
      .from(providerDocuments)
      .where(eq(providerDocuments.providerId, providerId))
      .orderBy(desc(providerDocuments.uploadedAt));

    return {
      ...provider,
      services,
      serviceAreas,
      documents,
    };
  }

  // Add service area for provider (admin function)
  async addProviderServiceArea(serviceAreaData: {
    providerId: number;
    centerAddress: string;
    radiusKm: number;
    areaName?: string | null;
  }): Promise<ProviderServiceArea> {
    const [result] = await db
      .insert(providerServiceAreas)
      .values(serviceAreaData)
      .returning();
    return result;
  }

  // Remove service area (admin function)
  async removeProviderServiceArea(areaId: number): Promise<void> {
    await db
      .delete(providerServiceAreas)
      .where(eq(providerServiceAreas.id, areaId));
  }

  // Update provider admin-specific fields
  async updateProviderAdminFields(providerId: number, fields: {
    adminNotes?: string;
    insuranceExpiryDate?: Date | null;
  }): Promise<void> {
    await db
      .update(serviceProviders)
      .set({ 
        ...fields,
        updatedAt: new Date() 
      })
      .where(eq(serviceProviders.id, providerId));
  }

  async getAllServiceRequestsForAdmin(): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));
  }

  // Payment operations
  async getProviderPaymentMethods(providerId: number): Promise<ProviderPaymentMethod[]> {
    return await db
      .select()
      .from(providerPaymentMethods)
      .where(and(
        eq(providerPaymentMethods.providerId, providerId),
        eq(providerPaymentMethods.isActive, true)
      ))
      .orderBy(desc(providerPaymentMethods.isPrimary), desc(providerPaymentMethods.createdAt));
  }

  async addProviderPaymentMethod(paymentMethod: InsertProviderPaymentMethod): Promise<ProviderPaymentMethod> {
    const [newPaymentMethod] = await db
      .insert(providerPaymentMethods)
      .values(paymentMethod)
      .returning();
    return newPaymentMethod;
  }

  async updateProviderPaymentMethodPrimary(providerId: number, paymentMethodId: number): Promise<void> {
    // First, set all payment methods for this provider to non-primary
    await db
      .update(providerPaymentMethods)
      .set({ isPrimary: false, updatedAt: new Date() })
      .where(eq(providerPaymentMethods.providerId, providerId));

    // Then set the specified payment method as primary
    await db
      .update(providerPaymentMethods)
      .set({ isPrimary: true, updatedAt: new Date() })
      .where(eq(providerPaymentMethods.id, paymentMethodId));
  }

  async deleteProviderPaymentMethod(paymentMethodId: number): Promise<void> {
    await db
      .update(providerPaymentMethods)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(providerPaymentMethods.id, paymentMethodId));
  }

  // Admin settings operations
  async getAdminSettings(): Promise<{ stripeConfigured: boolean; mailgunConfigured: boolean }> {
    const stripeSecretKey = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'stripe_secret_key'))
      .limit(1);
    
    const stripePublicKey = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'stripe_public_key'))
      .limit(1);

    const mailgunApiKey = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'mailgun_api_key'))
      .limit(1);
    
    const mailgunDomain = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'mailgun_domain'))
      .limit(1);

    const mailgunDomainSendingKey = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'mailgun_domain_sending_key'))
      .limit(1);

    return {
      stripeConfigured: stripeSecretKey.length > 0 && stripePublicKey.length > 0,
      mailgunConfigured: mailgunApiKey.length > 0 && mailgunDomain.length > 0 && mailgunDomainSendingKey.length > 0
    };
  }

  async updateAdminSetting(key: string, value: string): Promise<void> {
    console.log(`[updateAdminSetting] Setting ${key} with value length: ${value.length}`);
    const encryptedValue = this.encrypt(value);
    console.log(`[updateAdminSetting] Encrypted value length: ${encryptedValue.length}`);
    
    const result = await db
      .insert(systemSettings)
      .values({
        key,
        value: encryptedValue,
        description: `Encrypted ${key} setting`,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: encryptedValue,
          updatedAt: new Date()
        }
      })
      .returning();
    
    console.log(`[updateAdminSetting] Database result for ${key}:`, result.length > 0 ? 'Success' : 'Failed');
  }

  async getDecryptedSetting(key: string): Promise<string | null> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key))
      .limit(1);

    if (!setting || !setting.value) {
      return null;
    }

    try {
      return this.decrypt(setting.value);
    } catch (error) {
      console.error(`Failed to decrypt setting ${key}:`, error);
      return null;
    }
  }

  async removeProviderPaymentMethod(providerId: number, paymentMethodId: number): Promise<void> {
    await db
      .delete(providerPaymentMethods)
      .where(
        and(
          eq(providerPaymentMethods.providerId, providerId),
          eq(providerPaymentMethods.id, paymentMethodId)
        )
      );
  }

  async updateProviderStripeCustomerId(providerId: number, stripeCustomerId: string): Promise<void> {
    await db
      .update(serviceProviders)
      .set({ 
        stripeCustomerId,
        updatedAt: new Date()
      })
      .where(eq(serviceProviders.id, providerId));
  }

  async getDecryptedStripeKeys(): Promise<{ secretKey: string; publicKey: string } | null> {
    try {
      const secretKey = await this.getDecryptedSetting('stripe_secret_key');
      const publicKey = await this.getDecryptedSetting('stripe_public_key');
      
      if (!secretKey || !publicKey) {
        return null;
      }
      
      return { secretKey, publicKey };
    } catch (error) {
      console.error('Failed to get Stripe keys:', error);
      return null;
    }
  }

  async getDecryptedMailgunKeys(): Promise<{ apiKey: string; domain: string; domainSendingKey: string } | null> {
    try {
      const apiKey = await this.getDecryptedSetting('mailgun_api_key');
      const domain = await this.getDecryptedSetting('mailgun_domain');
      const domainSendingKey = await this.getDecryptedSetting('mailgun_domain_sending_key');
      
      if (!apiKey || !domain || !domainSendingKey) {
        return null;
      }
      
      return { apiKey, domain, domainSendingKey };
    } catch (error) {
      console.error('Failed to get Mailgun keys:', error);
      return null;
    }
  }

  // Password reset operations
  async createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [resetToken] = await db
      .insert(passwordResetTokens)
      .values(token)
      .returning();
    return resetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return resetToken;
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.token, token));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Provider password reset operations
  async createProviderPasswordResetToken(token: InsertProviderPasswordResetToken): Promise<ProviderPasswordResetToken> {
    const [resetToken] = await db
      .insert(providerPasswordResetTokens)
      .values(token)
      .returning();
    return resetToken;
  }

  async getProviderPasswordResetToken(token: string): Promise<ProviderPasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(providerPasswordResetTokens)
      .where(eq(providerPasswordResetTokens.token, token));
    return resetToken;
  }

  async markProviderTokenAsUsed(token: string): Promise<void> {
    await db
      .update(providerPasswordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(providerPasswordResetTokens.token, token));
  }

  async updateProviderPassword(providerId: number, hashedPassword: string): Promise<ServiceProvider> {
    const [provider] = await db
      .update(serviceProviders)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(serviceProviders.id, providerId))
      .returning();
    return provider;
  }

  // Activity logging methods
  async logProviderActivity(activity: InsertProviderActivityLog): Promise<void> {
    await db.insert(providerActivityLogs).values(activity);
  }

  async getProviderActivityLogs(providerId: number, actorType?: 'admin' | 'provider'): Promise<ProviderActivityLog[]> {
    const conditions = [eq(providerActivityLogs.providerId, providerId)];
    
    if (actorType) {
      conditions.push(eq(providerActivityLogs.actorType, actorType));
    }

    return await db
      .select()
      .from(providerActivityLogs)
      .where(and(...conditions))
      .orderBy(desc(providerActivityLogs.timestamp));
  }

  // Lead management settings methods
  async getLeadSettings(): Promise<any> {
    try {
      const [settings] = await db.select().from(leadSettings).limit(1);
      if (settings) {
        // Convert decimal strings to numbers
        return {
          ...settings,
          uniformUniquePrice: parseFloat(settings.uniformUniquePrice || '25.00'),
          uniformSharePrice: parseFloat(settings.uniformSharePrice || '12.00'),
          minProviderRating: parseFloat(settings.minProviderRating || '3.0'),
        };
      }
      
      // Return default settings if none exist
      return {
        id: 1,
        pricingModel: 'uniform',
        uniformUniquePrice: 25.00,
        uniformSharePrice: 12.00,
        uniqueOfferWindow: 2,
        maxProvidersPerArea: 10,
        minProviderRating: 3.0,
        providerRestrictionsActive: false,
        firstThreeLeadBehavior: 'shared',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error fetching lead settings:', error);
      // Return default settings on error
      return {
        id: 1,
        pricingModel: 'uniform',
        uniformUniquePrice: 25.00,
        uniformSharePrice: 12.00,
        uniqueOfferWindow: 2,
        maxProvidersPerArea: 10,
        minProviderRating: 3.0,
        providerRestrictionsActive: false,
        firstThreeLeadBehavior: 'shared',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async upsertLeadSettings(settings: any): Promise<any> {
    try {
      const settingsData = {
        pricingModel: settings.pricingModel || 'uniform',
        uniformUniquePrice: settings.uniformUniquePrice?.toString() || '25.00',
        uniformSharePrice: settings.uniformSharePrice?.toString() || '12.00',
        uniqueOfferWindow: settings.uniqueOfferWindow || 2,
        maxProvidersPerArea: settings.maxProvidersPerArea || 10,
        minProviderRating: settings.minProviderRating?.toString() || '3.0',
        providerRestrictionsActive: settings.providerRestrictionsActive || false,
        firstThreeLeadBehavior: settings.firstThreeLeadBehavior || 'shared',
        updatedAt: new Date(),
      };

      // Check if settings exist
      const [existingSettings] = await db.select().from(leadSettings).limit(1);
      
      let result;
      if (existingSettings) {
        // Update existing settings
        [result] = await db
          .update(leadSettings)
          .set(settingsData)
          .where(eq(leadSettings.id, existingSettings.id))
          .returning();
      } else {
        // Insert new settings
        [result] = await db
          .insert(leadSettings)
          .values(settingsData)
          .returning();
      }

      // Handle category pricing if provided
      if (settings.categoryPricing && Array.isArray(settings.categoryPricing)) {
        await this.upsertCategoryPricing(settings.categoryPricing);
      }

      return {
        ...result,
        uniformUniquePrice: parseFloat(result.uniformUniquePrice || '25.00'),
        uniformSharePrice: parseFloat(result.uniformSharePrice || '12.00'),
        minProviderRating: parseFloat(result.minProviderRating || '3.0'),
      };
    } catch (error) {
      console.error('Error upserting lead settings:', error);
      throw error;
    }
  }

  async getCategoryLeadPricing(): Promise<any[]> {
    try {
      const categoryPricing = await db
        .select({
          id: categoryLeadPricing.id,
          categoryId: categoryLeadPricing.categoryId,
          categoryName: serviceCategories.name,
          uniquePrice: categoryLeadPricing.uniquePrice,
          sharePrice: categoryLeadPricing.sharePrice,
          hasCustomPrice: sql<boolean>`true`.as('hasCustomPrice'),
          createdAt: categoryLeadPricing.createdAt,
          updatedAt: categoryLeadPricing.updatedAt,
        })
        .from(categoryLeadPricing)
        .leftJoin(serviceCategories, eq(categoryLeadPricing.categoryId, serviceCategories.id))
        .orderBy(serviceCategories.name);

      return categoryPricing.map(item => ({
        ...item,
        uniquePrice: parseFloat(item.uniquePrice || '25.00'),
        sharePrice: parseFloat(item.sharePrice || '12.00'),
      }));
    } catch (error) {
      console.error('Error fetching category lead pricing:', error);
      return [];
    }
  }

  async upsertCategoryPricing(categoryPricingData: any[]): Promise<void> {
    try {
      for (const category of categoryPricingData) {
        if (category.hasCustomPrice) {
          // Upsert category with custom pricing
          await db
            .insert(categoryLeadPricing)
            .values({
              categoryId: category.categoryId,
              uniquePrice: category.uniquePrice?.toString() || '25.00',
              sharePrice: category.sharePrice?.toString() || '12.00',
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: categoryLeadPricing.categoryId,
              set: {
                uniquePrice: category.uniquePrice?.toString() || '25.00',
                sharePrice: category.sharePrice?.toString() || '12.00',
                updatedAt: new Date(),
              },
            });
        } else {
          // Remove custom pricing if disabled
          await db
            .delete(categoryLeadPricing)
            .where(eq(categoryLeadPricing.categoryId, category.categoryId));
        }
      }
    } catch (error) {
      console.error('Error upserting category pricing:', error);
      throw error;
    }
  }

  // Lead notes operations
  async addLeadNote(leadId: number, note: string, adminName: string): Promise<LeadNote> {
    const [newNote] = await db
      .insert(leadNotes)
      .values({
        leadId,
        note,
        adminName,
      })
      .returning();
    return newNote;
  }

  async getLeadNotes(leadId: number): Promise<LeadNote[]> {
    const notes = await db
      .select()
      .from(leadNotes)
      .where(eq(leadNotes.leadId, leadId))
      .orderBy(desc(leadNotes.createdAt));
    return notes;
  }

  // Lead Sharing System Methods
  async initializeLeadDistribution(requestId: number): Promise<void> {
    try {
      const request = await this.getServiceRequest(requestId);
      if (!request) throw new Error('Service request not found');

      // Find eligible providers based on service category and service areas
      const eligibleProviders = await this.getEligibleProviders(request.categoryId, request.postcode);
      
      if (eligibleProviders.length === 0) {
        console.log(`No eligible providers found for request ${requestId}`);
        return;
      }

      // Create distribution log
      await db
        .insert(leadDistributionLog)
        .values({
          requestId,
          distributionPhase: 'unique',
          totalEligibleProviders: eligibleProviders.length,
          isActive: true,
        });

      // Create lead offers for all eligible providers (rating-based order)
      const leadSettings = await this.getLeadSettings();
      const leadCost = await this.getLeadCost(request.categoryId, 'unique');

      for (let i = 0; i < eligibleProviders.length; i++) {
        const provider = eligibleProviders[i];
        await db.insert(leadOffers).values({
          requestId,
          providerId: provider.providerId,
          offerType: 'unique',
          leadCost: leadCost.toString(),
          status: 'pending',
          sortOrder: i,
          // Don't set expiresAt here - will be set when offer becomes active
          expiresAt: null,
        });
      }

      // Start the first offer
      await this.activateNextUniqueOffer(requestId);
    } catch (error) {
      console.error('Error initializing lead distribution:', error);
      throw error;
    }
  }

  async getEligibleProviders(categoryId: number, postcode: string): Promise<Array<{providerId: number, rating: number, firstName: string, lastName: string}>> {
    try {
      // Get providers who offer this service category, are approved/activated, and cover this postcode
      const eligibleProviders = await db
        .select({
          providerId: serviceProviders.id,
          rating: providerRatings.rating,
          firstName: serviceProviders.firstName,
          lastName: serviceProviders.lastName,
          totalReviews: providerRatings.totalReviews,
          averageResponseTime: providerRatings.averageResponseTime,
        })
        .from(serviceProviders)
        .innerJoin(providerServices, eq(serviceProviders.id, providerServices.providerId))
        .innerJoin(providerRatings, eq(serviceProviders.id, providerRatings.providerId))
        .innerJoin(providerPostcodeCoverage, eq(serviceProviders.id, providerPostcodeCoverage.providerId))
        .where(
          and(
            eq(providerServices.categoryId, categoryId),
            eq(serviceProviders.status, 'approved'),
            eq(serviceProviders.providerStatus, 'activated'),
            eq(providerPostcodeCoverage.postcode, postcode)
          )
        )
        .orderBy(
          desc(providerRatings.rating),
          desc(providerRatings.totalReviews),
          asc(providerRatings.averageResponseTime)
        );

      return eligibleProviders.map(p => ({
        providerId: p.providerId,
        rating: parseFloat(p.rating?.toString() || '5.0'),
        firstName: p.firstName,
        lastName: p.lastName,
      }));
    } catch (error) {
      console.error('Error getting eligible providers:', error);
      return [];
    }
  }

  // Calculate and store postcode coverage when provider adds/updates service area
  async calculateServiceAreaCoverage(serviceAreaId: number): Promise<void> {
    try {
      const serviceArea = await db
        .select()
        .from(providerServiceAreas)
        .where(eq(providerServiceAreas.id, serviceAreaId))
        .limit(1);

      if (!serviceArea.length || !serviceArea[0].centerAddress) {
        console.log(`Service area ${serviceAreaId} not found or no center address`);
        return;
      }

      const area = serviceArea[0];
      console.log(`Calculating postcode coverage for provider ${area.providerId}, service area ${serviceAreaId}`);

      // For now, use a simplified approach - get all postcodes in Australia
      // and check if they're within the radius (this would be replaced with actual Google API calls)
      const allPostcodes = await db
        .select({
          postcode: australianSuburbs.postcode,
        })
        .from(australianSuburbs)
        .groupBy(australianSuburbs.postcode);

      // Clear existing coverage for this service area
      await db
        .delete(providerPostcodeCoverage)
        .where(eq(providerPostcodeCoverage.serviceAreaId, serviceAreaId));

      // For testing purposes, let's assume providers cover nearby postcodes
      // In production, this would use Google Maps Distance Matrix API
      const coveredPostcodes = this.getCoveredPostcodesForServiceArea(area);

      // Insert coverage records
      for (const postcode of coveredPostcodes) {
        await db.insert(providerPostcodeCoverage).values({
          providerId: area.providerId,
          serviceAreaId: serviceAreaId,
          postcode: postcode,
          distance: 10.5, // Placeholder distance
        });
      }

      console.log(`Stored coverage for ${coveredPostcodes.length} postcodes for service area ${serviceAreaId}`);
    } catch (error) {
      console.error('Error calculating service area coverage:', error);
    }
  }

  // Simplified coverage calculation - in production, would use Google Maps API
  private getCoveredPostcodesForServiceArea(area: any): string[] {
    // For testing, let's say Hope Island (4212) covers Gold Coast area postcodes
    if (area.centerAddress?.includes('Hope Island')) {
      return ['4212', '4215', '4216', '4217', '4218', '4220', '4221'];
    }
    // Bundall covers similar Gold Coast postcodes
    if (area.centerAddress?.includes('Bundall')) {
      return ['4215', '4216', '4217', '4218', '4220', '4221', '4223'];
    }
    // Default coverage for other areas
    return ['4215', '4216', '4217'];
  }

  async getLeadCost(categoryId: number, offerType: 'unique' | 'shared'): Promise<number> {
    try {
      // Check for category-specific pricing
      const [categoryPricing] = await db
        .select()
        .from(categoryLeadPricing)
        .where(eq(categoryLeadPricing.categoryId, categoryId))
        .limit(1);

      if (categoryPricing) {
        return parseFloat(offerType === 'unique' ? categoryPricing.uniquePrice : categoryPricing.sharePrice);
      }

      // Use uniform pricing
      const settings = await this.getLeadSettings();
      return offerType === 'unique' ? settings.uniformUniquePrice : settings.uniformSharePrice;
    } catch (error) {
      console.error('Error getting lead cost:', error);
      return offerType === 'unique' ? 25.00 : 12.00;
    }
  }

  async activateNextUniqueOffer(requestId: number): Promise<void> {
    try {
      // Deactivate current offers
      await db
        .update(leadOffers)
        .set({ isCurrentOffer: false })
        .where(eq(leadOffers.requestId, requestId));

      // Find next pending unique offer
      const [nextOffer] = await db
        .select()
        .from(leadOffers)
        .where(
          and(
            eq(leadOffers.requestId, requestId),
            eq(leadOffers.offerType, 'unique'),
            eq(leadOffers.status, 'pending')
          )
        )
        .orderBy(asc(leadOffers.sortOrder))
        .limit(1);

      if (!nextOffer) {
        // No more unique offers, move to shared phase
        await this.startSharedPhase(requestId);
        return;
      }

      // Activate next offer
      const leadSettings = await this.getLeadSettings();
      const offerStartTime = new Date();
      const offerEndTime = new Date(Date.now() + leadSettings.uniqueOfferWindow * 60 * 1000);

      await db
        .update(leadOffers)
        .set({
          isCurrentOffer: true,
          offerStartTime,
          offerEndTime,
          expiresAt: offerEndTime, // Set proper expiration time when activated
        })
        .where(eq(leadOffers.id, nextOffer.id));

      // Update distribution log
      await db
        .update(leadDistributionLog)
        .set({
          currentOfferProviderId: nextOffer.providerId,
          currentOfferEndTime: offerEndTime,
        })
        .where(
          and(
            eq(leadDistributionLog.requestId, requestId),
            eq(leadDistributionLog.isActive, true)
          )
        );

      console.log(`Activated unique offer for provider ${nextOffer.providerId}, expires at ${offerEndTime}`);
    } catch (error) {
      console.error('Error activating next unique offer:', error);
      throw error;
    }
  }

  async startSharedPhase(requestId: number): Promise<void> {
    try {
      // Get all providers who had unique offers BUT did NOT purchase them
      const eligibleProviders = await db
        .select({
          providerId: leadOffers.providerId,
        })
        .from(leadOffers)
        .where(
          and(
            eq(leadOffers.requestId, requestId),
            eq(leadOffers.offerType, 'unique'),
            ne(leadOffers.status, 'purchased') // Exclude providers who purchased unique offers
          )
        )
        .groupBy(leadOffers.providerId);

      const leadCost = await this.getLeadCost(
        (await this.getServiceRequest(requestId))?.categoryId || 1,
        'shared'
      );

      // Create shared offers only for providers who didn't purchase unique offers
      const offerStartTime = new Date();
      for (const provider of eligibleProviders) {
        await db.insert(leadOffers).values({
          requestId,
          providerId: provider.providerId,
          offerType: 'shared',
          leadCost: leadCost.toString(),
          status: 'pending',
          isCurrentOffer: true,
          offerStartTime,
          // Shared offers don't expire individually - only expire 24 hours before job date
          expiresAt: null,
        });
      }

      // Update distribution log to shared phase
      await db
        .update(leadDistributionLog)
        .set({
          distributionPhase: 'shared',
          phaseStartTime: new Date(),
          currentOfferProviderId: null,
          currentOfferEndTime: null,
        })
        .where(
          and(
            eq(leadDistributionLog.requestId, requestId),
            eq(leadDistributionLog.isActive, true)
          )
        );

      console.log(`Started shared phase for request ${requestId}`);
    } catch (error) {
      console.error('Error starting shared phase:', error);
      throw error;
    }
  }

  async purchaseLead(requestId: number, providerId: number): Promise<{success: boolean, message: string}> {
    try {
      // Find active offer for this provider
      const [offer] = await db
        .select()
        .from(leadOffers)
        .where(
          and(
            eq(leadOffers.requestId, requestId),
            eq(leadOffers.providerId, providerId),
            eq(leadOffers.status, 'pending'),
            eq(leadOffers.isCurrentOffer, true)
          )
        )
        .limit(1);

      if (!offer) {
        return { success: false, message: 'No active offer found for this provider' };
      }

      // Check if offer has expired
      if (offer.expiresAt && new Date() > offer.expiresAt) {
        await db
          .update(leadOffers)
          .set({ status: 'expired', isCurrentOffer: false })
          .where(eq(leadOffers.id, offer.id));
        return { success: false, message: 'Offer has expired' };
      }

      // Mark offer as purchased
      await db
        .update(leadOffers)
        .set({
          status: 'purchased',
          purchasedAt: new Date(),
          isCurrentOffer: false,
        })
        .where(eq(leadOffers.id, offer.id));

      // Check if we need to update service request status to "assigned"
      // This happens when: unique offer purchased OR 3 shared offers purchased
      if (offer.offerType === 'unique') {
        await this.updateServiceRequestStatus(requestId, 'assigned');
      } else {
        // For shared offers, check if this makes it 3 purchased
        const purchasedSharedCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(leadOffers)
          .where(
            and(
              eq(leadOffers.requestId, requestId),
              eq(leadOffers.status, 'purchased'),
              eq(leadOffers.offerType, 'shared')
            )
          );
        
        if (purchasedSharedCount[0]?.count >= 3) {
          await this.updateServiceRequestStatus(requestId, 'assigned');
        }
      }

      if (offer.offerType === 'unique') {
        // For unique offers, move to next provider or shared phase
        await this.activateNextUniqueOffer(requestId);
      } else {
        // For shared offers, check if we've reached the limit
        const [distributionLog] = await db
          .select()
          .from(leadDistributionLog)
          .where(
            and(
              eq(leadDistributionLog.requestId, requestId),
              eq(leadDistributionLog.isActive, true)
            )
          )
          .limit(1);

        if (distributionLog) {
          const newSharedCount = distributionLog.sharedOffersPurchased + 1;
          await db
            .update(leadDistributionLog)
            .set({ sharedOffersPurchased: newSharedCount })
            .where(eq(leadDistributionLog.id, distributionLog.id));

          if (newSharedCount >= distributionLog.maxSharedOffers) {
            // End distribution process
            await this.endLeadDistribution(requestId);
          }
        }
      }

      return { success: true, message: 'Lead purchased successfully' };
    } catch (error) {
      console.error('Error purchasing lead:', error);
      return { success: false, message: 'Failed to purchase lead' };
    }
  }

  async endLeadDistribution(requestId: number): Promise<void> {
    try {
      // Mark all pending offers as expired
      await db
        .update(leadOffers)
        .set({ 
          status: 'expired', 
          isCurrentOffer: false 
        })
        .where(
          and(
            eq(leadOffers.requestId, requestId),
            eq(leadOffers.status, 'pending')
          )
        );

      // Mark distribution log as inactive
      await db
        .update(leadDistributionLog)
        .set({ isActive: false })
        .where(
          and(
            eq(leadDistributionLog.requestId, requestId),
            eq(leadDistributionLog.isActive, true)
          )
        );

      console.log(`Ended lead distribution for request ${requestId}`);
    } catch (error) {
      console.error('Error ending lead distribution:', error);
      throw error;
    }
  }

  // Check for expired offers and advance to next provider
  async processExpiredLeads(): Promise<void> {
    try {
      // 1. First process uninitialized leads (leads that never entered distribution system)
      await this.processUninitializedLeads();
      
      // 2. Then expire leads based on job date
      const now = new Date();
      await db
        .update(serviceRequests)
        .set({ status: 'expired', updatedAt: now })
        .where(
          and(
            or(
              eq(serviceRequests.status, 'active'),
              eq(serviceRequests.status, 'assigned')
            ),
            isNotNull(serviceRequests.preferredDate),
            sql`${serviceRequests.preferredDate} < ${now}`
          )
        );
        
      // 3. Then process expired offers
      await this.processExpiredOffers();
    } catch (error) {
      console.error('Error processing expired leads:', error);
    }
  }

  // Process leads that were created but never entered the distribution system
  async processUninitializedLeads(): Promise<void> {
    try {
      // Find recent active leads (within last 24 hours) that have no distribution log entries
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const uninitializedLeads = await db
        .select({
          id: serviceRequests.id,
          categoryId: serviceRequests.categoryId,
          postcode: serviceRequests.postcode,
          createdAt: serviceRequests.createdAt
        })
        .from(serviceRequests)
        .leftJoin(leadDistributionLog, eq(serviceRequests.id, leadDistributionLog.requestId))
        .where(
          and(
            eq(serviceRequests.status, 'active'),
            isNull(leadDistributionLog.id), // No distribution log entry
            sql`${serviceRequests.createdAt} > ${twentyFourHoursAgo}` // Only recent leads
          )
        );

      for (const lead of uninitializedLeads) {
        try {
          console.log(`Processing uninitialized lead ${lead.id}`);
          await this.initializeLeadDistribution(lead.id);
          console.log(`Successfully initialized lead distribution for lead ${lead.id}`);
        } catch (error) {
          console.error(`Failed to initialize lead distribution for lead ${lead.id}:`, error);
        }
      }
      
      if (uninitializedLeads.length > 0) {
        console.log(`Processed ${uninitializedLeads.length} uninitialized leads`);
      }
    } catch (error) {
      console.error('Error processing uninitialized leads:', error);
    }
  }

  async processExpiredOffers(): Promise<void> {
    try {
      const now = new Date();
      
      // Find expired unique offers that are still marked as current
      // Note: Shared offers don't have individual expiration times - they expire based on job date or purchase limit
      const expiredOffers = await db
        .select()
        .from(leadOffers)
        .where(
          and(
            eq(leadOffers.status, 'pending'),
            eq(leadOffers.isCurrentOffer, true),
            eq(leadOffers.offerType, 'unique'),
            sql`${leadOffers.expiresAt} IS NOT NULL`,
            sql`${leadOffers.expiresAt} <= ${now}`
          )
        );

      for (const expiredOffer of expiredOffers) {
        console.log(`Processing expired offer ${expiredOffer.id} for request ${expiredOffer.requestId}`);
        
        // Mark offer as expired
        await db
          .update(leadOffers)
          .set({ 
            status: 'expired', 
            isCurrentOffer: false 
          })
          .where(eq(leadOffers.id, expiredOffer.id));

        // Move to next provider or shared phase
        await this.activateNextUniqueOffer(expiredOffer.requestId);
      }

      // Separately handle shared offers that have expired due to job date proximity
      await this.processExpiredSharedOffers();
    } catch (error) {
      console.error('Error processing expired offers:', error);
    }
  }

  async processExpiredSharedOffers(): Promise<void> {
    try {
      // Find shared offers for leads where job date is within 24 hours
      const expiredByJobDate = await db
        .select({
          requestId: leadOffers.requestId,
        })
        .from(leadOffers)
        .innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id))
        .where(
          and(
            eq(leadOffers.status, 'pending'),
            eq(leadOffers.offerType, 'shared'),
            sql`${serviceRequests.preferredDate} <= (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
          )
        )
        .groupBy(leadOffers.requestId);

      for (const expired of expiredByJobDate) {
        console.log(`Expiring shared offers for request ${expired.requestId} due to job date proximity`);
        
        // Mark all pending shared offers for this request as expired
        await db
          .update(leadOffers)
          .set({ 
            status: 'expired', 
            isCurrentOffer: false 
          })
          .where(
            and(
              eq(leadOffers.requestId, expired.requestId),
              eq(leadOffers.status, 'pending'),
              eq(leadOffers.offerType, 'shared')
            )
          );

        // End distribution for this request
        await this.endLeadDistribution(expired.requestId);
      }
    } catch (error) {
      console.error('Error processing expired shared offers:', error);
    }
  }

  // Credit system implementation
  async getProviderCreditBalance(providerId: number): Promise<number> {
    try {
      const [provider] = await db
        .select({ creditBalance: serviceProviders.creditBalance })
        .from(serviceProviders)
        .where(eq(serviceProviders.id, providerId));
      
      return parseFloat(provider?.creditBalance || '0');
    } catch (error) {
      console.error('Error getting provider credit balance:', error);
      return 0;
    }
  }

  async addProviderCredit(providerId: number, amount: number, description: string, transactionType: string = 'credit'): Promise<void> {
    try {
      const currentBalance = await this.getProviderCreditBalance(providerId);
      const newBalance = currentBalance + amount;
      
      // Update provider balance
      await db
        .update(serviceProviders)
        .set({ creditBalance: newBalance.toFixed(2) })
        .where(eq(serviceProviders.id, providerId));
      
      // Record transaction
      await db.insert(providerCreditTransactions).values({
        providerId,
        transactionType,
        amount: amount.toFixed(2),
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        description,
      });
      
      console.log(`Added $${amount} credit to provider ${providerId}. New balance: $${newBalance}`);
    } catch (error) {
      console.error('Error adding provider credit:', error);
      throw error;
    }
  }

  async deductProviderCredit(providerId: number, amount: number, description: string, leadOfferId?: number): Promise<boolean> {
    try {
      const currentBalance = await this.getProviderCreditBalance(providerId);
      
      if (currentBalance < amount) {
        console.log(`Insufficient credit for provider ${providerId}. Required: $${amount}, Available: $${currentBalance}`);
        return false;
      }
      
      const newBalance = currentBalance - amount;
      
      // Update provider balance
      await db
        .update(serviceProviders)
        .set({ creditBalance: newBalance.toFixed(2) })
        .where(eq(serviceProviders.id, providerId));
      
      // Record transaction
      await db.insert(providerCreditTransactions).values({
        providerId,
        transactionType: 'debit',
        amount: (-amount).toFixed(2), // Negative for debit
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        description,
        leadOfferId,
      });
      
      console.log(`Deducted $${amount} credit from provider ${providerId}. New balance: $${newBalance}`);
      return true;
    } catch (error) {
      console.error('Error deducting provider credit:', error);
      return false;
    }
  }

  async redeemVoucher(providerId: number, voucherCode: string): Promise<{ success: boolean; message: string; creditAdded?: number }> {
    try {
      // Get voucher details
      const [voucher] = await db
        .select()
        .from(providerVouchers)
        .where(eq(providerVouchers.code, voucherCode));
      
      if (!voucher) {
        return { success: false, message: 'Invalid voucher code' };
      }
      
      if (voucher.status === 'closed') {
        return { success: false, message: 'This voucher has already been redeemed' };
      }
      
      if (voucher.status !== 'active') {
        return { success: false, message: 'This voucher is not available for redemption' };
      }
      
      // Check if provider already used this voucher
      const [existingUsage] = await db
        .select()
        .from(providerCreditTransactions)
        .where(
          and(
            eq(providerCreditTransactions.providerId, providerId),
            eq(providerCreditTransactions.voucherCode, voucherCode)
          )
        );
      
      if (existingUsage) {
        return { success: false, message: 'You have already used this voucher' };
      }
      
      // Add credit to provider
      const creditAmount = parseFloat(voucher.value);
      await this.addProviderCredit(
        providerId, 
        creditAmount, 
        `Voucher redeemed: ${voucherCode} - ${voucher.description}`,
        'voucher_redemption'
      );
      
      // Mark voucher as closed (one-time use)
      await db
        .update(providerVouchers)
        .set({ 
          status: 'closed',
          redeemedBy: providerId,
          redeemedAt: new Date()
        })
        .where(eq(providerVouchers.id, voucher.id));
      
      // Update the transaction record with voucher code
      await db
        .update(providerCreditTransactions)
        .set({ voucherCode })
        .where(
          and(
            eq(providerCreditTransactions.providerId, providerId),
            eq(providerCreditTransactions.transactionType, 'voucher_redemption'),
            isNull(providerCreditTransactions.voucherCode)
          )
        );
      
      return { 
        success: true, 
        message: `Successfully added $${creditAmount} to your account!`,
        creditAdded: creditAmount
      };
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      return { success: false, message: 'Failed to redeem voucher. Please try again.' };
    }
  }

  async getProviderCreditTransactions(providerId: number): Promise<ProviderCreditTransaction[]> {
    try {
      return await db
        .select()
        .from(providerCreditTransactions)
        .where(eq(providerCreditTransactions.providerId, providerId))
        .orderBy(desc(providerCreditTransactions.createdAt));
    } catch (error) {
      console.error('Error getting provider credit transactions:', error);
      return [];
    }
  }

  async getAvailableVouchers(): Promise<ProviderVoucher[]> {
    try {
      return await db
        .select()
        .from(providerVouchers)
        .where(eq(providerVouchers.status, 'active'))
        .orderBy(desc(providerVouchers.value));
    } catch (error) {
      console.error('Error getting available vouchers:', error);
      return [];
    }
  }

  async getVoucherByCode(code: string): Promise<ProviderVoucher | undefined> {
    try {
      const [voucher] = await db
        .select()
        .from(providerVouchers)
        .where(eq(providerVouchers.code, code));
      return voucher;
    } catch (error) {
      console.error('Error getting voucher by code:', error);
      return undefined;
    }
  }

  // Admin voucher management methods
  async getAllVouchersAdmin(): Promise<ProviderVoucher[]> {
    try {
      return await db
        .select()
        .from(providerVouchers)
        .orderBy(desc(providerVouchers.createdAt));
    } catch (error) {
      console.error('Error getting all vouchers for admin:', error);
      return [];
    }
  }

  async createVoucherAdmin(voucher: InsertProviderVoucher): Promise<ProviderVoucher> {
    try {
      const [created] = await db
        .insert(providerVouchers)
        .values(voucher)
        .returning();
      return created;
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw error;
    }
  }

  async createBulkVouchersAdmin(vouchers: InsertProviderVoucher[]): Promise<{ count: number; vouchers: ProviderVoucher[] }> {
    try {
      const created = await db
        .insert(providerVouchers)
        .values(vouchers)
        .returning();
      return { count: created.length, vouchers: created };
    } catch (error) {
      console.error('Error creating bulk vouchers:', error);
      throw error;
    }
  }

  async resetVoucherAdmin(id: number): Promise<ProviderVoucher | undefined> {
    try {
      const [updated] = await db
        .update(providerVouchers)
        .set({ 
          status: 'active',
          redeemedBy: null,
          redeemedAt: null 
        })
        .where(eq(providerVouchers.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error resetting voucher:', error);
      throw error;
    }
  }

  async updateVoucherAdmin(id: number, updates: Partial<InsertProviderVoucher>): Promise<ProviderVoucher | undefined> {
    try {
      const [updated] = await db
        .update(providerVouchers)
        .set(updates)
        .where(eq(providerVouchers.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating voucher:', error);
      throw error;
    }
  }

  async deleteVoucherAdmin(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(providerVouchers)
        .where(eq(providerVouchers.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting voucher:', error);
      return false;
    }
  }

  async purchaseLeadWithCredit(providerId: number, offerId: number): Promise<{ success: boolean; message: string; paymentDetails?: any }> {
    try {
      // Get lead offer details
      const [offer] = await db
        .select()
        .from(leadOffers)
        .where(eq(leadOffers.id, offerId));
      
      if (!offer) {
        return { success: false, message: 'Lead offer not found' };
      }
      
      if (offer.status !== 'pending') {
        return { success: false, message: 'This lead offer is no longer available' };
      }
      
      if (offer.providerId !== providerId) {
        return { success: false, message: 'This lead is not assigned to you' };
      }
      
      const leadCost = parseFloat(offer.leadCost);
      const currentBalance = await this.getProviderCreditBalance(providerId);
      
      // Get provider to check free leads
      const [provider] = await db
        .select()
        .from(serviceProviders)
        .where(eq(serviceProviders.id, providerId));
      
      if (!provider) {
        return { success: false, message: 'Provider not found' };
      }
      
      let paymentMethod = '';
      let creditUsed = 0;
      let amountCharged = 0;
      let isFreeLeadUsed = false;
      
      // Check if provider can use a free lead (first 3 leads)
      if ((provider.firstLeadsFreeUsed || 0) < 3) {
        // Use free lead
        isFreeLeadUsed = true;
        paymentMethod = 'free_lead';
        
        // Update provider's free leads used count
        await db
          .update(serviceProviders)
          .set({ 
            firstLeadsFreeUsed: (provider.firstLeadsFreeUsed || 0) + 1,
            leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1
          })
          .where(eq(serviceProviders.id, providerId));
        
        // Record free lead transaction
        await db.insert(providerCreditTransactions).values({
          providerId,
          transactionType: 'free_lead',
          amount: '0.00',
          balanceBefore: currentBalance.toFixed(2),
          balanceAfter: currentBalance.toFixed(2),
          description: `Free lead used (${(provider.firstLeadsFreeUsed || 0) + 1} of 3) - Lead #${offer.requestId}`,
          leadOfferId: offerId,
        });
        
      } else if (currentBalance >= leadCost) {
        // Use credit only
        creditUsed = leadCost;
        paymentMethod = 'credit_only';
        
        await this.deductProviderCredit(
          providerId, 
          leadCost, 
          `Lead purchase - Lead #${offer.requestId}`,
          offerId
        );
        
        // Update provider's leads purchased count
        await db
          .update(serviceProviders)
          .set({ leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1 })
          .where(eq(serviceProviders.id, providerId));
        
      } else if (currentBalance > 0) {
        // Use partial credit + charge remainder
        creditUsed = currentBalance;
        amountCharged = leadCost - currentBalance;
        paymentMethod = 'credit_and_card';
        
        // Deduct available credit
        await this.deductProviderCredit(
          providerId,
          currentBalance,
          `Partial payment for Lead #${offer.requestId} (Credit portion)`,
          offerId
        );
        
        // TODO: Charge remaining amount to card using Stripe
        // This would be implemented with Stripe payment processing
        
        // Update provider's leads purchased count
        await db
          .update(serviceProviders)
          .set({ leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1 })
          .where(eq(serviceProviders.id, providerId));
        
      } else {
        // No credit, charge full amount to card
        amountCharged = leadCost;
        paymentMethod = 'card_only';
        
        // TODO: Charge full amount to card using Stripe
        // This would be implemented with Stripe payment processing
        
        // Update provider's leads purchased count
        await db
          .update(serviceProviders)
          .set({ leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1 })
          .where(eq(serviceProviders.id, providerId));
      }
      
      // Mark lead offer as purchased
      await db
        .update(leadOffers)
        .set({ 
          status: 'purchased',
          purchasedAt: new Date()
        })
        .where(eq(leadOffers.id, offerId));
      
      // Record lead purchase
      await db.insert(leadPurchases).values({
        leadOfferId: offerId,
        providerId,
        requestId: offer.requestId,
        totalCost: leadCost.toFixed(2),
        creditUsed: creditUsed.toFixed(2),
        amountCharged: amountCharged.toFixed(2),
        paymentMethod,
        isFreeLeadUsed,
      });
      
      // Handle shared leads - activate more offers if needed
      if (offer.offerType === 'shared') {
        const [distributionLog] = await db
          .select()
          .from(leadDistributionLog)
          .where(eq(leadDistributionLog.requestId, offer.requestId));
        
        if (distributionLog) {
          const newSharedCount = (distributionLog.sharedOffersPurchased || 0) + 1;
          
          await db
            .update(leadDistributionLog)
            .set({ sharedOffersPurchased: newSharedCount })
            .where(eq(leadDistributionLog.id, distributionLog.id));
          
          // If we've reached the maximum shared offers, end distribution
          if (newSharedCount >= (distributionLog.maxSharedOffers || 3)) {
            await this.endLeadDistribution(offer.requestId);
          }
        }
      } else if (offer.offerType === 'unique') {
        // For unique offers, check if this was a free lead purchase
        if (isFreeLeadUsed) {
          // Get lead settings to check free lead behavior
          const leadSettings = await this.getLeadSettings();
          if (leadSettings.firstThreeLeadBehavior === 'shared') {
            // Move to shared phase for free lead
            await this.startSharedPhase(offer.requestId);
          } else {
            // End distribution - lead is assigned
            await this.endLeadDistribution(offer.requestId);
          }
        } else {
          // Paid unique purchase - end distribution, lead is assigned
          await this.endLeadDistribution(offer.requestId);
        }
      }
      
      return {
        success: true,
        message: isFreeLeadUsed ? 
          `Lead purchased using free lead (${(provider.firstLeadsFreeUsed || 0) + 1} of 3 used)` :
          `Lead purchased successfully! ${creditUsed > 0 ? `Used $${creditUsed} credit` : ''}${amountCharged > 0 ? ` and charged $${amountCharged}` : ''}`,
        paymentDetails: {
          totalCost: leadCost,
          creditUsed,
          amountCharged,
          paymentMethod,
          isFreeLeadUsed,
          freeLeadsRemaining: 3 - ((provider.firstLeadsFreeUsed || 0) + (isFreeLeadUsed ? 1 : 0))
        }
      };
      
    } catch (error) {
      console.error('Error purchasing lead with credit:', error);
      return { success: false, message: 'Failed to purchase lead. Please try again.' };
    }
  }

  async getLeadOfferDetails(requestId: number): Promise<any> {
    try {
      const offerDetails = await db
        .select({
          offerId: leadOffers.id,
          providerId: leadOffers.providerId,
          providerFirstName: serviceProviders.firstName,
          providerLastName: serviceProviders.lastName,
          providerEmail: serviceProviders.email,
          rating: providerRatings.rating,
          offerType: leadOffers.offerType,
          status: leadOffers.status,
          leadCost: leadOffers.leadCost,
          sortOrder: leadOffers.sortOrder,
          isCurrentOffer: leadOffers.isCurrentOffer,
          offerStartTime: leadOffers.offerStartTime,
          offerEndTime: leadOffers.offerEndTime,
          purchasedAt: leadOffers.purchasedAt,
          expiresAt: leadOffers.expiresAt,
        })
        .from(leadOffers)
        .leftJoin(serviceProviders, eq(leadOffers.providerId, serviceProviders.id))
        .leftJoin(providerRatings, eq(leadOffers.providerId, providerRatings.providerId))
        .where(eq(leadOffers.requestId, requestId))
        .orderBy(asc(leadOffers.sortOrder), desc(leadOffers.createdAt));

      const [distributionLog] = await db
        .select()
        .from(leadDistributionLog)
        .where(eq(leadDistributionLog.requestId, requestId))
        .orderBy(desc(leadDistributionLog.createdAt))
        .limit(1);

      return {
        distributionLog,
        offers: offerDetails.map(offer => ({
          ...offer,
          providerName: `${offer.providerFirstName} ${offer.providerLastName}`,
          leadCost: parseFloat(offer.leadCost || '0'),
          rating: parseFloat(offer.rating?.toString() || '5.0'),
        })),
      };
    } catch (error) {
      console.error('Error getting lead offer details:', error);
      return { distributionLog: null, offers: [] };
    }
  }

  async getProviderActiveLeads(providerId: number): Promise<any[]> {
    try {
      // Get provider info to check free leads status
      const [provider] = await db
        .select()
        .from(serviceProviders)
        .where(eq(serviceProviders.id, providerId));

      const isNewProvider = (provider?.firstLeadsFreeUsed || 0) < 3;

      // Get lead settings for First 3 Lead Behavior
      const leadSettings = await this.getLeadSettings();
      const firstThreeLeadBehavior = leadSettings.firstThreeLeadBehavior || 'shared';

      let activeLeads;

      if (isNewProvider && firstThreeLeadBehavior === 'shared') {
        // For new providers with "shared" setting: prioritize existing shared leads
        activeLeads = await this.getLeadsWithSharedPriority(providerId);
      } else {
        // For regular providers or "new" setting: use standard lead retrieval
        activeLeads = await this.getStandardActiveLeads(providerId);
      }

      // Filter out shared leads where 3 providers have already purchased
      const filteredLeads = [];
      for (const lead of activeLeads) {
        if (lead.offerType === 'shared' && lead.status === 'pending') {
          // Check how many providers have purchased this shared lead
          const purchasedCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(leadOffers)
            .where(
              and(
                eq(leadOffers.requestId, lead.requestId),
                eq(leadOffers.offerType, 'shared'),
                eq(leadOffers.status, 'purchased')
              )
            );
          
          // Only show if less than 3 providers have purchased
          if (purchasedCount[0]?.count < 3) {
            filteredLeads.push(lead);
          }
        } else {
          // Include unique offers and purchased offers
          filteredLeads.push(lead);
        }
      }

      return filteredLeads.map(lead => ({
        ...lead,
        leadCost: parseFloat(lead.leadCost || '0'),
        budget: parseFloat(lead.budget?.toString() || '0'),
      }));
    } catch (error) {
      console.error('Error getting provider active leads:', error);
      return [];
    }
  }

  async getStandardActiveLeads(providerId: number): Promise<any[]> {
    return await db
      .select({
        requestId: serviceRequests.id,
        categoryName: serviceCategories.name,
        customerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        customerEmail: users.email,
        customerPhone: users.phoneNumber,
        suburb: serviceRequests.suburb,
        postcode: serviceRequests.postcode,
        preferredDate: serviceRequests.preferredDate,
        bookingType: serviceRequests.bookingType,
        description: serviceRequests.description,
        urgency: serviceRequests.urgency,
        budget: serviceRequests.budget,
        offerType: leadOffers.offerType,
        leadCost: leadOffers.leadCost,
        status: leadOffers.status,
        isCurrentOffer: leadOffers.isCurrentOffer,
        expiresAt: leadOffers.expiresAt,
        purchasedAt: leadOffers.purchasedAt,
        createdAt: serviceRequests.createdAt,
        paymentMethod: providerCreditTransactions.transactionType,
      })
      .from(leadOffers)
      .innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id))
      .innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id))
      .innerJoin(users, eq(serviceRequests.customerId, users.id))
      .leftJoin(providerCreditTransactions, eq(leadOffers.id, providerCreditTransactions.leadOfferId))
      .where(
        and(
          eq(leadOffers.providerId, providerId),
          or(
            // Show current unique offers that are pending and active
            and(
              eq(leadOffers.status, 'pending'), 
              eq(leadOffers.isCurrentOffer, true),
              eq(leadOffers.offerType, 'unique')
            ),
            // Show shared offers that are pending (not purchased by this provider yet)
            and(
              eq(leadOffers.status, 'pending'),
              eq(leadOffers.offerType, 'shared')
            ),
            // Show purchased offers (for activity history)
            eq(leadOffers.status, 'purchased')
          ),
          // Only show leads that haven't expired based on job date (24 hours before)
          sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
        )
      )
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getLeadsWithSharedPriority(providerId: number): Promise<any[]> {
    // For new providers with "shared" behavior: first get existing shared leads
    const sharedLeads = await db
      .select({
        requestId: serviceRequests.id,
        categoryName: serviceCategories.name,
        customerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        customerEmail: users.email,
        customerPhone: users.phoneNumber,
        suburb: serviceRequests.suburb,
        postcode: serviceRequests.postcode,
        preferredDate: serviceRequests.preferredDate,
        bookingType: serviceRequests.bookingType,
        description: serviceRequests.description,
        urgency: serviceRequests.urgency,
        budget: serviceRequests.budget,
        offerType: leadOffers.offerType,
        leadCost: leadOffers.leadCost,
        status: leadOffers.status,
        isCurrentOffer: leadOffers.isCurrentOffer,
        expiresAt: leadOffers.expiresAt,
        purchasedAt: leadOffers.purchasedAt,
        createdAt: serviceRequests.createdAt,
        paymentMethod: providerCreditTransactions.transactionType,
      })
      .from(leadOffers)
      .innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id))
      .innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id))
      .innerJoin(users, eq(serviceRequests.customerId, users.id))
      .leftJoin(providerCreditTransactions, eq(leadOffers.id, providerCreditTransactions.leadOfferId))
      .where(
        and(
          eq(leadOffers.providerId, providerId),
          eq(leadOffers.offerType, 'shared'),
          eq(leadOffers.status, 'pending'),
          // Only show leads that haven't expired based on job date (24 hours before)
          sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
        )
      )
      .orderBy(desc(serviceRequests.createdAt));

    // If shared leads exist, return them prioritized
    if (sharedLeads.length > 0) {
      // Also get any unique/purchased leads for this provider
      const otherLeads = await db
        .select({
          requestId: serviceRequests.id,
          categoryName: serviceCategories.name,
          customerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
          customerEmail: users.email,
          customerPhone: users.phoneNumber,
          suburb: serviceRequests.suburb,
          postcode: serviceRequests.postcode,
          preferredDate: serviceRequests.preferredDate,
          bookingType: serviceRequests.bookingType,
          description: serviceRequests.description,
          urgency: serviceRequests.urgency,
          budget: serviceRequests.budget,
          offerType: leadOffers.offerType,
          leadCost: leadOffers.leadCost,
          status: leadOffers.status,
          isCurrentOffer: leadOffers.isCurrentOffer,
          expiresAt: leadOffers.expiresAt,
          purchasedAt: leadOffers.purchasedAt,
          createdAt: serviceRequests.createdAt,
          paymentMethod: providerCreditTransactions.transactionType,
        })
        .from(leadOffers)
        .innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id))
        .innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id))
        .innerJoin(users, eq(serviceRequests.customerId, users.id))
        .leftJoin(providerCreditTransactions, eq(leadOffers.id, providerCreditTransactions.leadOfferId))
        .where(
          and(
            eq(leadOffers.providerId, providerId),
            or(
              // Current unique offers
              and(
                eq(leadOffers.status, 'pending'), 
                eq(leadOffers.isCurrentOffer, true),
                eq(leadOffers.offerType, 'unique')
              ),
              // Purchased offers (for activity history)
              eq(leadOffers.status, 'purchased')
            ),
            // Only show leads that haven't expired based on job date (24 hours before)
            sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
          )
        )
        .orderBy(desc(serviceRequests.createdAt));

      // Return shared leads first, then other leads
      return [...sharedLeads, ...otherLeads];
    }

    // If no shared leads exist, fall back to standard behavior
    return await this.getStandardActiveLeads(providerId);
  }

  async getProviderActivityHistory(providerId: number): Promise<any[]> {
    try {
      // Get basic activity history for this provider's offers
      const activities = await db
        .select({
          id: leadOffers.id,
          requestId: leadOffers.requestId,
          categoryName: serviceCategories.name,
          suburb: serviceRequests.suburb,
          postcode: serviceRequests.postcode,
          leadCost: leadOffers.leadCost,
          offerType: leadOffers.offerType,
          status: leadOffers.status,
          isCurrentOffer: leadOffers.isCurrentOffer,
          expiresAt: leadOffers.expiresAt,
          purchasedAt: leadOffers.purchasedAt,
          createdAt: leadOffers.createdAt,
          description: serviceRequests.description,
          urgency: serviceRequests.urgency,
        })
        .from(leadOffers)
        .innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id))
        .innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id))
        .where(eq(leadOffers.providerId, providerId))
        .orderBy(desc(leadOffers.createdAt))
        .limit(20);

      // Transform activities with proper messages
      const processedActivities = activities.map(activity => {
        let message = '';
        let activityType = '';
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

        if (activity.status === 'purchased') {
          message = `Lead purchased - ${activity.categoryName} in ${activity.suburb}`;
          activityType = 'lead_purchased';
          variant = 'default';
        } else if (activity.status === 'expired' && activity.offerType === 'unique') {
          message = `Offer expired - ${activity.categoryName} lead in ${activity.suburb} (was $${activity.leadCost})`;
          activityType = 'offer_expired';
          variant = 'secondary';
        } else if (activity.status === 'pending' && activity.isCurrentOffer && activity.offerType === 'unique') {
          message = `New offer - ${activity.categoryName} lead in ${activity.suburb} ($${activity.leadCost})`;
          activityType = 'new_offer';
          variant = 'outline';
        } else if (activity.status === 'pending' && activity.offerType === 'shared') {
          message = `Price DROP - ${activity.categoryName} lead in ${activity.suburb} now $${activity.leadCost}`;
          activityType = 'price_drop';
          variant = 'secondary';
        }

        return {
          ...activity,
          message,
          activityType,
          variant,
          timestamp: activity.purchasedAt || activity.createdAt,
          leadCost: parseFloat(activity.leadCost || '0')
        };
      });

      return processedActivities.filter(activity => activity.message); // Only return activities with messages
    } catch (error) {
      console.error('Error getting provider activity history:', error);
      return [];
    }
  }

  // Provider lead interaction tracking methods
  async logProviderLeadInteraction(interaction: InsertProviderLeadInteraction): Promise<void> {
    try {
      await db.insert(providerLeadInteractions).values(interaction);
      console.log(`Logged provider interaction: ${interaction.interactionType} for lead ${interaction.leadId} by provider ${interaction.providerId}`);
    } catch (error) {
      console.error('Error logging provider lead interaction:', error);
      throw error;
    }
  }

  async getProviderLeadInteractions(leadId: number): Promise<Array<ProviderLeadInteraction & { providerName: string; providerEmail: string }>> {
    try {
      const results = await db
        .select({
          id: providerLeadInteractions.id,
          providerId: providerLeadInteractions.providerId,
          leadId: providerLeadInteractions.leadId,
          interactionType: providerLeadInteractions.interactionType,
          createdAt: providerLeadInteractions.createdAt,
          providerName: sql<string>`CONCAT(${serviceProviders.firstName}, ' ', ${serviceProviders.lastName})`,
          providerEmail: serviceProviders.email,
        })
        .from(providerLeadInteractions)
        .innerJoin(serviceProviders, eq(providerLeadInteractions.providerId, serviceProviders.id))
        .where(eq(providerLeadInteractions.leadId, leadId))
        .orderBy(desc(providerLeadInteractions.createdAt));
      
      return results;
    } catch (error) {
      console.error('Error getting provider lead interactions:', error);
      return [];
    }
  }

  // Provider lead status management methods
  async getProviderLeadStatus(providerId: number, leadId: number): Promise<ProviderLeadStatus | null> {
    try {
      const [status] = await db
        .select()
        .from(providerLeadStatus)
        .where(and(
          eq(providerLeadStatus.providerId, providerId),
          eq(providerLeadStatus.leadId, leadId)
        ))
        .limit(1);
      
      return status || null;
    } catch (error) {
      console.error('Error getting provider lead status:', error);
      return null;
    }
  }

  async upsertProviderLeadStatus(statusData: InsertProviderLeadStatus): Promise<ProviderLeadStatus> {
    try {
      const [status] = await db
        .insert(providerLeadStatus)
        .values({
          ...statusData,
          statusUpdatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [providerLeadStatus.providerId, providerLeadStatus.leadId],
          set: {
            status: statusData.status,
            wasJobBooked: statusData.wasJobBooked,
            statusUpdatedAt: new Date(),
            closedAt: statusData.status === 'closed' ? new Date() : undefined,
          },
        })
        .returning();
      
      return status;
    } catch (error) {
      console.error('Error upserting provider lead status:', error);
      throw error;
    }
  }

  async getProviderLeadStatuses(providerId: number): Promise<Array<ProviderLeadStatus & { leadInfo: { id: number; categoryName: string; customerName: string; suburb: string; createdAt: Date } }>> {
    try {
      const results = await db
        .select({
          id: providerLeadStatus.id,
          providerId: providerLeadStatus.providerId,  
          leadId: providerLeadStatus.leadId,
          status: providerLeadStatus.status,
          wasJobBooked: providerLeadStatus.wasJobBooked,
          statusUpdatedAt: providerLeadStatus.statusUpdatedAt,
          closedAt: providerLeadStatus.closedAt,
          createdAt: providerLeadStatus.createdAt,
          leadInfo: {
            id: serviceRequests.id,
            categoryName: serviceCategories.name,
            customerName: users.firstName,
            suburb: serviceRequests.suburb,
            createdAt: serviceRequests.createdAt,
          }
        })
        .from(providerLeadStatus)
        .innerJoin(serviceRequests, eq(providerLeadStatus.leadId, serviceRequests.id))
        .innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id))
        .innerJoin(users, eq(serviceRequests.customerId, users.id))
        .where(eq(providerLeadStatus.providerId, providerId))
        .orderBy(desc(providerLeadStatus.statusUpdatedAt));
      
      return results;
    } catch (error) {
      console.error('Error getting provider lead statuses:', error);
      return [];
    }
  }

  // Admin department methods
  async getAllDepartments(): Promise<AdminDepartment[]> {
    try {
      const departments = await db.select().from(adminDepartments).orderBy(adminDepartments.name);
      return departments;
    } catch (error) {
      console.error('Error getting departments:', error);
      return [];
    }
  }

  async createDepartment(department: InsertAdminDepartment): Promise<AdminDepartment> {
    try {
      const [newDepartment] = await db
        .insert(adminDepartments)
        .values(department)
        .returning();
      return newDepartment;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  async updateDepartment(id: number, updates: Partial<AdminDepartment>): Promise<AdminDepartment> {
    try {
      const [updatedDepartment] = await db
        .update(adminDepartments)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(adminDepartments.id, id))
        .returning();
      return updatedDepartment;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  async deleteDepartment(id: number): Promise<boolean> {
    try {
      // First remove all user-department associations
      await db.delete(adminUserDepartments).where(eq(adminUserDepartments.departmentId, id));
      
      const result = await db.delete(adminDepartments).where(eq(adminDepartments.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting department:', error);
      return false;
    }
  }

  // Admin user methods
  async getAllAdminUsers(): Promise<AdminUser[]> {
    try {
      const users = await db.select().from(adminUsers).orderBy(adminUsers.firstName, adminUsers.lastName);
      return users;
    } catch (error) {
      console.error('Error getting admin users:', error);
      return [];
    }
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    try {
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
      return user;
    } catch (error) {
      console.error('Error getting admin user:', error);
      return undefined;
    }
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    try {
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
      return user;
    } catch (error) {
      console.error('Error getting admin user by username:', error);
      return undefined;
    }
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    try {
      const [newUser] = await db
        .insert(adminUsers)
        .values(user)
        .returning();
      return newUser;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  async updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const [updatedUser] = await db
        .update(adminUsers)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(adminUsers.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    try {
      // First remove all user-department associations
      await db.delete(adminUserDepartments).where(eq(adminUserDepartments.userId, id));
      
      const result = await db.delete(adminUsers).where(eq(adminUsers.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting admin user:', error);
      return false;
    }
  }

  // Admin user department methods
  async getUserDepartments(userId: number): Promise<AdminDepartment[]> {
    try {
      const departments = await db
        .select({
          id: adminDepartments.id,
          name: adminDepartments.name,
          createdAt: adminDepartments.createdAt,
          updatedAt: adminDepartments.updatedAt,
        })
        .from(adminDepartments)
        .innerJoin(adminUserDepartments, eq(adminDepartments.id, adminUserDepartments.departmentId))
        .where(eq(adminUserDepartments.userId, userId));
      return departments;
    } catch (error) {
      console.error('Error getting user departments:', error);
      return [];
    }
  }

  async assignUserToDepartment(userId: number, departmentId: number): Promise<void> {
    try {
      await db
        .insert(adminUserDepartments)
        .values({ userId, departmentId })
        .onConflictDoNothing();
    } catch (error) {
      console.error('Error assigning user to department:', error);
      throw error;
    }
  }

  async removeUserFromDepartment(userId: number, departmentId: number): Promise<void> {
    try {
      await db
        .delete(adminUserDepartments)
        .where(and(
          eq(adminUserDepartments.userId, userId),
          eq(adminUserDepartments.departmentId, departmentId)
        ));
    } catch (error) {
      console.error('Error removing user from department:', error);
      throw error;
    }
  }

  async updateUserDepartments(userId: number, departmentIds: number[]): Promise<void> {
    try {
      // Remove all existing assignments
      await db.delete(adminUserDepartments).where(eq(adminUserDepartments.userId, userId));
      
      // Add new assignments
      if (departmentIds.length > 0) {
        const assignments = departmentIds.map(departmentId => ({ userId, departmentId }));
        await db.insert(adminUserDepartments).values(assignments);
      }
    } catch (error) {
      console.error('Error updating user departments:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
