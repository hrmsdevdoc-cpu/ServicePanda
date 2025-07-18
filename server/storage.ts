import {
  users,
  serviceProviders,
  serviceCategories,
  providerServices,
  australianStates,
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
  type AustralianSuburb,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Service provider operations
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByUserId(userId: string): Promise<ServiceProvider | undefined>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider>;
  getServiceProvidersByStatus(status: string): Promise<ServiceProvider[]>;
  
  // Service category operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Provider service operations
  addProviderService(providerService: InsertProviderService): Promise<void>;
  getProviderServices(providerId: number): Promise<number[]>;
  
  // Location operations
  getAustralianStates(): Promise<AustralianState[]>;
  getSuburbsByPostcode(postcode: string): Promise<AustralianSuburb[]>;
  addProviderServiceArea(area: InsertProviderServiceArea): Promise<void>;
  getProviderServiceAreas(providerId: number): Promise<AustralianSuburb[]>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  async getServiceProviderByUserId(userId: string): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.userId, userId));
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

  async getProviderServices(providerId: number): Promise<number[]> {
    const services = await db
      .select({ categoryId: providerServices.categoryId })
      .from(providerServices)
      .where(eq(providerServices.providerId, providerId));
    return services.map(s => s.categoryId);
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

  async getProviderServiceAreas(providerId: number): Promise<AustralianSuburb[]> {
    return await db
      .select({
        id: australianSuburbs.id,
        postcode: australianSuburbs.postcode,
        suburb: australianSuburbs.suburb,
        stateId: australianSuburbs.stateId,
      })
      .from(providerServiceAreas)
      .innerJoin(australianSuburbs, eq(providerServiceAreas.suburbId, australianSuburbs.id))
      .where(eq(providerServiceAreas.providerId, providerId));
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
}

export const storage = new DatabaseStorage();
