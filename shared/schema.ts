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
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service providers table - separate authentication from customers
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  mobileNumber: varchar("mobile_number").notNull(),
  address: text("address").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected
  providerStatus: varchar("provider_status").default("deactivated"), // activated, deactivated
  documentsUploaded: boolean("documents_uploaded").default(false),
  termsAccepted: boolean("terms_accepted").default(false),
  creditCardAdded: boolean("credit_card_added").default(false),
  freeLeadsRemaining: integer("free_leads_remaining").default(3),
  stripeCustomerId: varchar("stripe_customer_id"),
  // Document information fields
  licenseInfo: text("license_info"),
  policeCheckInfo: text("police_check_info"),
  insuranceCertificateInfo: text("insurance_certificate_info"),
  // Admin fields for official use
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Provider payment methods table
export const providerPaymentMethods = pgTable("provider_payment_methods", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  stripeCustomerId: varchar("stripe_customer_id").notNull(),
  stripePaymentMethodId: varchar("stripe_payment_method_id").notNull(),
  cardBrand: varchar("card_brand").notNull(),
  cardLastFour: varchar("card_last_four").notNull(),
  cardExpMonth: integer("card_exp_month").notNull(),
  cardExpYear: integer("card_exp_year").notNull(),
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
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

// SA4 Regions - Statistical Area Level 4 (ABS standard)
export const australianRegions = pgTable("australian_regions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // e.g., "Gold Coast", "Newcastle and Lake Macquarie"
  code: varchar("code").notNull(), // SA4 code e.g., "30504"
  stateId: integer("state_id").references(() => australianStates.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Australian postcodes and suburbs
export const australianSuburbs = pgTable("australian_suburbs", {
  id: serial("id").primaryKey(),
  postcode: varchar("postcode").notNull(),
  suburb: varchar("suburb").notNull(),
  stateId: integer("state_id").references(() => australianStates.id).notNull(),
  regionId: integer("region_id").references(() => australianRegions.id), // Link to SA4 region
});

// Provider service areas - new location-based approach
export const providerServiceAreas = pgTable("provider_service_areas", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  // Location-based service areas
  centerAddress: text("center_address").notNull(), // Full address of service center
  centerLat: decimal("center_lat", { precision: 10, scale: 7 }), // Latitude
  centerLng: decimal("center_lng", { precision: 10, scale: 7 }), // Longitude
  radiusKm: integer("radius_km").notNull().default(25), // Service radius in kilometers
  areaName: varchar("area_name"), // Optional friendly name (e.g., "Gold Coast", "Brisbane North")
  // Legacy suburb-based approach (keeping for backwards compatibility)
  suburbId: integer("suburb_id").references(() => australianSuburbs.id),
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

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Provider password reset tokens
export const providerPasswordResetTokens = pgTable("provider_password_reset_tokens", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Provider activity logs for tracking all changes and actions
export const providerActivityLogs = pgTable("provider_activity_logs", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  activityType: varchar("activity_type", { length: 50 }).notNull(), // 'status_change', 'service_update', 'area_update', 'details_update', 'document_update'
  actorType: varchar("actor_type", { length: 20 }).notNull(), // 'admin', 'provider'
  actorId: varchar("actor_id", { length: 50 }), // admin username or provider ID
  actorName: varchar("actor_name", { length: 100 }), // display name
  description: text("description").notNull(), // human-readable description
  oldValue: text("old_value"), // JSON string of old data
  newValue: text("new_value"), // JSON string of new data
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  serviceRequests: many(serviceRequests),
  sentEmails: many(sentEmails),
  activityLogs: many(userActivityLogs),
}));

export const serviceProvidersRelations = relations(serviceProviders, ({ many }) => ({
  services: many(providerServices),
  serviceAreas: many(providerServiceAreas),
  documents: many(providerDocuments),
  leadAssignments: many(leadAssignments),
  activityLogs: many(providerActivityLogs),
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
  regions: many(australianRegions),
  suburbs: many(australianSuburbs),
}));

export const australianRegionsRelations = relations(australianRegions, ({ one, many }) => ({
  state: one(australianStates, { fields: [australianRegions.stateId], references: [australianStates.id] }),
  suburbs: many(australianSuburbs),
}));

export const australianSuburbsRelations = relations(australianSuburbs, ({ one, many }) => ({
  state: one(australianStates, { fields: [australianSuburbs.stateId], references: [australianStates.id] }),
  region: one(australianRegions, { fields: [australianSuburbs.regionId], references: [australianRegions.id] }),
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

export const providerActivityLogsRelations = relations(providerActivityLogs, ({ one }) => ({
  provider: one(serviceProviders, { fields: [providerActivityLogs.providerId], references: [serviceProviders.id] }),
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
}).extend({
  preferredDate: z.coerce.date().optional(),
  scheduledDate: z.coerce.date().optional()
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
export const insertProviderPaymentMethodSchema = createInsertSchema(providerPaymentMethods).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ 
  id: true, 
  createdAt: true 
});
export const insertProviderPasswordResetTokenSchema = createInsertSchema(providerPasswordResetTokens).omit({ 
  id: true, 
  createdAt: true 
});
export const insertProviderActivityLogSchema = createInsertSchema(providerActivityLogs).omit({ 
  id: true, 
  timestamp: true 
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
export type AustralianRegion = typeof australianRegions.$inferSelect;
export type AustralianSuburb = typeof australianSuburbs.$inferSelect;
export type InsertProviderPaymentMethod = z.infer<typeof insertProviderPaymentMethodSchema>;
export type ProviderPaymentMethod = typeof providerPaymentMethods.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export type InsertProviderPasswordResetToken = z.infer<typeof insertProviderPasswordResetTokenSchema>;
export type ProviderPasswordResetToken = typeof providerPasswordResetTokens.$inferSelect;
export type InsertProviderActivityLog = z.infer<typeof insertProviderActivityLogSchema>;
export type ProviderActivityLog = typeof providerActivityLogs.$inferSelect;
export type InsertLeadNote = z.infer<typeof insertLeadNoteSchema>;
export type LeadNote = typeof leadNotes.$inferSelect;

// Lead management settings table
export const leadSettings = pgTable("lead_settings", {
  id: serial("id").primaryKey(),
  pricingModel: varchar("pricing_model", { length: 50 }).notNull().default('uniform'), // 'uniform' or 'category'
  uniformUniquePrice: decimal("uniform_unique_price", { precision: 10, scale: 2 }).default('25.00'),
  uniformSharePrice: decimal("uniform_share_price", { precision: 10, scale: 2 }).default('12.00'),
  uniqueOfferWindow: integer("unique_offer_window").default(2), // minutes
  maxProvidersPerArea: integer("max_providers_per_area").default(10),
  minProviderRating: decimal("min_provider_rating", { precision: 3, scale: 1 }).default('3.0'),
  providerRestrictionsActive: boolean("provider_restrictions_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Category-specific lead pricing
export const categoryLeadPricing = pgTable("category_lead_pricing", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  uniquePrice: decimal("unique_price", { precision: 10, scale: 2 }).notNull(),
  sharePrice: decimal("share_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead notes table
export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => serviceRequests.id),
  note: text("note").notNull(),
  adminName: varchar("admin_name", { length: 255 }).default('admin'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for lead notes
export const insertLeadNoteSchema = createInsertSchema(leadNotes).omit({ 
  id: true, 
  createdAt: true 
});

export type LeadSettings = typeof leadSettings.$inferSelect;
export type InsertLeadSettings = typeof leadSettings.$inferInsert;
export type CategoryLeadPricing = typeof categoryLeadPricing.$inferSelect;
export type InsertCategoryLeadPricing = typeof categoryLeadPricing.$inferInsert;
