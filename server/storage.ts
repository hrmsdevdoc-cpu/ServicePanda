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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, inArray, isNotNull } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Service provider operations
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderById(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider>;
  getServiceProvidersByStatus(status: string): Promise<ServiceProvider[]>;
  
  // Service category operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Provider service operations
  addProviderService(providerService: InsertProviderService): Promise<void>;
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
  
  // Document operations
  uploadProviderDocument(document: InsertProviderDocument): Promise<ProviderDocument>;
  getProviderDocuments(providerId: number): Promise<ProviderDocument[]>;
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
}

export class DatabaseStorage implements IStorage {
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

  async addProviderServiceArea(area: InsertProviderServiceArea): Promise<void> {
    await db.insert(providerServiceAreas).values(area);
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
      .select({
        id: serviceProviders.id,
        firstName: serviceProviders.firstName,
        lastName: serviceProviders.lastName,
        email: serviceProviders.email,
        mobileNumber: serviceProviders.mobileNumber,
        address: serviceProviders.address,
        status: serviceProviders.status,
        documentsUploaded: serviceProviders.documentsUploaded,
        termsAccepted: serviceProviders.termsAccepted,
        creditCardAdded: serviceProviders.creditCardAdded,
        freeLeadsRemaining: serviceProviders.freeLeadsRemaining,
        eWayCustomerToken: serviceProviders.eWayCustomerToken,
        cardFirstFour: serviceProviders.cardFirstFour,
        cardLastFour: serviceProviders.cardLastFour,
        password: serviceProviders.password,
        createdAt: serviceProviders.createdAt,
        updatedAt: serviceProviders.updatedAt,
      })
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

  async getAllServiceRequestsForAdmin(): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
