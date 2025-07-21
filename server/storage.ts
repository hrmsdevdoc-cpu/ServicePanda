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
  leadNotes,
  type LeadSettings,
  type InsertLeadSettings,
  type CategoryLeadPricing,
  type InsertCategoryLeadPricing,
  type LeadNote,
  type InsertLeadNote,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, inArray, isNotNull, sql } from "drizzle-orm";
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
  getLeadsWithMetrics(): Promise<Array<ServiceRequest & { leadAssignments?: any[] }>>;
  
  // Service provider operations
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderById(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider>;
  updateProviderStatus(id: number, providerStatus: string): Promise<void>;
  getServiceProvidersByStatus(status: string): Promise<ServiceProvider[]>;
  
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

  async getLeadsWithMetrics(): Promise<Array<ServiceRequest & { leadAssignments?: any[] }>> {
    try {
      // Get all service requests with customer details and category info
      const requestsData = await db
        .select({
          id: serviceRequests.id,
          customerId: serviceRequests.customerId,
          categoryId: serviceRequests.categoryId,
          description: serviceRequests.description,
          postcode: serviceRequests.postcode,
          suburb: serviceRequests.suburb,
          propertyType: serviceRequests.propertyType,
          urgency: serviceRequests.urgency,
          budget: serviceRequests.budget,
          preferredDate: serviceRequests.preferredDate,
          bookingType: serviceRequests.bookingType,
          scheduledDate: serviceRequests.scheduledDate,
          status: serviceRequests.status,
          createdAt: serviceRequests.createdAt,
          updatedAt: serviceRequests.updatedAt,
          // Customer info
          customerFirstName: users.firstName,
          customerLastName: users.lastName,
          customerEmail: users.email,
          // Category info
          categoryName: serviceCategories.name,
        })
        .from(serviceRequests)
        .leftJoin(users, eq(serviceRequests.customerId, users.id))
        .leftJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id))
        .orderBy(desc(serviceRequests.createdAt));

      // Get lead assignments for each service request
      const requestsWithAssignments = await Promise.all(
        requestsData.map(async (request: any) => {
          const assignments = await db
            .select({
              id: leadAssignments.id,
              providerId: leadAssignments.providerId,
              status: leadAssignments.status,
              assignedAt: leadAssignments.createdAt,
              // Provider info
              providerFirstName: serviceProviders.firstName,
              providerLastName: serviceProviders.lastName,
            })
            .from(leadAssignments)
            .leftJoin(serviceProviders, eq(leadAssignments.providerId, serviceProviders.id))
            .where(eq(leadAssignments.requestId, request.id));

          // Format the data for frontend consumption
          const formattedAssignments = assignments.map(assignment => ({
            ...assignment,
            providerName: `${assignment.providerFirstName || ''} ${assignment.providerLastName || ''}`.trim(),
          }));

          // Get notes for this lead
          const notes = await this.getLeadNotes(request.id);

          return {
            ...request,
            customerName: `${request.customerFirstName || ''} ${request.customerLastName || ''}`.trim(),
            leadAssignments: formattedAssignments,
            notes: notes,
          };
        })
      );

      return requestsWithAssignments;
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

  async getServiceProvidersForAdmin(status?: string): Promise<ServiceProvider[]> {
    const query = db.select().from(serviceProviders);
    
    if (status) {
      return await query
        .where(eq(serviceProviders.status, status))
        .orderBy(desc(serviceProviders.createdAt));
    }
    
    return await query.orderBy(desc(serviceProviders.createdAt));
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
}

export const storage = new DatabaseStorage();
