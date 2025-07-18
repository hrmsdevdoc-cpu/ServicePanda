import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service providers table
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  mobileNumber: varchar("mobile_number").notNull(),
  address: text("address").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected
  documentsUploaded: boolean("documents_uploaded").default(false),
  termsAccepted: boolean("terms_accepted").default(false),
  creditCardAdded: boolean("credit_card_added").default(false),
  freeLeadsRemaining: integer("free_leads_remaining").default(3),
  eWayCustomerToken: varchar("eway_customer_token"),
  cardFirstFour: varchar("card_first_four"),
  cardLastFour: varchar("card_last_four"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service categories
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  icon: varchar("icon").notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  popular: boolean("popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Provider services - junction table for providers and categories
export const providerServices = pgTable("provider_services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  categoryId: integer("category_id").references(() => serviceCategories.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Australian states and territories
export const australianStates = pgTable("australian_states", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  abbreviation: varchar("abbreviation").notNull(),
});

// Australian postcodes and suburbs
export const australianSuburbs = pgTable("australian_suburbs", {
  id: serial("id").primaryKey(),
  postcode: varchar("postcode").notNull(),
  suburb: varchar("suburb").notNull(),
  stateId: integer("state_id").references(() => australianStates.id).notNull(),
});

// Provider service areas
export const providerServiceAreas = pgTable("provider_service_areas", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  suburbId: integer("suburb_id").references(() => australianSuburbs.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documents uploaded by providers
export const providerDocuments = pgTable("provider_documents", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  documentType: varchar("document_type").notNull(), // license, police_check, insurance
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  status: varchar("status").default("pending"), // pending, approved, rejected
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Customer service requests/leads
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => serviceCategories.id).notNull(),
  description: text("description").notNull(),
  postcode: varchar("postcode").notNull(),
  suburb: varchar("suburb").notNull(),
  propertyType: varchar("property_type"),
  urgency: varchar("urgency"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  preferredDate: timestamp("preferred_date"), // When customer wants the job done
  bookingType: varchar("booking_type"), // Type of booking requested
  scheduledDate: timestamp("scheduled_date"), // Actual date job is scheduled for
  status: varchar("status").default("active"), // active, assigned, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead assignments to providers
export const leadAssignments = pgTable("lead_assignments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  status: varchar("status").default("pending"), // pending, accepted, declined
  acceptedAt: timestamp("accepted_at"),
  declinedAt: timestamp("declined_at"),
  isFree: boolean("is_free").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email templates and sent emails
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  body: text("body").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sentEmails = pgTable("sent_emails", {
  id: serial("id").primaryKey(),
  recipientId: varchar("recipient_id").references(() => users.id),
  recipientEmail: varchar("recipient_email").notNull(),
  subject: varchar("subject").notNull(),
  body: text("body").notNull(),
  templateId: integer("template_id").references(() => emailTemplates.id),
  status: varchar("status").default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity logs
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  userType: varchar("user_type").notNull(), // customer, provider, admin
  action: varchar("action").notNull(),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  serviceProvider: one(serviceProviders),
  serviceRequests: many(serviceRequests),
  sentEmails: many(sentEmails),
  activityLogs: many(userActivityLogs),
}));

export const serviceProvidersRelations = relations(serviceProviders, ({ one, many }) => ({
  user: one(users, { fields: [serviceProviders.userId], references: [users.id] }),
  services: many(providerServices),
  serviceAreas: many(providerServiceAreas),
  documents: many(providerDocuments),
  leadAssignments: many(leadAssignments),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  providerServices: many(providerServices),
  serviceRequests: many(serviceRequests),
}));

export const providerServicesRelations = relations(providerServices, ({ one }) => ({
  provider: one(serviceProviders, { fields: [providerServices.providerId], references: [serviceProviders.id] }),
  category: one(serviceCategories, { fields: [providerServices.categoryId], references: [serviceCategories.id] }),
}));

export const australianStatesRelations = relations(australianStates, ({ many }) => ({
  suburbs: many(australianSuburbs),
}));

export const australianSuburbsRelations = relations(australianSuburbs, ({ one, many }) => ({
  state: one(australianStates, { fields: [australianSuburbs.stateId], references: [australianStates.id] }),
  providerServiceAreas: many(providerServiceAreas),
}));

export const providerServiceAreasRelations = relations(providerServiceAreas, ({ one }) => ({
  provider: one(serviceProviders, { fields: [providerServiceAreas.providerId], references: [serviceProviders.id] }),
  suburb: one(australianSuburbs, { fields: [providerServiceAreas.suburbId], references: [australianSuburbs.id] }),
}));

export const providerDocumentsRelations = relations(providerDocuments, ({ one }) => ({
  provider: one(serviceProviders, { fields: [providerDocuments.providerId], references: [serviceProviders.id] }),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
  customer: one(users, { fields: [serviceRequests.customerId], references: [users.id] }),
  category: one(serviceCategories, { fields: [serviceRequests.categoryId], references: [serviceCategories.id] }),
  leadAssignments: many(leadAssignments),
}));

export const leadAssignmentsRelations = relations(leadAssignments, ({ one }) => ({
  request: one(serviceRequests, { fields: [leadAssignments.requestId], references: [serviceRequests.id] }),
  provider: one(serviceProviders, { fields: [leadAssignments.providerId], references: [serviceProviders.id] }),
}));

export const emailTemplatesRelations = relations(emailTemplates, ({ many }) => ({
  sentEmails: many(sentEmails),
}));

export const sentEmailsRelations = relations(sentEmails, ({ one }) => ({
  recipient: one(users, { fields: [sentEmails.recipientId], references: [users.id] }),
  template: one(emailTemplates, { fields: [sentEmails.templateId], references: [emailTemplates.id] }),
}));

export const userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
  user: one(users, { fields: [userActivityLogs.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertServiceProviderSchema = createInsertSchema(serviceProviders).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({ 
  id: true, 
  createdAt: true 
});
export const insertProviderServiceSchema = createInsertSchema(providerServices).omit({ 
  id: true, 
  createdAt: true 
});
export const insertProviderServiceAreaSchema = createInsertSchema(providerServiceAreas).omit({ 
  id: true, 
  createdAt: true 
});
export const insertProviderDocumentSchema = createInsertSchema(providerDocuments).omit({ 
  id: true, 
  uploadedAt: true 
});
export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertLeadAssignmentSchema = createInsertSchema(leadAssignments).omit({ 
  id: true, 
  createdAt: true 
});
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertSentEmailSchema = createInsertSchema(sentEmails).omit({ 
  id: true, 
  createdAt: true 
});
export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({ 
  id: true, 
  createdAt: true 
});
export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({ 
  id: true, 
  updatedAt: true 
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;
export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertProviderService = z.infer<typeof insertProviderServiceSchema>;
export type ProviderService = typeof providerServices.$inferSelect;
export type InsertProviderServiceArea = z.infer<typeof insertProviderServiceAreaSchema>;
export type ProviderServiceArea = typeof providerServiceAreas.$inferSelect;
export type InsertProviderDocument = z.infer<typeof insertProviderDocumentSchema>;
export type ProviderDocument = typeof providerDocuments.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertLeadAssignment = z.infer<typeof insertLeadAssignmentSchema>;
export type LeadAssignment = typeof leadAssignments.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertSentEmail = z.infer<typeof insertSentEmailSchema>;
export type SentEmail = typeof sentEmails.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type AustralianState = typeof australianStates.$inferSelect;
export type AustralianSuburb = typeof australianSuburbs.$inferSelect;
