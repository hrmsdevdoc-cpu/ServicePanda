import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
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
  phoneNumber: varchar("phone_number"),
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
  businessName: varchar("business_name"),
  businessAbn: varchar("business_abn"),
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
  // Credit and promotion tracking
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default("0.00"),
  leadsPurchasedCount: integer("leads_purchased_count").default(0),
  firstLeadsFreeUsed: integer("first_leads_free_used").default(0), // Track how many of first 3 free leads used
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

// Provider ratings table
export const providerRatings = pgTable("provider_ratings", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull().default("5.0"),
  totalReviews: integer("total_reviews").default(0),
  averageResponseTime: integer("average_response_time").default(30), // minutes
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("100.00"), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead offer tracking table - tracks individual lead offers to providers
export const leadOffers = pgTable("lead_offers", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  offerType: varchar("offer_type").notNull(), // 'unique' or 'shared'
  leadCost: decimal("lead_cost", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, purchased, expired, declined
  offerStartTime: timestamp("offer_start_time").defaultNow(),
  offerEndTime: timestamp("offer_end_time"),
  purchasedAt: timestamp("purchased_at"),
  expiresAt: timestamp("expires_at"),
  sortOrder: integer("sort_order").default(0), // for rating-based ordering
  isCurrentOffer: boolean("is_current_offer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead distribution log - tracks the complete lead distribution process
export const leadDistributionLog = pgTable("lead_distribution_log", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
  distributionPhase: varchar("distribution_phase").notNull(), // 'unique' or 'shared'
  currentOfferProviderId: integer("current_offer_provider_id").references(() => serviceProviders.id),
  nextOfferProviderId: integer("next_offer_provider_id").references(() => serviceProviders.id),
  totalEligibleProviders: integer("total_eligible_providers").default(0),
  uniqueOffersCompleted: integer("unique_offers_completed").default(0),
  sharedOffersPurchased: integer("shared_offers_purchased").default(0),
  maxSharedOffers: integer("max_shared_offers").default(3),
  phaseStartTime: timestamp("phase_start_time").defaultNow(),
  currentOfferEndTime: timestamp("current_offer_end_time"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Provider postcode coverage - pre-calculated coverage areas for each provider
export const providerPostcodeCoverage = pgTable("provider_postcode_coverage", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id, { onDelete: "cascade" }).notNull(),
  serviceAreaId: integer("service_area_id").references(() => providerServiceAreas.id, { onDelete: "cascade" }).notNull(),
  postcode: varchar("postcode", { length: 10 }).notNull(),
  distance: decimal("distance", { precision: 8, scale: 2 }), // Distance in kilometers from provider center
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Ensure unique combination of provider, service area, and postcode
  uniqueCoverage: uniqueIndex("provider_service_area_postcode_unique").on(
    table.providerId,
    table.serviceAreaId, 
    table.postcode
  ),
  // Index for fast lookups by provider and postcode
  providerPostcodeIdx: index("provider_postcode_idx").on(table.providerId, table.postcode),
}));

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

// Provider vouchers - for promotional codes and credits (admin managed)
export const providerVouchers = pgTable("provider_vouchers", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 6 }).notNull().unique(), // 6-digit alphanumeric code
  value: decimal("value", { precision: 10, scale: 2 }).notNull(), // Dollar value of voucher (default $50)
  description: text("description"), // Description of what voucher is for
  status: varchar("status", { length: 20 }).default("active").notNull(), // 'active', 'closed', 'expired'
  expiryDate: timestamp("expiry_date").notNull(), // Date when voucher expires (30 days from creation)
  redeemedBy: integer("redeemed_by").references(() => serviceProviders.id), // Provider who redeemed it
  redeemedAt: timestamp("redeemed_at"), // When it was redeemed
  createdBy: varchar("created_by").default("admin"), // Admin who created the voucher
  createdAt: timestamp("created_at").defaultNow(),
});

// Provider credit transactions - track all credit additions and deductions
export const providerCreditTransactions = pgTable("provider_credit_transactions", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  transactionType: varchar("transaction_type").notNull(), // 'credit', 'debit', 'voucher_redemption', 'free_lead', 'lead_purchase'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Positive for credits, negative for debits
  balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(), // Human readable description
  // Related records for tracking
  leadOfferId: integer("lead_offer_id").references(() => leadOffers.id), // If related to lead purchase
  voucherCode: varchar("voucher_code", { length: 50 }), // If voucher was used
  stripePaymentIntentId: varchar("stripe_payment_intent_id"), // If actual payment was made
  createdAt: timestamp("created_at").defaultNow(),
});

// Lead purchase records - enhanced to track payment method and credit usage
export const leadPurchases = pgTable("lead_purchases", {
  id: serial("id").primaryKey(),
  leadOfferId: integer("lead_offer_id").references(() => leadOffers.id).notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  creditUsed: decimal("credit_used", { precision: 10, scale: 2 }).default("0.00"),
  amountCharged: decimal("amount_charged", { precision: 10, scale: 2 }).default("0.00"),
  paymentMethod: varchar("payment_method").notNull(), // 'credit_only', 'card_only', 'credit_and_card', 'free_lead'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"), // If card was charged
  isFreeLeadUsed: boolean("is_free_lead_used").default(false), // If this was one of first 3 free leads
  purchasedAt: timestamp("purchased_at").defaultNow(),
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
export const insertProviderRatingSchema = createInsertSchema(providerRatings).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertLeadOfferSchema = createInsertSchema(leadOffers).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertLeadDistributionLogSchema = createInsertSchema(leadDistributionLog).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertProviderPostcodeCoverageSchema = createInsertSchema(providerPostcodeCoverage).omit({ 
  id: true, 
  createdAt: true 
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

// Credit system types
export type ProviderVoucher = typeof providerVouchers.$inferSelect;
export type InsertProviderVoucher = typeof providerVouchers.$inferInsert;
export type ProviderCreditTransaction = typeof providerCreditTransactions.$inferSelect;
export type InsertProviderCreditTransaction = typeof providerCreditTransactions.$inferInsert;
export type LeadPurchase = typeof leadPurchases.$inferSelect;
export type InsertLeadPurchase = typeof leadPurchases.$inferInsert;

export type InsertProviderPasswordResetToken = z.infer<typeof insertProviderPasswordResetTokenSchema>;
export type ProviderPasswordResetToken = typeof providerPasswordResetTokens.$inferSelect;
export type InsertProviderActivityLog = z.infer<typeof insertProviderActivityLogSchema>;
export type ProviderActivityLog = typeof providerActivityLogs.$inferSelect;
export type InsertLeadNote = z.infer<typeof insertLeadNoteSchema>;
export type LeadNote = typeof leadNotes.$inferSelect;
export type InsertProviderRating = z.infer<typeof insertProviderRatingSchema>;
export type ProviderRating = typeof providerRatings.$inferSelect;
export type InsertLeadOffer = z.infer<typeof insertLeadOfferSchema>;
export type LeadOffer = typeof leadOffers.$inferSelect;
export type InsertLeadDistributionLog = z.infer<typeof insertLeadDistributionLogSchema>;
export type LeadDistributionLog = typeof leadDistributionLog.$inferSelect;
export type InsertProviderPostcodeCoverage = z.infer<typeof insertProviderPostcodeCoverageSchema>;
export type ProviderPostcodeCoverage = typeof providerPostcodeCoverage.$inferSelect;

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
