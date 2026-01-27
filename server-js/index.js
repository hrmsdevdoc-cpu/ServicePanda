var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminDepartments: () => adminDepartments,
  adminUserDepartments: () => adminUserDepartments,
  adminUsers: () => adminUsers,
  australianRegions: () => australianRegions,
  australianRegionsRelations: () => australianRegionsRelations,
  australianStates: () => australianStates,
  australianStatesRelations: () => australianStatesRelations,
  australianSuburbs: () => australianSuburbs,
  australianSuburbsRelations: () => australianSuburbsRelations,
  categoryLeadPricing: () => categoryLeadPricing,
  customerCreditTransactions: () => customerCreditTransactions,
  customerReviews: () => customerReviews,
  customerVouchers: () => customerVouchers,
  emailAttachments: () => emailAttachments,
  emailAttachmentsRelations: () => emailAttachmentsRelations,
  emailLabelRelations: () => emailLabelRelations,
  emailLabelRelationsRelations: () => emailLabelRelationsRelations,
  emailLabels: () => emailLabels,
  emailLabelsRelations: () => emailLabelsRelations,
  emailTemplates: () => emailTemplates,
  emailTemplatesRelations: () => emailTemplatesRelations,
  emails: () => emails,
  emailsRelations: () => emailsRelations,
  insertAdminDepartmentSchema: () => insertAdminDepartmentSchema,
  insertAdminUserDepartmentSchema: () => insertAdminUserDepartmentSchema,
  insertAdminUserSchema: () => insertAdminUserSchema,
  insertCustomerCreditTransactionSchema: () => insertCustomerCreditTransactionSchema,
  insertCustomerReviewSchema: () => insertCustomerReviewSchema,
  insertCustomerVoucherSchema: () => insertCustomerVoucherSchema,
  insertEmailAttachmentSchema: () => insertEmailAttachmentSchema,
  insertEmailLabelRelationSchema: () => insertEmailLabelRelationSchema,
  insertEmailLabelSchema: () => insertEmailLabelSchema,
  insertEmailSchema: () => insertEmailSchema,
  insertEmailTemplateSchema: () => insertEmailTemplateSchema,
  insertLeadAssignmentSchema: () => insertLeadAssignmentSchema,
  insertLeadDistributionLogSchema: () => insertLeadDistributionLogSchema,
  insertLeadNoteSchema: () => insertLeadNoteSchema,
  insertLeadOfferSchema: () => insertLeadOfferSchema,
  insertPasswordResetTokenSchema: () => insertPasswordResetTokenSchema,
  insertPermissionSchema: () => insertPermissionSchema,
  insertPotentialCustomerSchema: () => insertPotentialCustomerSchema,
  insertPotentialProviderCommunicationSchema: () => insertPotentialProviderCommunicationSchema,
  insertPotentialProviderSchema: () => insertPotentialProviderSchema,
  insertPotentialProviderTaskSchema: () => insertPotentialProviderTaskSchema,
  insertProviderActivityLogSchema: () => insertProviderActivityLogSchema,
  insertProviderDocumentSchema: () => insertProviderDocumentSchema,
  insertProviderLeadInteractionSchema: () => insertProviderLeadInteractionSchema,
  insertProviderLeadStatusSchema: () => insertProviderLeadStatusSchema,
  insertProviderNotificationSchema: () => insertProviderNotificationSchema,
  insertProviderPasswordResetTokenSchema: () => insertProviderPasswordResetTokenSchema,
  insertProviderPaymentMethodSchema: () => insertProviderPaymentMethodSchema,
  insertProviderPostcodeCoverageSchema: () => insertProviderPostcodeCoverageSchema,
  insertProviderRatingSchema: () => insertProviderRatingSchema,
  insertProviderServiceAreaSchema: () => insertProviderServiceAreaSchema,
  insertProviderServiceSchema: () => insertProviderServiceSchema,
  insertReviewTokenSchema: () => insertReviewTokenSchema,
  insertRolePermissionSchema: () => insertRolePermissionSchema,
  insertRoleSchema: () => insertRoleSchema,
  insertSentEmailSchema: () => insertSentEmailSchema,
  insertServiceCategorySchema: () => insertServiceCategorySchema,
  insertServiceProviderSchema: () => insertServiceProviderSchema,
  insertServiceRequestSchema: () => insertServiceRequestSchema,
  insertSmsCampaignSchema: () => insertSmsCampaignSchema,
  insertSmsMessageSchema: () => insertSmsMessageSchema,
  insertSystemSettingSchema: () => insertSystemSettingSchema,
  insertTeamTaskSchema: () => insertTeamTaskSchema,
  insertTermsAndConditionsSchema: () => insertTermsAndConditionsSchema,
  insertUserActivityLogSchema: () => insertUserActivityLogSchema,
  insertUserSchema: () => insertUserSchema,
  leadAssignments: () => leadAssignments,
  leadAssignmentsRelations: () => leadAssignmentsRelations,
  leadDistributionLog: () => leadDistributionLog2,
  leadNotes: () => leadNotes,
  leadOffers: () => leadOffers,
  leadPurchases: () => leadPurchases,
  leadSettings: () => leadSettings,
  passwordResetTokens: () => passwordResetTokens,
  permissions: () => permissions,
  permissionsRelations: () => permissionsRelations,
  potentialCustomers: () => potentialCustomers,
  potentialCustomersRelations: () => potentialCustomersRelations,
  potentialProviderCommunications: () => potentialProviderCommunications,
  potentialProviderTasks: () => potentialProviderTasks,
  potentialProviders: () => potentialProviders,
  providerActivityLogs: () => providerActivityLogs,
  providerActivityLogsRelations: () => providerActivityLogsRelations,
  providerCreditTransactions: () => providerCreditTransactions,
  providerDocuments: () => providerDocuments,
  providerDocumentsRelations: () => providerDocumentsRelations,
  providerLeadInteractions: () => providerLeadInteractions,
  providerLeadStatus: () => providerLeadStatus,
  providerNotifications: () => providerNotifications,
  providerPasswordResetTokens: () => providerPasswordResetTokens,
  providerPaymentMethods: () => providerPaymentMethods,
  providerPostcodeCoverage: () => providerPostcodeCoverage,
  providerRatings: () => providerRatings,
  providerServiceAreas: () => providerServiceAreas,
  providerServiceAreasRelations: () => providerServiceAreasRelations,
  providerServices: () => providerServices,
  providerServicesRelations: () => providerServicesRelations,
  providerVouchers: () => providerVouchers,
  reviewTokens: () => reviewTokens,
  rolePermissions: () => rolePermissions,
  rolePermissionsRelations: () => rolePermissionsRelations,
  roles: () => roles,
  rolesRelations: () => rolesRelations,
  sentEmails: () => sentEmails,
  sentEmailsRelations: () => sentEmailsRelations,
  serviceCategories: () => serviceCategories,
  serviceCategoriesRelations: () => serviceCategoriesRelations,
  serviceProviders: () => serviceProviders,
  serviceProvidersRelations: () => serviceProvidersRelations,
  serviceRequests: () => serviceRequests,
  serviceRequestsRelations: () => serviceRequestsRelations,
  sessions: () => sessions,
  smsCampaigns: () => smsCampaigns,
  smsMessages: () => smsMessages,
  systemSettings: () => systemSettings,
  teamTasks: () => teamTasks,
  termsAndConditions: () => termsAndConditions,
  userActivityLogs: () => userActivityLogs,
  userActivityLogsRelations: () => userActivityLogsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
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
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var sessions, users, serviceProviders, providerPaymentMethods, serviceCategories, providerServices, australianStates, australianRegions, australianSuburbs, providerServiceAreas, providerDocuments, serviceRequests, leadAssignments, providerRatings, leadOffers, leadDistributionLog2, providerPostcodeCoverage, emailTemplates, sentEmails, emails, emailAttachments, emailLabels, emailLabelRelations, userActivityLogs, systemSettings, passwordResetTokens, providerPasswordResetTokens, providerActivityLogs, providerVouchers, providerCreditTransactions, leadPurchases, customerVouchers, customerCreditTransactions, adminDepartments, adminUsers, adminUserDepartments, roles, permissions, rolePermissions, usersRelations, rolesRelations, permissionsRelations, rolePermissionsRelations, serviceProvidersRelations, serviceCategoriesRelations, providerServicesRelations, australianStatesRelations, australianRegionsRelations, australianSuburbsRelations, providerServiceAreasRelations, providerDocumentsRelations, serviceRequestsRelations, leadAssignmentsRelations, emailTemplatesRelations, sentEmailsRelations, emailsRelations, emailAttachmentsRelations, emailLabelsRelations, emailLabelRelationsRelations, userActivityLogsRelations, providerActivityLogsRelations, insertUserSchema, insertServiceProviderSchema, insertServiceCategorySchema, insertProviderServiceSchema, insertProviderServiceAreaSchema, insertProviderDocumentSchema, insertServiceRequestSchema, insertLeadAssignmentSchema, insertEmailTemplateSchema, insertSentEmailSchema, insertUserActivityLogSchema, insertSystemSettingSchema, insertProviderPaymentMethodSchema, insertPasswordResetTokenSchema, insertProviderPasswordResetTokenSchema, insertProviderActivityLogSchema, insertProviderRatingSchema, insertLeadOfferSchema, insertLeadDistributionLogSchema, insertProviderPostcodeCoverageSchema, insertCustomerVoucherSchema, insertCustomerCreditTransactionSchema, insertAdminDepartmentSchema, insertAdminUserSchema, insertAdminUserDepartmentSchema, insertRoleSchema, insertPermissionSchema, insertRolePermissionSchema, insertEmailSchema, insertEmailAttachmentSchema, insertEmailLabelSchema, insertEmailLabelRelationSchema, leadSettings, categoryLeadPricing, leadNotes, providerLeadInteractions, providerLeadStatus, customerReviews, reviewTokens, insertLeadNoteSchema, insertProviderLeadInteractionSchema, insertProviderLeadStatusSchema, insertCustomerReviewSchema, insertReviewTokenSchema, potentialCustomers, potentialCustomersRelations, termsAndConditions, insertTermsAndConditionsSchema, insertPotentialCustomerSchema, potentialProviders, potentialProviderTasks, potentialProviderCommunications, insertPotentialProviderSchema, insertPotentialProviderTaskSchema, insertPotentialProviderCommunicationSchema, smsMessages, insertSmsMessageSchema, providerNotifications, insertProviderNotificationSchema, teamTasks, insertTeamTaskSchema, smsCampaigns, insertSmsCampaignSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").unique().notNull(),
      password: varchar("password"),
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      phoneNumber: varchar("phone_number"),
      profileImageUrl: varchar("profile_image_url"),
      lastLogin: timestamp("last_login"),
      // Credit balance for customer vouchers
      creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default("0.00"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    serviceProviders = pgTable("service_providers", {
      id: serial("id").primaryKey(),
      firstName: varchar("first_name").notNull(),
      lastName: varchar("last_name").notNull(),
      email: varchar("email").unique().notNull(),
      password: varchar("password").notNull(),
      mobileNumber: varchar("mobile_number").notNull(),
      address: text("address").notNull(),
      businessName: varchar("business_name"),
      businessAbn: varchar("business_abn"),
      status: varchar("status").default("pending"),
      // pending, approved, rejected
      providerStatus: varchar("provider_status").default("deactivated"),
      // activated, deactivated
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
      firstLeadsFreeUsed: integer("first_leads_free_used").default(0),
      // Track how many of first 3 free leads used
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    providerPaymentMethods = pgTable("provider_payment_methods", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    serviceCategories = pgTable("service_categories", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      icon: varchar("icon").notNull(),
      description: text("description"),
      imageUrl: text("image_url").default(""),
      // URL to uploaded image
      active: boolean("active").default(true),
      popular: boolean("popular").default(false),
      trending: boolean("trending").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    providerServices = pgTable("provider_services", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      categoryId: integer("category_id").references(() => serviceCategories.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    australianStates = pgTable("australian_states", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      abbreviation: varchar("abbreviation").notNull()
    });
    australianRegions = pgTable("australian_regions", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      // e.g., "Gold Coast", "Newcastle and Lake Macquarie"
      code: varchar("code").notNull(),
      // SA4 code e.g., "30504"
      stateId: integer("state_id").references(() => australianStates.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    australianSuburbs = pgTable("australian_suburbs", {
      id: serial("id").primaryKey(),
      postcode: varchar("postcode").notNull(),
      suburb: varchar("suburb").notNull(),
      stateId: integer("state_id").references(() => australianStates.id).notNull(),
      regionId: integer("region_id").references(() => australianRegions.id),
      // Link to SA4 region
      latitude: decimal("latitude", { precision: 10, scale: 8 }),
      // Coordinates for distance calculations
      longitude: decimal("longitude", { precision: 11, scale: 8 })
      // Coordinates for distance calculations
    });
    providerServiceAreas = pgTable("provider_service_areas", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      // Location-based service areas
      centerAddress: text("center_address").notNull(),
      // Full address of service center
      centerLat: decimal("center_lat", { precision: 10, scale: 7 }),
      // Latitude
      centerLng: decimal("center_lng", { precision: 10, scale: 7 }),
      // Longitude
      radiusKm: integer("radius_km").notNull().default(25),
      // Service radius in kilometers
      areaName: varchar("area_name"),
      // Optional friendly name (e.g., "Gold Coast", "Brisbane North")
      // Legacy suburb-based approach (keeping for backwards compatibility)
      suburbId: integer("suburb_id").references(() => australianSuburbs.id),
      createdAt: timestamp("created_at").defaultNow()
    });
    providerDocuments = pgTable("provider_documents", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      documentType: varchar("document_type").notNull(),
      // license, police_check, insurance
      fileName: varchar("file_name").notNull(),
      filePath: varchar("file_path").notNull(),
      fileSize: integer("file_size"),
      mimeType: varchar("mime_type"),
      status: varchar("status").default("pending"),
      // pending, approved, rejected
      uploadedAt: timestamp("uploaded_at").defaultNow()
    });
    serviceRequests = pgTable("service_requests", {
      id: serial("id").primaryKey(),
      customerId: varchar("customer_id").references(() => users.id).notNull(),
      categoryId: integer("category_id").references(() => serviceCategories.id).notNull(),
      description: text("description").notNull(),
      postcode: varchar("postcode").notNull(),
      suburb: varchar("suburb").notNull(),
      propertyType: varchar("property_type"),
      urgency: varchar("urgency"),
      budget: decimal("budget", { precision: 10, scale: 2 }),
      preferredDate: timestamp("preferred_date"),
      // When customer wants the job done
      bookingType: varchar("booking_type"),
      // Type of booking requested
      scheduledDate: timestamp("scheduled_date"),
      // Actual date job is scheduled for
      status: varchar("status").default("active"),
      // active, assigned, completed, cancelled
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadAssignments = pgTable("lead_assignments", {
      id: serial("id").primaryKey(),
      requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      status: varchar("status").default("pending"),
      // pending, accepted, declined
      acceptedAt: timestamp("accepted_at"),
      declinedAt: timestamp("declined_at"),
      isFree: boolean("is_free").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    providerRatings = pgTable("provider_ratings", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      rating: decimal("rating", { precision: 3, scale: 1 }).notNull().default("5.0"),
      totalReviews: integer("total_reviews").default(0),
      averageResponseTime: integer("average_response_time").default(30),
      // minutes
      completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("100.00"),
      // percentage
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadOffers = pgTable("lead_offers", {
      id: serial("id").primaryKey(),
      requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      offerType: varchar("offer_type").notNull(),
      // 'unique' or 'shared'
      leadCost: decimal("lead_cost", { precision: 10, scale: 2 }).notNull(),
      status: varchar("status").default("pending"),
      // pending, purchased, expired, declined
      offerStartTime: timestamp("offer_start_time").defaultNow(),
      offerEndTime: timestamp("offer_end_time"),
      purchasedAt: timestamp("purchased_at"),
      expiresAt: timestamp("expires_at"),
      sortOrder: integer("sort_order").default(0),
      // for rating-based ordering
      isCurrentOffer: boolean("is_current_offer").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadDistributionLog2 = pgTable("lead_distribution_log", {
      id: serial("id").primaryKey(),
      requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
      distributionPhase: varchar("distribution_phase").notNull(),
      // 'unique' or 'shared'
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    providerPostcodeCoverage = pgTable("provider_postcode_coverage", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id, { onDelete: "cascade" }).notNull(),
      serviceAreaId: integer("service_area_id").references(() => providerServiceAreas.id, { onDelete: "cascade" }).notNull(),
      postcode: varchar("postcode", { length: 10 }).notNull(),
      distance: decimal("distance", { precision: 8, scale: 2 }),
      // Distance in kilometers from provider center
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      // Ensure unique combination of provider, service area, and postcode
      uniqueCoverage: uniqueIndex("provider_service_area_postcode_unique").on(
        table.providerId,
        table.serviceAreaId,
        table.postcode
      ),
      // Index for fast lookups by provider and postcode
      providerPostcodeIdx: index("provider_postcode_idx").on(table.providerId, table.postcode)
    }));
    emailTemplates = pgTable("email_templates", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      subject: varchar("subject").notNull(),
      body: text("body").notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    sentEmails = pgTable("sent_emails", {
      id: serial("id").primaryKey(),
      recipientId: varchar("recipient_id").references(() => users.id),
      recipientEmail: varchar("recipient_email").notNull(),
      subject: varchar("subject").notNull(),
      body: text("body").notNull(),
      templateId: integer("template_id").references(() => emailTemplates.id),
      status: varchar("status").default("pending"),
      // pending, sent, failed
      sentAt: timestamp("sent_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    emails = pgTable("emails", {
      id: serial("id").primaryKey(),
      from: varchar("from").notNull(),
      // sender email
      to: varchar("to").notNull(),
      // recipient email(s)
      cc: varchar("cc"),
      // CC recipients
      bcc: varchar("bcc"),
      // BCC recipients
      subject: varchar("subject").notNull(),
      body: text("body").notNull(),
      bodyHtml: text("body_html"),
      // HTML version of body
      status: varchar("status", { length: 20 }).default("inbox").notNull(),
      // inbox, sent, draft, trash, spam, archive
      isRead: boolean("is_read").default(false),
      isStarred: boolean("is_starred").default(false),
      hasAttachments: boolean("has_attachments").default(false),
      priority: varchar("priority", { length: 10 }).default("normal"),
      // low, normal, high, urgent
      folder: varchar("folder", { length: 50 }).default("inbox"),
      // inbox, sent, draft, trash, spam, archive
      userId: varchar("user_id").references(() => users.id),
      // user this email belongs to
      userType: varchar("user_type", { length: 20 }),
      // customer, provider, admin
      providerId: integer("provider_id").references(() => serviceProviders.id),
      // if email is for a provider
      threadId: varchar("thread_id"),
      // for grouping related emails
      parentEmailId: integer("parent_email_id"),
      // for replies/forwards - will be set after table creation
      sentAt: timestamp("sent_at"),
      readAt: timestamp("read_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    emailAttachments = pgTable("email_attachments", {
      id: serial("id").primaryKey(),
      emailId: integer("email_id").references(() => emails.id).notNull(),
      filename: varchar("filename").notNull(),
      originalName: varchar("original_name").notNull(),
      mimeType: varchar("mime_type").notNull(),
      size: integer("size").notNull(),
      // file size in bytes
      filePath: varchar("file_path").notNull(),
      // path to stored file
      createdAt: timestamp("created_at").defaultNow()
    });
    emailLabels = pgTable("email_labels", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      color: varchar("color", { length: 7 }).default("#3B82F6"),
      // hex color
      userId: varchar("user_id").references(() => users.id),
      // null for global labels
      createdAt: timestamp("created_at").defaultNow()
    });
    emailLabelRelations = pgTable("email_label_relations", {
      id: serial("id").primaryKey(),
      emailId: integer("email_id").references(() => emails.id).notNull(),
      labelId: integer("label_id").references(() => emailLabels.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    userActivityLogs = pgTable("user_activity_logs", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      userType: varchar("user_type").notNull(),
      // customer, provider, admin
      action: varchar("action").notNull(),
      details: jsonb("details"),
      ipAddress: varchar("ip_address"),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow()
    });
    systemSettings = pgTable("system_settings", {
      id: serial("id").primaryKey(),
      key: varchar("key").notNull().unique(),
      value: text("value"),
      description: text("description"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    passwordResetTokens = pgTable("password_reset_tokens", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      token: varchar("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      usedAt: timestamp("used_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    providerPasswordResetTokens = pgTable("provider_password_reset_tokens", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      token: varchar("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      usedAt: timestamp("used_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    providerActivityLogs = pgTable("provider_activity_logs", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      activityType: varchar("activity_type", { length: 50 }).notNull(),
      // 'status_change', 'service_update', 'area_update', 'details_update', 'document_update'
      actorType: varchar("actor_type", { length: 20 }).notNull(),
      // 'admin', 'provider'
      actorId: varchar("actor_id", { length: 50 }),
      // admin username or provider ID
      actorName: varchar("actor_name", { length: 100 }),
      // display name
      description: text("description").notNull(),
      // human-readable description
      oldValue: text("old_value"),
      // JSON string of old data
      newValue: text("new_value"),
      // JSON string of new data
      timestamp: timestamp("timestamp").defaultNow().notNull()
    });
    providerVouchers = pgTable("provider_vouchers", {
      id: serial("id").primaryKey(),
      code: varchar("code", { length: 6 }).notNull().unique(),
      // 6-digit alphanumeric code
      value: decimal("value", { precision: 10, scale: 2 }).notNull(),
      // Dollar value of voucher (default $50)
      description: text("description"),
      // Description of what voucher is for
      status: varchar("status", { length: 20 }).default("active").notNull(),
      // 'active', 'closed', 'expired'
      expiryDate: timestamp("expiry_date").notNull(),
      // Date when voucher expires (30 days from creation)
      redeemedBy: integer("redeemed_by").references(() => serviceProviders.id),
      // Provider who redeemed it
      redeemedAt: timestamp("redeemed_at"),
      // When it was redeemed
      createdBy: varchar("created_by").default("admin"),
      // Admin who created the voucher
      createdAt: timestamp("created_at").defaultNow()
    });
    providerCreditTransactions = pgTable("provider_credit_transactions", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      transactionType: varchar("transaction_type").notNull(),
      // 'credit', 'debit', 'voucher_redemption', 'free_lead', 'lead_purchase'
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      // Positive for credits, negative for debits
      balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }).notNull(),
      balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
      description: text("description").notNull(),
      // Human readable description
      // Related records for tracking
      leadOfferId: integer("lead_offer_id").references(() => leadOffers.id),
      // If related to lead purchase
      voucherCode: varchar("voucher_code", { length: 50 }),
      // If voucher was used
      stripePaymentIntentId: varchar("stripe_payment_intent_id"),
      // If actual payment was made
      createdAt: timestamp("created_at").defaultNow()
    });
    leadPurchases = pgTable("lead_purchases", {
      id: serial("id").primaryKey(),
      leadOfferId: integer("lead_offer_id").references(() => leadOffers.id).notNull(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
      totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
      creditUsed: decimal("credit_used", { precision: 10, scale: 2 }).default("0.00"),
      amountCharged: decimal("amount_charged", { precision: 10, scale: 2 }).default("0.00"),
      paymentMethod: varchar("payment_method").notNull(),
      // 'credit_only', 'card_only', 'credit_and_card', 'free_lead'
      stripePaymentIntentId: varchar("stripe_payment_intent_id"),
      // If card was charged
      isFreeLeadUsed: boolean("is_free_lead_used").default(false),
      // If this was one of first 3 free leads
      purchasedAt: timestamp("purchased_at").defaultNow()
    });
    customerVouchers = pgTable("customer_vouchers", {
      id: serial("id").primaryKey(),
      code: varchar("code", { length: 6 }).notNull().unique(),
      // 6-digit alphanumeric code
      value: decimal("value", { precision: 10, scale: 2 }).notNull(),
      // Dollar value of voucher (default $50)
      description: text("description"),
      // Description of what voucher is for
      status: varchar("status", { length: 20 }).default("active").notNull(),
      // 'active', 'closed', 'expired'
      expiryDate: timestamp("expiry_date").notNull(),
      // Date when voucher expires (30 days from creation)
      redeemedBy: varchar("redeemed_by").references(() => users.id),
      // Customer who redeemed it
      redeemedAt: timestamp("redeemed_at"),
      // When it was redeemed
      createdBy: varchar("created_by").default("admin"),
      // Admin who created the voucher
      createdAt: timestamp("created_at").defaultNow()
    });
    customerCreditTransactions = pgTable("customer_credit_transactions", {
      id: serial("id").primaryKey(),
      customerId: varchar("customer_id").references(() => users.id).notNull(),
      transactionType: varchar("transaction_type").notNull(),
      // 'credit', 'debit', 'voucher_redemption', 'service_payment'
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      // Positive for credits, negative for debits
      balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }).notNull(),
      balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
      description: text("description").notNull(),
      // Human readable description
      // Related records for tracking
      serviceRequestId: integer("service_request_id").references(() => serviceRequests.id),
      // If related to service payment
      voucherCode: varchar("voucher_code", { length: 50 }),
      // If voucher was used
      stripePaymentIntentId: varchar("stripe_payment_intent_id"),
      // If actual payment was made
      createdAt: timestamp("created_at").defaultNow()
    });
    adminDepartments = pgTable("admin_departments", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    adminUsers = pgTable("admin_users", {
      id: serial("id").primaryKey(),
      username: varchar("username").unique().notNull(),
      email: varchar("email").unique().notNull(),
      password: varchar("password").notNull(),
      firstName: varchar("first_name").notNull(),
      lastName: varchar("last_name").notNull(),
      role: varchar("role").notNull(),
      // administrator, manager, team_member
      status: varchar("status").default("active"),
      // active, inactive
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    adminUserDepartments = pgTable("admin_user_departments", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => adminUsers.id).notNull(),
      departmentId: integer("department_id").references(() => adminDepartments.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    roles = pgTable("roles", {
      id: serial("id").primaryKey(),
      name: varchar("name").unique().notNull(),
      description: text("description"),
      isDefault: boolean("is_default").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    permissions = pgTable("permissions", {
      id: serial("id").primaryKey(),
      name: varchar("name").unique().notNull(),
      description: text("description"),
      category: varchar("category").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    rolePermissions = pgTable("role_permissions", {
      id: serial("id").primaryKey(),
      roleId: integer("role_id").references(() => roles.id).notNull(),
      permissionId: integer("permission_id").references(() => permissions.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    usersRelations = relations(users, ({ many }) => ({
      serviceRequests: many(serviceRequests),
      sentEmails: many(sentEmails),
      activityLogs: many(userActivityLogs)
    }));
    rolesRelations = relations(roles, ({ many }) => ({
      rolePermissions: many(rolePermissions)
    }));
    permissionsRelations = relations(permissions, ({ many }) => ({
      rolePermissions: many(rolePermissions)
    }));
    rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
      role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id]
      }),
      permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id]
      })
    }));
    serviceProvidersRelations = relations(serviceProviders, ({ many }) => ({
      services: many(providerServices),
      serviceAreas: many(providerServiceAreas),
      documents: many(providerDocuments),
      leadAssignments: many(leadAssignments),
      activityLogs: many(providerActivityLogs)
    }));
    serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
      providerServices: many(providerServices),
      serviceRequests: many(serviceRequests)
    }));
    providerServicesRelations = relations(providerServices, ({ one }) => ({
      provider: one(serviceProviders, { fields: [providerServices.providerId], references: [serviceProviders.id] }),
      category: one(serviceCategories, { fields: [providerServices.categoryId], references: [serviceCategories.id] })
    }));
    australianStatesRelations = relations(australianStates, ({ many }) => ({
      regions: many(australianRegions),
      suburbs: many(australianSuburbs)
    }));
    australianRegionsRelations = relations(australianRegions, ({ one, many }) => ({
      state: one(australianStates, { fields: [australianRegions.stateId], references: [australianStates.id] }),
      suburbs: many(australianSuburbs)
    }));
    australianSuburbsRelations = relations(australianSuburbs, ({ one, many }) => ({
      state: one(australianStates, { fields: [australianSuburbs.stateId], references: [australianStates.id] }),
      region: one(australianRegions, { fields: [australianSuburbs.regionId], references: [australianRegions.id] }),
      providerServiceAreas: many(providerServiceAreas)
    }));
    providerServiceAreasRelations = relations(providerServiceAreas, ({ one }) => ({
      provider: one(serviceProviders, { fields: [providerServiceAreas.providerId], references: [serviceProviders.id] }),
      suburb: one(australianSuburbs, { fields: [providerServiceAreas.suburbId], references: [australianSuburbs.id] })
    }));
    providerDocumentsRelations = relations(providerDocuments, ({ one }) => ({
      provider: one(serviceProviders, { fields: [providerDocuments.providerId], references: [serviceProviders.id] })
    }));
    serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
      customer: one(users, { fields: [serviceRequests.customerId], references: [users.id] }),
      category: one(serviceCategories, { fields: [serviceRequests.categoryId], references: [serviceCategories.id] }),
      leadAssignments: many(leadAssignments)
    }));
    leadAssignmentsRelations = relations(leadAssignments, ({ one }) => ({
      request: one(serviceRequests, { fields: [leadAssignments.requestId], references: [serviceRequests.id] }),
      provider: one(serviceProviders, { fields: [leadAssignments.providerId], references: [serviceProviders.id] })
    }));
    emailTemplatesRelations = relations(emailTemplates, ({ many }) => ({
      sentEmails: many(sentEmails)
    }));
    sentEmailsRelations = relations(sentEmails, ({ one }) => ({
      recipient: one(users, { fields: [sentEmails.recipientId], references: [users.id] }),
      template: one(emailTemplates, { fields: [sentEmails.templateId], references: [emailTemplates.id] })
    }));
    emailsRelations = relations(emails, ({ one, many }) => ({
      user: one(users, { fields: [emails.userId], references: [users.id] }),
      provider: one(serviceProviders, { fields: [emails.providerId], references: [serviceProviders.id] }),
      parentEmail: one(emails, { fields: [emails.parentEmailId], references: [emails.id] }),
      attachments: many(emailAttachments),
      labelRelations: many(emailLabelRelations)
    }));
    emailAttachmentsRelations = relations(emailAttachments, ({ one }) => ({
      email: one(emails, { fields: [emailAttachments.emailId], references: [emails.id] })
    }));
    emailLabelsRelations = relations(emailLabels, ({ one, many }) => ({
      user: one(users, { fields: [emailLabels.userId], references: [users.id] }),
      emailRelations: many(emailLabelRelations)
    }));
    emailLabelRelationsRelations = relations(emailLabelRelations, ({ one }) => ({
      email: one(emails, { fields: [emailLabelRelations.emailId], references: [emails.id] }),
      label: one(emailLabels, { fields: [emailLabelRelations.labelId], references: [emailLabels.id] })
    }));
    userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
      user: one(users, { fields: [userActivityLogs.userId], references: [users.id] })
    }));
    providerActivityLogsRelations = relations(providerActivityLogs, ({ one }) => ({
      provider: one(serviceProviders, { fields: [providerActivityLogs.providerId], references: [serviceProviders.id] })
    }));
    insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
    insertServiceProviderSchema = createInsertSchema(serviceProviders).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
      id: true,
      createdAt: true
    });
    insertProviderServiceSchema = createInsertSchema(providerServices).omit({
      id: true,
      createdAt: true
    });
    insertProviderServiceAreaSchema = createInsertSchema(providerServiceAreas).omit({
      id: true,
      createdAt: true
    });
    insertProviderDocumentSchema = createInsertSchema(providerDocuments).omit({
      id: true,
      uploadedAt: true
    });
    insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }).extend({
      preferredDate: z.coerce.date().optional(),
      scheduledDate: z.coerce.date().optional()
    });
    insertLeadAssignmentSchema = createInsertSchema(leadAssignments).omit({
      id: true,
      createdAt: true
    });
    insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSentEmailSchema = createInsertSchema(sentEmails).omit({
      id: true,
      createdAt: true
    });
    insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({
      id: true,
      createdAt: true
    });
    insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
      id: true,
      updatedAt: true
    });
    insertProviderPaymentMethodSchema = createInsertSchema(providerPaymentMethods).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
      id: true,
      createdAt: true
    });
    insertProviderPasswordResetTokenSchema = createInsertSchema(providerPasswordResetTokens).omit({
      id: true,
      createdAt: true
    });
    insertProviderActivityLogSchema = createInsertSchema(providerActivityLogs).omit({
      id: true,
      timestamp: true
    });
    insertProviderRatingSchema = createInsertSchema(providerRatings).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertLeadOfferSchema = createInsertSchema(leadOffers).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertLeadDistributionLogSchema = createInsertSchema(leadDistributionLog2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertProviderPostcodeCoverageSchema = createInsertSchema(providerPostcodeCoverage).omit({
      id: true,
      createdAt: true
    });
    insertCustomerVoucherSchema = createInsertSchema(customerVouchers).omit({
      id: true,
      createdAt: true
    });
    insertCustomerCreditTransactionSchema = createInsertSchema(customerCreditTransactions).omit({
      id: true,
      createdAt: true
    });
    insertAdminDepartmentSchema = createInsertSchema(adminDepartments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertAdminUserSchema = createInsertSchema(adminUsers).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertAdminUserDepartmentSchema = createInsertSchema(adminUserDepartments).omit({
      id: true,
      createdAt: true
    });
    insertRoleSchema = createInsertSchema(roles).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPermissionSchema = createInsertSchema(permissions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
      id: true,
      createdAt: true
    });
    insertEmailSchema = createInsertSchema(emails).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertEmailAttachmentSchema = createInsertSchema(emailAttachments).omit({
      id: true,
      createdAt: true
    });
    insertEmailLabelSchema = createInsertSchema(emailLabels).omit({
      id: true,
      createdAt: true
    });
    insertEmailLabelRelationSchema = createInsertSchema(emailLabelRelations).omit({
      id: true,
      createdAt: true
    });
    leadSettings = pgTable("lead_settings", {
      id: serial("id").primaryKey(),
      pricingModel: varchar("pricing_model", { length: 50 }).notNull().default("uniform"),
      // 'uniform' or 'category'
      uniformUniquePrice: decimal("uniform_unique_price", { precision: 10, scale: 2 }).default("25.00"),
      uniformSharePrice: decimal("uniform_share_price", { precision: 10, scale: 2 }).default("12.00"),
      uniqueOfferWindow: integer("unique_offer_window").default(2),
      // minutes
      maxProvidersPerArea: integer("max_providers_per_area").default(10),
      minProviderRating: decimal("min_provider_rating", { precision: 3, scale: 1 }).default("3.0"),
      providerRestrictionsActive: boolean("provider_restrictions_active").default(false),
      firstThreeLeadBehavior: varchar("first_three_lead_behavior", { length: 20 }).notNull().default("shared"),
      // 'new' or 'shared'
      freeLeadsEnabled: boolean("free_leads_enabled").default(true),
      // Enable/disable free leads for new providers
      oneMinuteCronActive: boolean("one_minute_cron_active").default(true),
      // controls if 1-minute lead offer cron runs
      providersCanRedeemCredits: boolean("providers_can_redeem_credits").default(true),
      // Enable/disable credit redemption for providers
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    categoryLeadPricing = pgTable("category_lead_pricing", {
      id: serial("id").primaryKey(),
      categoryId: integer("category_id").references(() => serviceCategories.id),
      uniquePrice: decimal("unique_price", { precision: 10, scale: 2 }).notNull(),
      sharePrice: decimal("share_price", { precision: 10, scale: 2 }).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadNotes = pgTable("lead_notes", {
      id: serial("id").primaryKey(),
      leadId: integer("lead_id").references(() => serviceRequests.id),
      note: text("note").notNull(),
      adminName: varchar("admin_name", { length: 255 }).default("admin"),
      createdAt: timestamp("created_at").defaultNow()
    });
    providerLeadInteractions = pgTable("provider_lead_interactions", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id),
      leadId: integer("lead_id").references(() => serviceRequests.id),
      interactionType: varchar("interaction_type", { length: 50 }).notNull(),
      // 'call', 'sms', 'email'
      createdAt: timestamp("created_at").defaultNow()
    });
    providerLeadStatus = pgTable("provider_lead_status", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      leadId: integer("lead_id").references(() => serviceRequests.id).notNull(),
      status: varchar("status").default("new").notNull(),
      // 'new', 'open', 'closed'
      wasJobBooked: boolean("was_job_booked"),
      // null until lead is closed, then true/false
      statusUpdatedAt: timestamp("status_updated_at").defaultNow(),
      closedAt: timestamp("closed_at"),
      // when lead was marked as closed
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      // Ensure unique combination of provider and lead
      uniqueProviderLead: uniqueIndex("provider_lead_status_unique").on(
        table.providerId,
        table.leadId
      )
    }));
    customerReviews = pgTable("customer_reviews", {
      id: serial("id").primaryKey(),
      customerId: varchar("customer_id").references(() => users.id).notNull(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
      overallRating: integer("overall_rating").notNull(),
      // 1-5 stars
      qualityRating: integer("quality_rating").notNull(),
      // 1-5 stars  
      professionalismRating: integer("professionalism_rating").notNull(),
      // 1-5 stars
      timelinessRating: integer("timeliness_rating").notNull(),
      // 1-5 stars
      valueRating: integer("value_rating").notNull(),
      // 1-5 stars
      reviewText: text("review_text"),
      // Optional written review
      isPublic: boolean("is_public").default(true),
      // Can be displayed publicly
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      // Ensure one review per customer-provider-request combination
      uniqueReview: uniqueIndex("unique_customer_provider_request_review").on(
        table.customerId,
        table.providerId,
        table.requestId
      )
    }));
    reviewTokens = pgTable("review_tokens", {
      id: serial("id").primaryKey(),
      token: varchar("token", { length: 64 }).unique().notNull(),
      // Secure random token
      customerId: varchar("customer_id").references(() => users.id).notNull(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      requestId: integer("request_id").references(() => serviceRequests.id).notNull(),
      isUsed: boolean("is_used").default(false),
      expiresAt: timestamp("expires_at").notNull(),
      // Token expiry (e.g., 30 days)
      usedAt: timestamp("used_at"),
      // When token was used
      createdAt: timestamp("created_at").defaultNow()
    });
    insertLeadNoteSchema = createInsertSchema(leadNotes).omit({
      id: true,
      createdAt: true
    });
    insertProviderLeadInteractionSchema = createInsertSchema(providerLeadInteractions).omit({
      id: true,
      createdAt: true
    });
    insertProviderLeadStatusSchema = createInsertSchema(providerLeadStatus).omit({
      id: true,
      createdAt: true,
      statusUpdatedAt: true
    });
    insertCustomerReviewSchema = createInsertSchema(customerReviews).omit({
      id: true,
      createdAt: true
    });
    insertReviewTokenSchema = createInsertSchema(reviewTokens).omit({
      id: true,
      createdAt: true
    });
    potentialCustomers = pgTable("potential_customers", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      email: varchar("email").notNull(),
      phone: varchar("phone").notNull(),
      state: varchar("state").notNull(),
      city: varchar("city").notNull(),
      address: text("address").notNull(),
      region: varchar("region", { length: 100 }),
      // Region field for filtering
      importId: varchar("import_id").notNull(),
      // Unique identifier for batch imports
      importName: varchar("import_name").notNull(),
      // Label to identify imported groups
      smsDeliveryStatus: varchar("sms_delivery_status", { length: 20 }).default("not_sent"),
      // not_sent, 1st_sent, 2nd_sent
      campaignStatus: varchar("campaign_status", { length: 50 }).default("New"),
      // New, Added to Campaign, Lost, Won, Unsubscribe
      firstSmsSentAt: timestamp("first_sms_sent_at"),
      secondSmsSentAt: timestamp("second_sms_sent_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    potentialCustomersRelations = relations(potentialCustomers, ({ one }) => ({}));
    termsAndConditions = pgTable("terms_and_conditions", {
      id: serial("id").primaryKey(),
      providersTerms: text("providers_terms"),
      customersTerms: text("customers_terms"),
      websiteTerms: text("website_terms"),
      providersUpdatedAt: timestamp("providers_updated_at"),
      customersUpdatedAt: timestamp("customers_updated_at"),
      websiteUpdatedAt: timestamp("website_updated_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertTermsAndConditionsSchema = createInsertSchema(termsAndConditions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPotentialCustomerSchema = createInsertSchema(potentialCustomers).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    potentialProviders = pgTable("potential_providers", {
      id: serial("id").primaryKey(),
      firstName: varchar("first_name").notNull(),
      lastName: varchar("last_name").notNull(),
      email: varchar("email").notNull(),
      phone: varchar("phone").notNull(),
      businessName: varchar("business_name"),
      businessAbn: varchar("business_abn"),
      address: text("address").notNull(),
      state: varchar("state").notNull(),
      city: varchar("city").notNull(),
      postcode: varchar("postcode").notNull(),
      serviceCategories: text("service_categories"),
      // JSON array of service categories
      source: varchar("source").default("manual"),
      // manual, import, referral
      importId: varchar("import_id"),
      // For batch imports
      importName: varchar("import_name"),
      // Label for imported groups
      status: varchar("status").default("new"),
      // new, first_call, follow_up, email, won, lost
      priority: varchar("priority").default("medium"),
      // low, medium, high, urgent
      assignedTo: varchar("assigned_to"),
      // Admin username assigned to this potential provider
      smsDeliveryStatus: varchar("sms_delivery_status", { length: 20 }).default("not_sent"),
      // not_sent, 1st_sent, 2nd_sent
      firstSmsSentAt: timestamp("first_sms_sent_at"),
      secondSmsSentAt: timestamp("second_sms_sent_at"),
      notes: text("notes"),
      nextFollowUpDate: timestamp("next_follow_up_date"),
      lastContactDate: timestamp("last_contact_date"),
      lastContactType: varchar("last_contact_type"),
      // call, email, sms
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    potentialProviderTasks = pgTable("potential_provider_tasks", {
      id: serial("id").primaryKey(),
      potentialProviderId: integer("potential_provider_id").references(() => potentialProviders.id).notNull(),
      taskType: varchar("task_type").notNull(),
      // call, email, sms, follow_up, note
      status: varchar("status").default("pending"),
      // pending, completed, cancelled
      title: varchar("title").notNull(),
      description: text("description"),
      scheduledDate: timestamp("scheduled_date"),
      completedDate: timestamp("completed_date"),
      assignedTo: varchar("assigned_to"),
      // Admin username
      result: varchar("result"),
      // success, no_answer, busy, voicemail, etc.
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    potentialProviderCommunications = pgTable("potential_provider_communications", {
      id: serial("id").primaryKey(),
      potentialProviderId: integer("potential_provider_id").references(() => potentialProviders.id).notNull(),
      communicationType: varchar("communication_type").notNull(),
      // email, sms, call
      direction: varchar("direction").notNull(),
      // inbound, outbound
      subject: varchar("subject"),
      content: text("content").notNull(),
      status: varchar("status").default("sent"),
      // sent, delivered, failed, read
      sentBy: varchar("sent_by").notNull(),
      // Admin username
      sentAt: timestamp("sent_at").defaultNow(),
      deliveredAt: timestamp("delivered_at"),
      readAt: timestamp("read_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertPotentialProviderSchema = createInsertSchema(potentialProviders).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPotentialProviderTaskSchema = createInsertSchema(potentialProviderTasks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPotentialProviderCommunicationSchema = createInsertSchema(potentialProviderCommunications).omit({
      id: true,
      createdAt: true
    });
    smsMessages = pgTable("sms_messages", {
      id: serial("id").primaryKey(),
      recipientType: varchar("recipient_type", { length: 20 }).notNull(),
      // 'customer', 'provider', 'potential_customer', 'potential_provider'
      recipientId: integer("recipient_id"),
      // ID of the recipient (user, provider, potential customer, etc.)
      recipientPhone: varchar("recipient_phone").notNull(),
      recipientName: varchar("recipient_name"),
      message: text("message").notNull(),
      direction: varchar("direction", { length: 20 }).notNull(),
      // 'inbound', 'outbound'
      status: varchar("status", { length: 20 }).default("sent"),
      // sent, delivered, failed, read
      smsType: varchar("sms_type", { length: 20 }),
      // '1st_sent', '2nd_sent', 'custom', 'notification'
      sentBy: varchar("sent_by"),
      // Admin username or system
      sentAt: timestamp("sent_at").defaultNow(),
      deliveredAt: timestamp("delivered_at"),
      readAt: timestamp("read_at"),
      apiResponse: text("api_response"),
      // Store API response for debugging
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertSmsMessageSchema = createInsertSchema(smsMessages).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    providerNotifications = pgTable("provider_notifications", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message").notNull(),
      type: varchar("type", { length: 20 }).notNull().default("info"),
      // info, success, warning, error
      category: varchar("category", { length: 50 }).notNull().default("general"),
      // lead, payment, system, general
      isRead: boolean("is_read").notNull().default(false),
      actionUrl: varchar("action_url", { length: 500 }),
      metadata: jsonb("metadata"),
      // Store any additional data like amounts, locations, etc.
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      readAt: timestamp("read_at")
    }, (table) => [
      // Essential indexes for performance
      index("idx_provider_notifications_provider_id").on(table.providerId),
      index("idx_provider_notifications_is_read").on(table.isRead),
      index("idx_provider_notifications_created_at").on(table.createdAt),
      // Composite index for common queries
      index("idx_provider_notifications_provider_read").on(table.providerId, table.isRead)
    ]);
    insertProviderNotificationSchema = createInsertSchema(providerNotifications).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    teamTasks = pgTable("team_tasks", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      status: varchar("status", { length: 50 }).notNull().default("pending"),
      // pending, in_progress, completed, cancelled
      priority: varchar("priority", { length: 10 }).notNull().default("P3"),
      // P1, P2, P3, P4, P5
      dueDate: timestamp("due_date").notNull(),
      completedAt: timestamp("completed_at"),
      // Foreign key references (only one should be set)
      potentialProviderId: integer("potential_provider_id").references(() => potentialProviders.id),
      providerId: integer("provider_id").references(() => serviceProviders.id),
      customerId: varchar("customer_id").references(() => users.id),
      // Admin who created/assigned the task
      adminId: varchar("admin_id").notNull(),
      // Admin username
      assignedTo: varchar("assigned_to"),
      // Team member username
      comments: text("comments"),
      // Task metadata
      taskType: varchar("task_type", { length: 50 }).notNull().default("general"),
      // follow_up, call, email, meeting, etc.
      tags: jsonb("tags"),
      // Array of tags for categorization
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      // Indexes for performance
      index("idx_team_tasks_status").on(table.status),
      index("idx_team_tasks_priority").on(table.priority),
      index("idx_team_tasks_due_date").on(table.dueDate),
      index("idx_team_tasks_admin_id").on(table.adminId),
      index("idx_team_tasks_assigned_to").on(table.assignedTo),
      index("idx_team_tasks_potential_provider").on(table.potentialProviderId),
      index("idx_team_tasks_provider").on(table.providerId),
      index("idx_team_tasks_customer").on(table.customerId),
      // Composite indexes for common queries
      index("idx_team_tasks_status_due_date").on(table.status, table.dueDate),
      index("idx_team_tasks_priority_due_date").on(table.priority, table.dueDate)
    ]);
    insertTeamTaskSchema = createInsertSchema(teamTasks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    smsCampaigns = pgTable("sms_campaigns", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      message: text("message").notNull(),
      voucherCode: varchar("voucher_code"),
      voucherAmount: decimal("voucher_amount", { precision: 10, scale: 2 }),
      selectedStates: jsonb("selected_states").notNull().$type(),
      selectedRegions: jsonb("selected_regions").$type(),
      selectedStatuses: jsonb("selected_statuses").notNull().$type(),
      scheduledAt: timestamp("scheduled_at"),
      status: varchar("status", { length: 20 }).notNull().default("draft"),
      // draft, scheduled, sent, failed
      totalSent: integer("total_sent").default(0),
      sentAt: timestamp("sent_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("idx_sms_campaigns_status").on(table.status),
      index("idx_sms_campaigns_created_at").on(table.createdAt)
    ]);
    insertSmsCampaignSchema = createInsertSchema(smsCampaigns).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import path from "path";
var envPath, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    envPath = path.resolve(process.cwd(), ".env");
    dotenv.config({ path: envPath });
    if (!process.env.DATABASE_URL) {
      console.warn("\u26A0\uFE0F  DATABASE_URL not set. Using fallback configuration for development.");
      process.env.DATABASE_URL = "postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda";
    }
    try {
      const sslConfig = process.env.DATABASE_URL?.includes("neon.tech") ? { rejectUnauthorized: false } : process.env.DATABASE_URL?.includes("13.201.64.152") ? { rejectUnauthorized: false } : process.env.DATABASE_URL?.includes("localhost") ? false : false;
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: sslConfig
      });
      db = drizzle(pool, { schema: schema_exports });
      console.log("\u2705 Database connection established");
    } catch (error) {
      console.warn("\u26A0\uFE0F  Database connection failed. Running in development mode without database.");
      console.warn("   To fix this, either:");
      console.warn("   1. Install PostgreSQL and start it");
      console.warn("   2. Set up a Neon database and update DATABASE_URL");
      console.warn("   3. Use a local SQLite database for development");
      db = {
        // Mock methods that return empty results
        select: () => ({ from: () => Promise.resolve([]) }),
        insert: () => ({ values: () => Promise.resolve([]) }),
        update: () => ({ set: () => ({ where: () => Promise.resolve([]) }) }),
        delete: () => ({ where: () => Promise.resolve([]) })
      };
      pool = null;
    }
  }
});

// server/smsService.ts
import axios from "axios";
var SmsService, smsService;
var init_smsService = __esm({
  "server/smsService.ts"() {
    "use strict";
    init_db();
    init_schema();
    SmsService = class {
      apiKey;
      apiUrl;
      fromNumber;
      logs = [];
      constructor() {
        const providedApiKey = "3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc";
        const providedApiUrl = "https://dialpad.com/api/v2/sms";
        this.apiKey = process.env.SMS_API_KEY || providedApiKey;
        this.apiUrl = process.env.SMS_API_URL || providedApiUrl;
        this.fromNumber = "+61452229882";
        if (!this.apiKey || !this.apiUrl) {
          console.warn("SMS API credentials not configured. SMS functionality will be disabled.");
        }
      }
      /**
       * Format phone number to E164 format for Dialpad API
       */
      formatPhoneNumber(phone) {
        if (!phone) {
          throw new Error("Phone number is required");
        }
        let cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("0")) {
          cleaned = "+61" + cleaned.substring(1);
        } else if (!cleaned.startsWith("+")) {
          cleaned = "+61" + cleaned;
        }
        return cleaned;
      }
      /**
       * Send SMS using Dialpad API (equivalent to sendDailPadSMS in Laravel)
       */
      async sendDialpadSms(data) {
        if (!this.apiKey || !this.apiUrl) {
          console.error("SMS API not configured");
          return false;
        }
        const formattedPhone = this.formatPhoneNumber(data.sendTo);
        console.log("[SMS] Preparing request to Dialpad. To:", data.sendTo, "->", formattedPhone, "From:", this.fromNumber);
        try {
          const response = await axios.post(
            `${this.apiUrl}?apikey=${encodeURIComponent(this.apiKey)}`,
            {
              infer_country_code: false,
              text: data.chatMessage,
              to_numbers: [formattedPhone],
              from_number: this.fromNumber
            },
            {
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              }
            }
          );
          console.log("[SMS] Dialpad response status:", response.status);
          console.log("[SMS] Dialpad response data:", response.data);
          const responseData = response.data;
          if (responseData.id && responseData.id.trim() !== "") {
            console.log("SMS sent successfully:", {
              id: responseData.id,
              to: data.sendTo,
              formattedTo: formattedPhone,
              message: data.chatMessage.substring(0, 50) + "..."
            });
            return true;
          } else {
            console.error("Dialpad SMS API response error:", responseData);
            return false;
          }
        } catch (error) {
          console.error("Dialpad SMS API request failed:", {
            error: error?.message,
            status: error?.response?.status,
            response: error?.response?.data,
            to: data.sendTo,
            formattedTo: formattedPhone,
            message: data.chatMessage.substring(0, 50) + "..."
          });
          return false;
        }
      }
      /**
       * Public method to send SMS (equivalent to send_sms in Laravel)
       */
      async sendSms(mobile, message, options) {
        const smsData = {
          sendTo: mobile,
          chatMessage: message,
          ...options
        };
        return this.sendDialpadSms(smsData);
      }
      /**
       * Send SMS to potential customer with appropriate message template
       */
      async sendSmsToPotentialCustomer(customerPhone, customerName, smsType, options) {
        let message;
        if (smsType === "1st_sent") {
          message = `Hi ${customerName}! \u{1F44B} 

ServicePanda here! We noticed you might be looking for reliable service providers in your area.

We have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?

Reply YES to get started, or visit our website for more info.

Best regards,
ServicePanda Team`;
        } else {
          message = `Hi ${customerName}! 

Just following up on our previous message about ServicePanda's verified service providers.

We're here to connect you with trusted professionals in your area. No obligation, just quality service connections.

Reply YES to learn more, or call us directly.

ServicePanda Team`;
        }
        return this.sendSms(customerPhone, message, {
          ...options,
          smsType
        });
      }
      /**
       * Build template text for potential customer outreach
       */
      buildPotentialCustomerTemplateMessage(customerName, smsType) {
        if (smsType === "1st_sent") {
          return `Hi ${customerName}! \u{1F44B} 

ServicePanda here! We noticed you might be looking for reliable service providers in your area.

We have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?

Reply YES to get started, or visit our website for more info.

Best regards,
ServicePanda Team`;
        }
        return `Hi ${customerName}! 

Just following up on our previous message about ServicePanda's verified service providers.

We're here to connect you with trusted professionals in your area. No obligation, just quality service connections.

Reply YES to learn more, or call us directly.

ServicePanda Team`;
      }
      /**
       * Check if SMS service is properly configured
       */
      isConfigured() {
        return !!(this.apiKey && this.apiUrl);
      }
      /**
       * Get SMS service status
       */
      getStatus() {
        return {
          configured: this.isConfigured(),
          provider: "Dialpad",
          fromNumber: this.fromNumber
        };
      }
      /**
       * In-memory log helpers so messages appear immediately in Admin UI
       */
      async recordOutbound(params) {
        const entry = {
          id: Date.now(),
          recipientType: params.recipientType,
          recipientId: params.recipientId,
          recipientPhone: params.recipientPhone,
          recipientName: params.recipientName,
          message: params.message,
          direction: "outbound",
          status: params.status || "sent",
          smsType: params.smsType,
          sentBy: params.sentBy,
          sentAt: (/* @__PURE__ */ new Date()).toISOString(),
          apiResponse: params.apiResponse
        };
        this.logs.push(entry);
        try {
          await db.insert(smsMessages).values({
            recipientType: params.recipientType,
            recipientId: params.recipientId,
            recipientPhone: params.recipientPhone,
            recipientName: params.recipientName,
            message: params.message,
            direction: "outbound",
            status: params.status || "sent",
            smsType: params.smsType
          });
          console.log(`[SMS Service] Successfully stored outbound message in database for ${params.recipientName}`);
        } catch (error) {
          console.error(`[SMS Service] Failed to store outbound message in database:`, error);
        }
      }
      getLogs() {
        return [...this.logs].sort((a, b) => a.sentAt < b.sentAt ? 1 : -1);
      }
      /**
       * Generate a unique 6-character alphanumeric voucher code
       */
      generateVoucherCode() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      }
      /**
       * Create a unique voucher in the database
       */
      async createVoucher(voucherAmount, adminName) {
        const maxAttempts = 10;
        let attempt = 0;
        while (attempt < maxAttempts) {
          try {
            const code = this.generateVoucherCode();
            const expiryDate = /* @__PURE__ */ new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            const [voucher] = await db.insert(providerVouchers).values({
              code,
              value: voucherAmount.toString(),
              description: `Campaign voucher for $${voucherAmount}`,
              status: "active",
              expiryDate,
              createdBy: adminName
            }).returning();
            console.log(`[SMS Service] Created voucher: ${code} for $${voucherAmount}`);
            return { code: voucher.code, value: voucherAmount };
          } catch (error) {
            if (error.code === "23505") {
              attempt++;
              console.log(`[SMS Service] Voucher code collision, retrying... (attempt ${attempt}/${maxAttempts})`);
            } else {
              console.error("[SMS Service] Error creating voucher:", error);
              throw error;
            }
          }
        }
        throw new Error("Failed to generate unique voucher code after maximum attempts");
      }
      /**
       * Send SMS with unique voucher creation
       */
      async sendSmsWithVoucher(phone, customerName, messageTemplate, voucherAmount, options) {
        try {
          const voucher = await this.createVoucher(voucherAmount, options.adminName);
          const message = messageTemplate.replace(/\{customerName\}/g, customerName).replace(/\{voucherCode\}/g, voucher.code).replace(/\{voucherAmount\}/g, voucherAmount.toString());
          const success = await this.sendSms(phone, message, {
            adminName: options.adminName,
            customerId: options.customerId,
            smsType: options.smsType
          });
          if (success) {
            console.log(`[SMS Service] Successfully sent SMS with voucher ${voucher.code} to ${customerName}`);
            return { success: true, voucherCode: voucher.code, message };
          } else {
            return { success: false, message: "Failed to send SMS" };
          }
        } catch (error) {
          console.error("[SMS Service] Error in sendSmsWithVoucher:", error);
          return { success: false, message: error.message || "Unknown error" };
        }
      }
    };
    smsService = new SmsService();
  }
});

// server/notificationBridge.ts
var notificationBridge_exports = {};
__export(notificationBridge_exports, {
  default: () => notificationBridge_default,
  notificationBridge: () => notificationBridge,
  notificationRoutes: () => notificationRoutes
});
var NotificationBridge, notificationBridge, notificationRoutes, notificationBridge_default;
var init_notificationBridge = __esm({
  "server/notificationBridge.ts"() {
    "use strict";
    NotificationBridge = class {
      pendingNotifications = /* @__PURE__ */ new Map();
      activeConnections = /* @__PURE__ */ new Map();
      // Store notification for a provider
      addNotification(providerId, notification) {
        const notificationData = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          providerId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          delivered: false
        };
        if (!this.pendingNotifications.has(providerId)) {
          this.pendingNotifications.set(providerId, []);
        }
        this.pendingNotifications.get(providerId).push(notificationData);
        console.log(`\u{1F4E8} Notification added for provider ${providerId}: ${notification.title}`);
        this.deliverPendingNotifications(providerId);
      }
      // Get pending notifications for a provider (polling)
      getPendingNotifications(providerId) {
        const notifications = this.pendingNotifications.get(providerId) || [];
        console.log(`\u{1F50D} Provider ${providerId} polling - found ${notifications.length} pending notifications`);
        if (notifications.length > 0) {
          console.log("\u{1F4CB} Pending notifications:", notifications.map((n) => n.title));
        }
        notifications.forEach((notif) => notif.delivered = true);
        this.pendingNotifications.set(providerId, []);
        console.log(`\u{1F4F1} Delivered ${notifications.length} notifications to provider ${providerId}`);
        return notifications;
      }
      // Long polling endpoint - provider app calls this
      async longPoll(providerId, res) {
        console.log(`\u{1F504} Provider ${providerId} connected for long polling`);
        if (!this.activeConnections.has(providerId)) {
          this.activeConnections.set(providerId, []);
        }
        this.activeConnections.get(providerId).push(res);
        const timeout = setTimeout(() => {
          this.removeConnection(providerId, res);
          if (!res.headersSent) {
            res.json({ notifications: [] });
          }
        }, 1e4);
        res.on("close", () => {
          clearTimeout(timeout);
          this.removeConnection(providerId, res);
        });
        this.deliverPendingNotifications(providerId);
      }
      // Deliver notifications to connected providers
      deliverPendingNotifications(providerId) {
        const notifications = this.pendingNotifications.get(providerId) || [];
        const connections = this.activeConnections.get(providerId) || [];
        if (notifications.length > 0 && connections.length > 0) {
          console.log(`\u{1F680} Delivering ${notifications.length} notifications to ${connections.length} connections`);
          connections.forEach((res) => {
            if (!res.headersSent) {
              res.json({ notifications });
            }
          });
          this.pendingNotifications.set(providerId, []);
          this.activeConnections.set(providerId, []);
        }
      }
      removeConnection(providerId, res) {
        const connections = this.activeConnections.get(providerId) || [];
        const index2 = connections.indexOf(res);
        if (index2 > -1) {
          connections.splice(index2, 1);
          this.activeConnections.set(providerId, connections);
        }
      }
      // Get stats for debugging
      getStats() {
        const totalPending = Array.from(this.pendingNotifications.values()).reduce((sum, arr) => sum + arr.length, 0);
        const totalConnections = Array.from(this.activeConnections.values()).reduce((sum, arr) => sum + arr.length, 0);
        return {
          totalPendingNotifications: totalPending,
          totalActiveConnections: totalConnections,
          providersWithPendingNotifications: this.pendingNotifications.size,
          providersConnected: this.activeConnections.size
        };
      }
    };
    notificationBridge = new NotificationBridge();
    notificationRoutes = {
      // Provider app polls this endpoint
      poll: async (req, res) => {
        try {
          const providerId = parseInt(req.headers["x-provider-id"]);
          if (!providerId) {
            return res.status(400).json({ error: "Provider ID required" });
          }
          const notifications = notificationBridge.getPendingNotifications(providerId);
          res.json({ notifications });
        } catch (error) {
          console.error("Error in notification poll:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      },
      // Long polling endpoint
      longPoll: async (req, res) => {
        try {
          const providerId = parseInt(req.headers["x-provider-id"]);
          if (!providerId) {
            return res.status(400).json({ error: "Provider ID required" });
          }
          await notificationBridge.longPoll(providerId, res);
        } catch (error) {
          console.error("Error in notification long poll:", error);
          if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
          }
        }
      },
      // Get notification bridge stats
      stats: (req, res) => {
        const stats = notificationBridge.getStats();
        res.json(stats);
      }
    };
    notificationBridge_default = notificationBridge;
  }
});

// server/fetchPolyfill.ts
var init_fetchPolyfill = __esm({
  "server/fetchPolyfill.ts"() {
    "use strict";
    if (typeof globalThis.fetch === "undefined") {
      console.log("\u26A0\uFE0F Built-in fetch not available, using polyfill");
      try {
        const nodeFetch = __require("node-fetch");
        globalThis.fetch = nodeFetch.default || nodeFetch;
        console.log("\u2705 Fetch polyfill loaded successfully");
      } catch (error) {
        console.log("\u274C Could not load node-fetch polyfill:", error.message);
        globalThis.fetch = async (url, options = {}) => {
          throw new Error("Fetch not available and no polyfill found");
        };
      }
    } else {
      console.log("\u2705 Built-in fetch available");
    }
  }
});

// server/oneSignalAdminService.ts
var oneSignalAdminService_exports = {};
__export(oneSignalAdminService_exports, {
  default: () => oneSignalAdminService_default
});
var OneSignalAdminService, oneSignalAdminService, oneSignalAdminService_default;
var init_oneSignalAdminService = __esm({
  "server/oneSignalAdminService.ts"() {
    "use strict";
    init_fetchPolyfill();
    OneSignalAdminService = class {
      appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
      // Your OneSignal App ID
      restApiKey = process.env.ONESIGNAL_REST_API_KEY || "os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni";
      apiUrl = "https://onesignal.com/api/v1/notifications";
      // DEPRECATED: Old static device mapping - now using dynamic external user IDs
      // This method is kept for backward compatibility but not used
      getDeviceIdForProvider(providerId) {
        console.log(`\u26A0\uFE0F Using dynamic external user ID instead of static device mapping for provider ${providerId}`);
        return null;
      }
      // Get external user IDs for dynamic targeting
      getExternalUserIds(providerId) {
        const externalIds = [`provider-${providerId}`];
        console.log(`\u{1F464} External user IDs for provider ${providerId}:`, externalIds);
        console.log(`\u2705 Using dynamic external ID: provider-${providerId}`);
        return externalIds;
      }
      // Send push notification to provider using OneSignal
      async sendToProvider(providerId, notification) {
        try {
          console.log(`\u{1F4E4} Sending OneSignal push notification to provider ${providerId}`);
          console.log(`\u{1F4E2} Sending broadcast notification to all users`);
          const payload = {
            app_id: this.appId,
            // BROADCAST STRATEGY: Send to subscribed users only (recommended)
            included_segments: ["Subscribed Users"],
            headings: { en: notification.title },
            contents: { en: notification.message },
            data: notification.data || {},
            // Android specific settings
            priority: 10,
            android_sound: "default",
            android_vibration_pattern: [1e3, 1e3],
            // Make sure it works when app is closed
            content_available: true,
            // Additional settings to ensure delivery
            send_after: (/* @__PURE__ */ new Date()).toISOString(),
            ttl: 3600
            // 1 hour TTL
            // Remove apns_push_type_override - let OneSignal handle it automatically
          };
          const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Basic ${this.restApiKey}`
            },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OneSignal API error: ${JSON.stringify(errorData)}`);
          }
          const result2 = await response.json();
          console.log(`\u2705 OneSignal notification sent:`, result2);
          if (result2.recipients) {
            console.log(`\u{1F4CA} Notification delivered to ${result2.recipients} recipients`);
          }
          if (result2.errors && result2.errors.length > 0) {
            console.log(`\u26A0\uFE0F Some errors occurred:`, result2.errors);
          }
          return {
            success: true,
            id: result2.id,
            recipients: result2.recipients || 0,
            errors: result2.errors || []
          };
        } catch (error) {
          console.error("\u274C OneSignal push notification failed:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return { success: false, error: errorMessage };
        }
      }
      // Send to multiple providers
      async sendToMultipleProviders(providerIds, notification) {
        const results = await Promise.all(
          providerIds.map((providerId) => this.sendToProvider(providerId, notification))
        );
        console.log(
          `\u{1F4CA} Sent notifications to ${providerIds.length} providers:`,
          results.filter((r) => r.success).length + " successful"
        );
        return results;
      }
    };
    oneSignalAdminService = new OneSignalAdminService();
    oneSignalAdminService_default = oneSignalAdminService;
  }
});

// server/providerNotificationService.ts
var providerNotificationService_exports = {};
__export(providerNotificationService_exports, {
  default: () => providerNotificationService_default,
  providerNotificationService: () => providerNotificationService
});
var ProviderNotificationService, providerNotificationService, providerNotificationService_default;
var init_providerNotificationService = __esm({
  "server/providerNotificationService.ts"() {
    "use strict";
    ProviderNotificationService = class {
      apiUrl;
      constructor() {
        this.apiUrl = process.env.PROVIDER_APP_NOTIFICATION_URL || "https://fcm.googleapis.com/fcm/send";
      }
      // Send notification to specific provider
      async sendNotificationToProvider(providerId, notification) {
        try {
          console.log(`\u{1F514} Sending REAL notification to provider ${providerId}:`, notification.title);
          console.log(`\u{1F680} FORCING OneSignal API call for provider ${providerId}`);
          const pushResult = await this.sendPushNotificationIfAvailable(providerId, notification);
          const storeResult = await this.storeNotificationInDatabase(providerId, notification);
          const inAppResult = await this.sendInAppNotification(providerId, notification);
          console.log(`\u{1F4CA} Notification results for provider ${providerId}:`);
          console.log(`   - OneSignal Push: ${pushResult ? "\u2705" : "\u274C"}`);
          console.log(`   - Stored for polling: ${storeResult ? "\u2705" : "\u274C"}`);
          console.log(`   - In-app: ${inAppResult ? "\u2705" : "\u274C"}`);
          if (pushResult || storeResult) {
            console.log(`\u2705 Notification sent successfully to provider ${providerId}`);
            return true;
          } else {
            console.error(`\u274C Both push and storage failed for provider ${providerId}`);
            return false;
          }
        } catch (error) {
          console.error(`\u274C Error sending notification to provider ${providerId}:`, error);
          return false;
        }
      }
      // Send notification to multiple providers
      async sendNotificationToProviders(providerIds, notification) {
        console.log(`\u{1F514} Sending notifications to ${providerIds.length} providers:`, notification.title);
        let successCount = 0;
        let failedCount = 0;
        const promises = providerIds.map(async (providerId) => {
          const success = await this.sendNotificationToProvider(providerId, notification);
          if (success) {
            successCount++;
          } else {
            failedCount++;
          }
        });
        await Promise.all(promises);
        console.log(`\u{1F4CA} Notification results: ${successCount} successful, ${failedCount} failed`);
        return { success: successCount, failed: failedCount };
      }
      // Send customer request notification to eligible providers
      async notifyProvidersOfNewRequest(requestId, categoryName, customerLocation, description, eligibleProviders) {
        console.log(`\u{1F6CE}\uFE0F Notifying ${eligibleProviders.length} providers of new customer request #${requestId}`);
        const notification = {
          title: "\u{1F195} NEW CUSTOMER REQUEST! \u{1F6CE}\uFE0F",
          message: `\u{1F4CD} ${categoryName} needed in ${customerLocation}
"${description.substring(0, 100)}${description.length > 100 ? "..." : ""}"`,
          type: "customer_request",
          data: {
            requestId,
            categoryName,
            customerLocation,
            description,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            priority: "high",
            category: "new_request",
            action: "view_request"
          }
        };
        const providerIds = eligibleProviders.map((p) => p.providerId);
        await this.sendNotificationToProviders(providerIds, notification);
        console.log(
          `\u{1F4DD} Logged notification for request ${requestId} to providers:`,
          eligibleProviders.map((p) => `${p.firstName} ${p.lastName} (${p.providerId})`).join(", ")
        );
      }
      // Send payment confirmation notification
      async notifyProviderOfPayment(providerId, amount, customerName, serviceName) {
        const notification = {
          title: "Payment Received! \u{1F4B0}",
          message: `You received $${amount} from ${customerName} for ${serviceName}`,
          type: "payment",
          data: {
            amount,
            customerName,
            serviceName,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
        await this.sendNotificationToProvider(providerId, notification);
      }
      // Send service update notification
      async notifyProviderOfServiceUpdate(providerId, status, details) {
        const notification = {
          title: "Service Update \u{1F504}",
          message: `${status}: ${details}`,
          type: "service_update",
          data: {
            status,
            details,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
        await this.sendNotificationToProvider(providerId, notification);
      }
      // Simulate notification sending (replace with real implementation)
      async simulateNotificationSend(providerId, notification) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const success = Math.random() > 0.05;
          if (success) {
            console.log(`\u{1F4F1} [SIMULATED] Notification sent to provider ${providerId}:`, {
              title: notification.title,
              message: notification.message.substring(0, 50) + "...",
              type: notification.type
            });
            return { success: true };
          } else {
            return { success: false, error: "Simulated network error" };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
      // Get provider device information (to be implemented with real database)
      async getProviderDevices(providerId) {
        return [
          {
            providerId,
            deviceToken: "mock_token_" + providerId,
            platform: "android",
            appVersion: "1.2.0",
            isActive: true
          }
        ];
      }
      // Send push notification via Firebase (to be implemented)
      async sendFirebaseNotification(deviceToken, notification) {
        console.log("\u{1F525} Firebase notification would be sent here to:", deviceToken);
        return true;
      }
      // Send in-app notification via notification bridge
      async sendInAppNotification(providerId, notification) {
        try {
          const { notificationBridge: notificationBridge2 } = await Promise.resolve().then(() => (init_notificationBridge(), notificationBridge_exports));
          notificationBridge2.addNotification(providerId, notification);
          console.log(`\u{1F517} Real-time notification sent to provider ${providerId} via bridge`);
          return true;
        } catch (error) {
          console.error("\u274C Failed to send in-app notification:", error);
          return false;
        }
      }
      // Store notification in database for polling
      async storeNotificationInDatabase(providerId, notification) {
        try {
          console.log(`\u{1F4BE} Storing notification for polling by provider ${providerId}:`, notification.title);
          const { notificationBridge: notificationBridge2 } = await Promise.resolve().then(() => (init_notificationBridge(), notificationBridge_exports));
          notificationBridge2.addNotification(providerId, {
            title: notification.title,
            message: notification.message,
            type: notification.type,
            data: notification.data
          });
          console.log(`\u2705 Notification added to bridge for provider ${providerId}`);
          return true;
        } catch (error) {
          console.error("\u274C Failed to store notification in bridge:", error);
          return false;
        }
      }
      // Send push notification via external service (simulated)
      async sendPushNotificationIfAvailable(providerId, notification) {
        try {
          console.log(`\u{1F680} Sending external push notification to provider ${providerId}`);
          const pushResult = await this.sendExternalPushNotification(providerId, notification);
          if (pushResult.success) {
            console.log(`\u2705 External push notification sent to provider ${providerId}`);
            return true;
          } else {
            console.log(`\u26A0\uFE0F External push failed for provider ${providerId}: ${pushResult.error}`);
            return false;
          }
        } catch (error) {
          console.error("\u274C Failed to send external push notification:", error);
          return false;
        }
      }
      // Send push notification via OneSignal (works when app is closed!)
      async sendExternalPushNotification(providerId, notification) {
        try {
          console.log(`\u{1F680} SENDING REAL ONESIGNAL PUSH NOTIFICATION to provider ${providerId}`);
          console.log(`\u{1F4CB} Title: ${notification.title}`);
          console.log(`\u{1F4CB} Message: ${notification.message}`);
          const oneSignalAdminServiceModule = await Promise.resolve().then(() => (init_oneSignalAdminService(), oneSignalAdminService_exports));
          const oneSignalAdminService2 = oneSignalAdminServiceModule.default;
          if (!oneSignalAdminService2) {
            throw new Error("OneSignal admin service not available");
          }
          console.log(`\u{1F525} Calling OneSignal API directly...`);
          console.log(`\u{1F527} OneSignal service loaded:`, typeof oneSignalAdminService2);
          const pushResult = await oneSignalAdminService2.sendToProvider(providerId, {
            title: notification.title,
            message: notification.message,
            data: notification.data
          });
          console.log(`\u{1F4E1} OneSignal API Response:`, pushResult);
          if (pushResult.success) {
            console.log(`\u2705 ONESIGNAL PUSH SENT! ID: ${pushResult.id}`);
            return { success: true };
          } else {
            console.log(`\u274C ONESIGNAL PUSH FAILED: ${pushResult.error}`);
            return { success: false, error: pushResult.error };
          }
        } catch (error) {
          console.error("\u274C CRITICAL ERROR in OneSignal push:", error);
          return { success: false, error: error.message };
        }
      }
    };
    providerNotificationService = new ProviderNotificationService();
    providerNotificationService_default = providerNotificationService;
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import dotenv2 from "dotenv";
import path2 from "path";
import fs from "fs";
import csv from "csv-parser";
import { eq, and, or, desc, asc, inArray, isNotNull, isNull, sql, ne, gt, gte, like, lte } from "drizzle-orm";
import crypto from "crypto";
async function insertAndReturn(table, data, idField = "id") {
  try {
    await db.insert(table).values(data);
    let result2;
    if (data.email && table === serviceProviders) {
      [result2] = await db.select().from(table).where(eq(table.email, data.email)).limit(1);
    } else {
      [result2] = await db.select().from(table).orderBy(desc(table[idField])).limit(1);
    }
    return result2;
  } catch (error) {
    console.error("Error in insertAndReturn:", error);
    console.error("Table:", table);
    console.error("Data:", data);
    throw error;
  }
}
var envPath2, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_smsService();
    init_providerNotificationService();
    init_schema();
    init_db();
    envPath2 = path2.resolve(process.cwd(), ".env");
    dotenv2.config({ path: envPath2 });
    DatabaseStorage = class {
      smsTableChecked = false;
      ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "servicepanda-encryption-key-default-32chars";
      ALGORITHM = "aes-256-gcm";
      encrypt(text2) {
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(this.ENCRYPTION_KEY, "salt", 32);
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        let encrypted = cipher.update(text2, "utf8", "hex");
        encrypted += cipher.final("hex");
        return iv.toString("hex") + ":" + encrypted;
      }
      decrypt(encryptedText) {
        const parts = encryptedText.split(":");
        if (parts.length !== 2) throw new Error("Invalid encrypted format");
        const iv = Buffer.from(parts[0], "hex");
        const encrypted = parts[1];
        const key = crypto.scryptSync(this.ENCRYPTION_KEY, "salt", 32);
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
      }
      // Ensure sms_messages table exists (idempotent)
      async ensureSmsMessagesTable() {
        if (this.smsTableChecked) return;
        try {
          await db.execute(sql`CREATE TABLE IF NOT EXISTS sms_messages (
        id SERIAL PRIMARY KEY,
        recipient_type VARCHAR(20) NOT NULL,
        recipient_id INTEGER,
        recipient_phone VARCHAR NOT NULL,
        recipient_name VARCHAR,
        message TEXT NOT NULL,
        direction VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'sent',
        sms_type VARCHAR(20),
        sent_by VARCHAR,
        sent_at TIMESTAMP DEFAULT NOW(),
        delivered_at TIMESTAMP,
        read_at TIMESTAMP,
        api_response TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`);
          this.smsTableChecked = true;
        } catch (e) {
          console.warn("ensureSmsMessagesTable failed (continuing):", e);
        }
      }
      // User operations
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
      }
      async upsertUser(userData) {
        const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return user;
      }
      async updateUser(id, updates) {
        await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getAllUsers() {
        return await db.select().from(users).orderBy(desc(users.createdAt));
      }
      async updateUserLastLogin(id) {
        await db.update(users).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
      }
      async getUsersWithStats() {
        const allUsers = await this.getAllUsers();
        return allUsers.map((user) => ({
          ...user,
          lastLogin: user.lastLogin ? user.lastLogin.toISOString() : void 0,
          isActive: true
          // For now, assume all users are active
        }));
      }
      async getLeadsWithMetrics() {
        try {
          const requestsData = await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
          const requestsWithDetails = await Promise.all(
            requestsData.map(async (request) => {
              const customer = await db.select({
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                phoneNumber: users.phoneNumber
              }).from(users).where(eq(users.id, request.customerId)).limit(1);
              const category = await db.select({
                name: serviceCategories.name
              }).from(serviceCategories).where(eq(serviceCategories.id, request.categoryId)).limit(1);
              return {
                ...request,
                customerFirstName: customer[0]?.firstName || "",
                customerLastName: customer[0]?.lastName || "",
                customerEmail: customer[0]?.email || "",
                customerPhoneNumber: customer[0]?.phoneNumber || "",
                categoryName: category[0]?.name || ""
              };
            })
          );
          const requestsWithOffers = await Promise.all(
            requestsWithDetails.map(async (request) => {
              const offers = await db.select({
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
                providerLastName: serviceProviders.lastName
              }).from(leadOffers).leftJoin(serviceProviders, eq(leadOffers.providerId, serviceProviders.id)).where(eq(leadOffers.requestId, request.id)).orderBy(desc(leadOffers.createdAt));
              const formattedOffers = offers.map((offer) => ({
                ...offer,
                providerName: `${offer.providerFirstName || ""} ${offer.providerLastName || ""}`.trim()
              }));
              const totalOffered = offers.length;
              const totalAccepted = offers.filter((offer) => offer.status === "purchased").length;
              const totalPending = offers.filter((offer) => offer.status === "pending").length;
              const totalExpired = offers.filter((offer) => offer.status === "expired").length;
              const offerMetrics = {
                totalOffered,
                totalAccepted,
                totalPending,
                totalExpired
              };
              const notes = await this.getLeadNotes(request.id);
              let leadStatus = request.status;
              const purchasedOffers = offers.filter((offer) => offer.status === "purchased");
              const sharedOffersPurchased = purchasedOffers.filter((offer) => offer.offerType === "shared").length;
              const paidUniqueOfferPurchased = await (async () => {
                const uniquePurchased = purchasedOffers.find((offer) => offer.offerType === "unique");
                if (!uniquePurchased) return false;
                const [leadPurchase] = await db.select({ isFreeLeadUsed: leadPurchases.isFreeLeadUsed }).from(leadPurchases).where(
                  and(
                    eq(leadPurchases.requestId, request.id),
                    eq(leadPurchases.providerId, uniquePurchased.providerId)
                  )
                );
                return leadPurchase && !leadPurchase.isFreeLeadUsed;
              })();
              const now = /* @__PURE__ */ new Date();
              const jobDate = request.preferredDate ? new Date(request.preferredDate) : null;
              if (jobDate && now > jobDate) {
                leadStatus = "expired";
              } else if (await paidUniqueOfferPurchased || sharedOffersPurchased >= 3) {
                leadStatus = "assigned";
              } else if (sharedOffersPurchased > 0 && sharedOffersPurchased < 3) {
                leadStatus = "in-progress";
              } else {
                leadStatus = "active";
              }
              return {
                ...request,
                status: leadStatus,
                // Use calculated status
                customerName: `${request.customerFirstName || ""} ${request.customerLastName || ""}`.trim(),
                customerPhone: request.customerPhoneNumber || "",
                // Add computed location and state from postcode/suburb
                location: `${request.suburb || ""}, ${request.postcode || ""}`,
                state: "NSW",
                // Default state for now
                leadOffers: formattedOffers,
                offerMetrics,
                notes,
                // Keep legacy field for backward compatibility
                leadAssignments: formattedOffers.map((offer) => ({
                  id: offer.id,
                  providerId: offer.providerId,
                  providerName: offer.providerName,
                  status: offer.status === "purchased" ? "accepted" : offer.status,
                  assignedAt: offer.createdAt
                }))
              };
            })
          );
          return requestsWithOffers;
        } catch (error) {
          console.error("Error fetching leads with metrics:", error);
          throw error;
        }
      }
      // Service provider operations
      async createServiceProvider(provider) {
        return await insertAndReturn(serviceProviders, provider);
      }
      async getServiceProvider(id) {
        const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
        return provider;
      }
      async getServiceProviderById(id) {
        const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
        return provider;
      }
      async getServiceProviderByEmail(email) {
        const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.email, email));
        return provider;
      }
      async updateServiceProvider(id, updates) {
        await db.update(serviceProviders).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(serviceProviders.id, id));
        const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
        return provider;
      }
      async updateProviderStatus(id, providerStatus) {
        await db.update(serviceProviders).set({ providerStatus, updatedAt: /* @__PURE__ */ new Date() }).where(eq(serviceProviders.id, id));
      }
      async getServiceProvidersByStatus(status) {
        return await db.select().from(serviceProviders).where(eq(serviceProviders.status, status)).orderBy(desc(serviceProviders.createdAt));
      }
      // Service category operations
      async getServiceCategories() {
        return await db.select().from(serviceCategories).where(eq(serviceCategories.active, true)).orderBy(asc(serviceCategories.name));
      }
      async getAllServiceCategories() {
        console.log("Storage: Getting all service categories...");
        const categories = await db.select().from(serviceCategories).orderBy(asc(serviceCategories.name));
        console.log("Storage: Found", categories.length, "categories");
        return categories;
      }
      async getTrendingServiceCategories() {
        console.log("Storage: Getting trending service categories...");
        const result2 = await db.select().from(serviceCategories).where(eq(serviceCategories.trending, true)).orderBy(asc(serviceCategories.name));
        return result2;
      }
      async getServiceCategory(id) {
        const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id)).limit(1);
        return category;
      }
      async createServiceCategory(category) {
        const [serviceCategory] = await db.insert(serviceCategories).values(category).returning();
        return serviceCategory;
      }
      // Provider service operations
      async addProviderService(providerService) {
        await db.insert(providerServices).values(providerService);
      }
      async replaceProviderServices(providerId, categoryIds) {
        await db.delete(providerServices).where(eq(providerServices.providerId, providerId));
        if (categoryIds.length > 0) {
          const newServices = categoryIds.map((categoryId) => ({
            providerId,
            categoryId
          }));
          await db.insert(providerServices).values(newServices);
        }
      }
      async getProviderServices(providerId) {
        const services = await db.select({
          id: providerServices.id,
          categoryId: providerServices.categoryId,
          name: serviceCategories.name,
          icon: serviceCategories.icon
        }).from(providerServices).innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id)).where(eq(providerServices.providerId, providerId));
        return services;
      }
      // Location operations
      async getAustralianStates() {
        return await db.select().from(australianStates).orderBy(asc(australianStates.name));
      }
      async getSuburbsByPostcode(postcode) {
        return await db.select().from(australianSuburbs).where(eq(australianSuburbs.postcode, postcode)).orderBy(asc(australianSuburbs.suburb));
      }
      // New location-based service area methods
      async addProviderLocationServiceArea(serviceAreaData) {
        return await insertAndReturn(providerServiceAreas, serviceAreaData);
      }
      async getProviderLocationServiceAreas(providerId) {
        return await db.select().from(providerServiceAreas).where(
          and(
            eq(providerServiceAreas.providerId, providerId),
            isNotNull(providerServiceAreas.centerAddress)
            // Only get location-based service areas
          )
        );
      }
      async deleteProviderLocationServiceArea(providerId, areaId) {
        await db.delete(providerServiceAreas).where(and(
          eq(providerServiceAreas.providerId, providerId),
          eq(providerServiceAreas.id, areaId)
        ));
      }
      async getServiceAreaById(areaId) {
        const [serviceArea] = await db.select().from(providerServiceAreas).where(eq(providerServiceAreas.id, areaId));
        return serviceArea;
      }
      async getProviderServiceAreas(providerId) {
        return await db.select({
          id: australianSuburbs.id,
          postcode: australianSuburbs.postcode,
          suburb: australianSuburbs.suburb,
          stateId: australianSuburbs.stateId,
          regionId: australianSuburbs.regionId
        }).from(providerServiceAreas).innerJoin(australianSuburbs, eq(providerServiceAreas.suburbId, australianSuburbs.id)).where(eq(providerServiceAreas.providerId, providerId));
      }
      async getRegionsByStateId(stateId) {
        return await db.select().from(australianRegions).where(eq(australianRegions.stateId, stateId)).orderBy(asc(australianRegions.name));
      }
      async getAllRegions() {
        return await db.select().from(australianRegions).orderBy(asc(australianRegions.name));
      }
      async getSuburbsByRegion(regionId) {
        return await db.select().from(australianSuburbs).where(eq(australianSuburbs.regionId, regionId)).orderBy(asc(australianSuburbs.suburb));
      }
      // Document operations
      async uploadProviderDocument(document) {
        return await insertAndReturn(providerDocuments, document);
      }
      async getProviderDocuments(providerId) {
        return await db.select().from(providerDocuments).where(eq(providerDocuments.providerId, providerId)).orderBy(desc(providerDocuments.uploadedAt));
      }
      async getProviderDocument(id) {
        const [document] = await db.select().from(providerDocuments).where(eq(providerDocuments.id, id));
        return document;
      }
      async updateDocumentStatus(id, status) {
        await db.update(providerDocuments).set({ status }).where(eq(providerDocuments.id, id));
      }
      // Service request operations
      async createServiceRequest(request) {
        const [serviceRequest] = await db.insert(serviceRequests).values(request).returning();
        try {
          console.log(`Starting automatic lead distribution for request ${serviceRequest.id}`);
          await this.initializeLeadDistribution(serviceRequest.id);
          console.log(`Lead distribution initialized successfully for request ${serviceRequest.id}`);
        } catch (error) {
          console.error(`Error initializing lead distribution for request ${serviceRequest.id}:`, error);
        }
        return serviceRequest;
      }
      async getServiceRequests(customerId) {
        const query = db.select().from(serviceRequests);
        if (customerId) {
          return await query.where(eq(serviceRequests.customerId, customerId)).orderBy(desc(serviceRequests.createdAt));
        }
        return await query.orderBy(desc(serviceRequests.createdAt));
      }
      async getCustomerServiceRequestsWithOffers(customerId) {
        try {
          const result2 = await pool.query(
            `SELECT sr.id, sr.customer_id, sr.category_id, sr.description, sr.postcode, sr.suburb, 
                sr.property_type, sr.urgency, sr.budget, sr.preferred_date, sr.booking_type, 
                sr.scheduled_date, sr.status, sr.created_at, sr.updated_at,
                sc.name as category_name, sc.icon as category_icon
         FROM service_requests sr
         LEFT JOIN service_categories sc ON sr.category_id = sc.id
         WHERE sr.customer_id = $1
         ORDER BY sr.created_at DESC`,
            [customerId]
          );
          const categoryCheck = await pool.query("SELECT id, name, icon FROM service_categories ORDER BY id");
          const requestsWithOffers = await Promise.all(result2.rows.map(async (request) => {
            const offerMetricsResult = await pool.query(
              `SELECT 
            COUNT(DISTINCT provider_id) as professional_count,
            COUNT(*) as total_offers,
            COUNT(CASE WHEN status = 'purchased' THEN 1 END) as accepted_offers
           FROM lead_offers 
           WHERE request_id = $1`,
              [request.id]
            );
            const offerMetrics = offerMetricsResult.rows[0] || {
              professional_count: 0,
              total_offers: 0,
              accepted_offers: 0
            };
            let finalCategoryName = request.category_name;
            let finalCategoryIcon = request.category_icon;
            if (!finalCategoryName && request.category_id) {
              try {
                const categoryResult = await pool.query(
                  "SELECT name, icon FROM service_categories WHERE id = $1",
                  [request.category_id]
                );
                if (categoryResult.rows.length > 0) {
                  finalCategoryName = categoryResult.rows[0].name;
                  finalCategoryIcon = categoryResult.rows[0].icon;
                }
              } catch (error) {
                console.error("Error fetching category:", error);
              }
            }
            const finalResult = {
              id: request.id,
              customerId: request.customer_id,
              categoryId: request.category_id,
              categoryName: finalCategoryName || "Service Request",
              categoryIcon: finalCategoryIcon || "\u{1F527}",
              description: request.description,
              postcode: request.postcode,
              suburb: request.suburb,
              propertyType: request.property_type,
              urgency: request.urgency,
              budget: request.budget,
              preferredDate: request.preferred_date,
              bookingType: request.booking_type,
              scheduledDate: request.scheduled_date,
              status: request.status,
              createdAt: request.created_at,
              updatedAt: request.updated_at,
              offerMetrics: {
                totalOffers: parseInt(offerMetrics.total_offers) || 0,
                acceptedOffers: parseInt(offerMetrics.accepted_offers) || 0,
                professionalCount: parseInt(offerMetrics.professional_count) || 0
              }
            };
            return finalResult;
          }));
          return requestsWithOffers;
        } catch (error) {
          console.error("Error getting customer service requests with offers:", error);
          throw error;
        }
      }
      async getServiceRequestDetails(requestId) {
        try {
          const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, requestId));
          if (!request) {
            return null;
          }
          const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, request.categoryId));
          return {
            ...request,
            category
          };
        } catch (error) {
          console.error("Error getting service request details:", error);
          throw error;
        }
      }
      async getServiceRequestProfessionals(requestId) {
        try {
          const professionals = await db.select({
            providerId: leadOffers.providerId,
            providerName: serviceProviders.businessName,
            providerEmail: serviceProviders.email,
            providerPhone: serviceProviders.phoneNumber,
            offerType: leadOffers.offerType,
            offerStatus: leadOffers.status,
            offerCreatedAt: leadOffers.createdAt,
            isPurchased: sql`CASE WHEN ${leadOffers.status} = 'purchased' THEN true ELSE false END`.as("isPurchased"),
            rating: sql`COALESCE(AVG(${providerRatings.rating}), 0)`.as("rating")
          }).from(leadOffers).leftJoin(serviceProviders, eq(leadOffers.providerId, serviceProviders.id)).leftJoin(providerRatings, eq(serviceProviders.id, providerRatings.providerId)).where(eq(leadOffers.requestId, requestId)).groupBy(
            leadOffers.providerId,
            serviceProviders.businessName,
            serviceProviders.email,
            serviceProviders.phoneNumber,
            leadOffers.offerType,
            leadOffers.status,
            leadOffers.createdAt
          ).orderBy(desc(leadOffers.createdAt));
          return professionals.map((prof) => ({
            ...prof,
            rating: Number(prof.rating) || 0
          }));
        } catch (error) {
          console.error("Error getting service request professionals:", error);
          throw error;
        }
      }
      async getServiceRequestAcceptedProfessionals(requestId) {
        try {
          const result2 = await pool.query(
            `SELECT DISTINCT
          lo.provider_id as providerId,
          sp.business_name as businessName,
          sp.first_name as firstName,
          sp.last_name as lastName,
          sp.email as providerEmail,
          sp.mobile_number as providerPhone,
          lo.offer_type as offerType,
          lo.status as offerStatus,
          lo.created_at as offerCreatedAt,
          true as isPurchased,
          COALESCE(AVG(pr.rating), 0) as rating
         FROM lead_offers lo
         LEFT JOIN service_providers sp ON lo.provider_id = sp.id
         LEFT JOIN provider_ratings pr ON sp.id = pr.provider_id
         WHERE lo.request_id = $1 AND lo.status = 'purchased'
         GROUP BY lo.provider_id, sp.business_name, sp.first_name, sp.last_name, sp.email, sp.mobile_number, 
                  lo.offer_type, lo.status, lo.created_at
         ORDER BY lo.created_at DESC`,
            [requestId]
          );
          return result2.rows.map((prof) => ({
            providerId: prof.providerid,
            businessName: prof.businessname,
            firstName: prof.firstname,
            lastName: prof.lastname,
            providerEmail: prof.provideremail,
            providerPhone: prof.providerphone,
            offerType: prof.offertype,
            offerStatus: prof.offerstatus,
            offerCreatedAt: prof.offercreatedat,
            isPurchased: prof.ispurchased,
            rating: Number(prof.rating) || 0
          }));
        } catch (error) {
          console.error("Error getting accepted professionals:", error);
          throw error;
        }
      }
      async getServiceRequestsByArea(postcode, categoryId) {
        return await db.select().from(serviceRequests).where(
          and(
            eq(serviceRequests.postcode, postcode),
            eq(serviceRequests.categoryId, categoryId),
            eq(serviceRequests.status, "active")
          )
        ).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequest(id) {
        const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
        return request;
      }
      async updateServiceRequestStatus(id, status) {
        await db.update(serviceRequests).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(serviceRequests.id, id));
      }
      // Lead assignment operations
      async createLeadAssignment(assignment) {
        const [leadAssignment] = await db.insert(leadAssignments).values(assignment).returning();
        return leadAssignment;
      }
      async findProvidersInArea(postcode, categoryId) {
        return await db.select().from(serviceProviders).innerJoin(providerServices, eq(serviceProviders.id, providerServices.providerId)).innerJoin(providerServiceAreas, eq(serviceProviders.id, providerServiceAreas.providerId)).innerJoin(australianSuburbs, eq(providerServiceAreas.suburbId, australianSuburbs.id)).where(
          and(
            eq(providerServices.categoryId, categoryId),
            eq(australianSuburbs.postcode, postcode),
            eq(serviceProviders.status, "approved")
          )
        ).groupBy(serviceProviders.id);
      }
      async createLeadsForRequest(requestId, postcode, categoryId) {
        const providers = await this.findProvidersInArea(postcode, categoryId);
        const leads = [];
        for (const provider of providers) {
          const lead = await this.createLeadAssignment({
            requestId,
            providerId: provider.id,
            status: "pending"
          });
          leads.push(lead);
        }
        return leads;
      }
      async getProviderLeads(providerId, status) {
        const query = db.select().from(leadAssignments);
        if (status) {
          return await query.where(
            and(
              eq(leadAssignments.providerId, providerId),
              eq(leadAssignments.status, status)
            )
          ).orderBy(desc(leadAssignments.createdAt));
        }
        return await query.where(eq(leadAssignments.providerId, providerId)).orderBy(desc(leadAssignments.createdAt));
      }
      async updateLeadStatus(id, status) {
        const updates = { status };
        if (status === "accepted") {
          updates.acceptedAt = /* @__PURE__ */ new Date();
        } else if (status === "declined") {
          updates.declinedAt = /* @__PURE__ */ new Date();
        }
        await db.update(leadAssignments).set(updates).where(eq(leadAssignments.id, id));
      }
      // Email operations
      async createEmailTemplate(template) {
        const [emailTemplate] = await db.insert(emailTemplates).values(template).returning();
        return emailTemplate;
      }
      async getEmailTemplates() {
        return await db.select().from(emailTemplates).where(eq(emailTemplates.isActive, true)).orderBy(asc(emailTemplates.name));
      }
      async logSentEmail(email) {
        const [sentEmail] = await db.insert(sentEmails).values(email).returning();
        return sentEmail;
      }
      // Activity logging
      async logUserActivity(log2) {
        const [activityLog] = await db.insert(userActivityLogs).values(log2).returning();
        return activityLog;
      }
      // System settings
      async getSystemSetting(key) {
        const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
        return setting;
      }
      async updateSystemSetting(setting) {
        const [systemSetting] = await db.insert(systemSettings).values(setting).onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value: setting.value,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return systemSetting;
      }
      // Admin-specific methods
      async getServiceProviderCount(status) {
        try {
          if (status) {
            const result3 = await db.select({ count: sql`count(*)` }).from(serviceProviders).where(eq(serviceProviders.status, status));
            return result3[0]?.count || 0;
          }
          const result2 = await db.select({ count: sql`count(*)` }).from(serviceProviders);
          return result2[0]?.count || 0;
        } catch (error) {
          console.error("Error getting service provider count:", error);
          return 0;
        }
      }
      async getUserCount() {
        const result2 = await db.select().from(users);
        return result2.length;
      }
      async getServiceRequestCount(status) {
        const query = db.select().from(serviceRequests);
        if (status) {
          const result3 = await query.where(eq(serviceRequests.status, status));
          return result3.length;
        }
        const result2 = await query;
        return result2.length;
      }
      async getActiveServiceRequestCount() {
        const result2 = await db.select().from(serviceRequests).where(eq(serviceRequests.status, "active"));
        return result2.length;
      }
      async getMonthlyRevenue() {
        const currentDate = /* @__PURE__ */ new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
        const result2 = await db.select({
          totalRevenue: sql`COALESCE(SUM(CAST(${leadPurchases.totalCost} AS DECIMAL)), 0)`
        }).from(leadPurchases).where(
          and(
            gte(leadPurchases.purchasedAt, firstDayOfMonth),
            lte(leadPurchases.purchasedAt, lastDayOfMonth)
          )
        );
        return parseFloat(result2[0]?.totalRevenue?.toString() || "0");
      }
      async getServiceProvidersForAdmin(status) {
        let providers;
        if (status) {
          providers = await db.select().from(serviceProviders).where(eq(serviceProviders.status, status)).orderBy(desc(serviceProviders.createdAt));
        } else {
          providers = await db.select().from(serviceProviders).orderBy(desc(serviceProviders.createdAt));
        }
        const providersWithServices = await Promise.all(
          providers.map(async (provider) => {
            const services = await db.select({
              id: providerServices.id,
              categoryId: providerServices.categoryId,
              categoryName: serviceCategories.name,
              categoryIcon: serviceCategories.icon
            }).from(providerServices).innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id)).where(eq(providerServices.providerId, provider.id));
            return {
              ...provider,
              services
            };
          })
        );
        return providersWithServices;
      }
      async getServiceProvidersForReport(status, rating) {
        try {
          const providersWithServices = await this.getServiceProvidersForAdmin(status);
          const providersWithAreas = await Promise.all(
            providersWithServices.map(async (provider) => {
              try {
                const serviceAreas = await db.select({
                  id: providerServiceAreas.id,
                  centerAddress: providerServiceAreas.centerAddress,
                  radiusKm: providerServiceAreas.radiusKm,
                  areaName: providerServiceAreas.areaName
                }).from(providerServiceAreas).where(eq(providerServiceAreas.providerId, provider.id));
                return {
                  ...provider,
                  serviceAreas: serviceAreas || []
                };
              } catch (areaError) {
                console.log("No service areas for provider", provider.id);
                return {
                  ...provider,
                  serviceAreas: []
                };
              }
            })
          );
          return providersWithAreas;
        } catch (error) {
          console.error("Error in getServiceProvidersForReport:", error);
          return [];
        }
      }
      async updateServiceProviderStatus(id, status) {
        await db.update(serviceProviders).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(serviceProviders.id, id));
      }
      // Get detailed provider information for admin review
      async getProviderDetailsForAdmin(providerId) {
        const provider = await this.getServiceProvider(providerId);
        if (!provider) {
          throw new Error("Provider not found");
        }
        const services = await db.select({
          id: providerServices.id,
          categoryId: providerServices.categoryId,
          name: serviceCategories.name,
          categoryName: serviceCategories.name
        }).from(providerServices).innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id)).where(eq(providerServices.providerId, providerId));
        const serviceAreas = await db.select().from(providerServiceAreas).where(eq(providerServiceAreas.providerId, providerId));
        const documents = await db.select().from(providerDocuments).where(eq(providerDocuments.providerId, providerId)).orderBy(desc(providerDocuments.uploadedAt));
        return {
          ...provider,
          services,
          serviceAreas,
          documents
        };
      }
      // Add service area for provider (admin function)
      async addProviderServiceArea(serviceAreaData) {
        const [result2] = await db.insert(providerServiceAreas).values(serviceAreaData).returning();
        return result2;
      }
      // Remove service area (admin function)
      async removeProviderServiceArea(areaId) {
        await db.delete(providerServiceAreas).where(eq(providerServiceAreas.id, areaId));
      }
      // Update provider admin-specific fields
      async updateProviderAdminFields(providerId, fields) {
        await db.update(serviceProviders).set({
          ...fields,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceProviders.id, providerId));
      }
      async getAllServiceRequestsForAdmin() {
        return await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
      }
      // Payment operations
      async getProviderPaymentMethods(providerId) {
        return await db.select().from(providerPaymentMethods).where(and(
          eq(providerPaymentMethods.providerId, providerId),
          eq(providerPaymentMethods.isActive, true)
        )).orderBy(desc(providerPaymentMethods.isPrimary), desc(providerPaymentMethods.createdAt));
      }
      async addProviderPaymentMethod(paymentMethod) {
        const [newPaymentMethod] = await db.insert(providerPaymentMethods).values(paymentMethod).returning();
        return newPaymentMethod;
      }
      async updateProviderPaymentMethodPrimary(providerId, paymentMethodId) {
        await db.update(providerPaymentMethods).set({ isPrimary: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(providerPaymentMethods.providerId, providerId));
        await db.update(providerPaymentMethods).set({ isPrimary: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(providerPaymentMethods.id, paymentMethodId));
      }
      async deleteProviderPaymentMethod(paymentMethodId) {
        await db.update(providerPaymentMethods).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(providerPaymentMethods.id, paymentMethodId));
      }
      // Admin settings operations
      async getAdminSettings() {
        const stripeSecretKey = await db.select().from(systemSettings).where(eq(systemSettings.key, "stripe_secret_key")).limit(1);
        const stripePublicKey = await db.select().from(systemSettings).where(eq(systemSettings.key, "stripe_public_key")).limit(1);
        const mailgunApiKey = await db.select().from(systemSettings).where(eq(systemSettings.key, "mailgun_api_key")).limit(1);
        const mailgunDomain = await db.select().from(systemSettings).where(eq(systemSettings.key, "mailgun_domain")).limit(1);
        const mailgunDomainSendingKey = await db.select().from(systemSettings).where(eq(systemSettings.key, "mailgun_domain_sending_key")).limit(1);
        return {
          stripeConfigured: stripeSecretKey.length > 0 && stripePublicKey.length > 0,
          mailgunConfigured: mailgunApiKey.length > 0 && mailgunDomain.length > 0 && mailgunDomainSendingKey.length > 0
        };
      }
      async updateAdminSetting(key, value) {
        const encryptedValue = this.encrypt(value);
        const result2 = await db.insert(systemSettings).values({
          key,
          value: encryptedValue,
          description: `Encrypted ${key} setting`,
          updatedAt: /* @__PURE__ */ new Date()
        }).onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value: encryptedValue,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
      }
      async getDecryptedSetting(key) {
        const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key)).limit(1);
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
      async removeProviderPaymentMethod(providerId, paymentMethodId) {
        await db.delete(providerPaymentMethods).where(
          and(
            eq(providerPaymentMethods.providerId, providerId),
            eq(providerPaymentMethods.id, paymentMethodId)
          )
        );
      }
      async updateProviderStripeCustomerId(providerId, stripeCustomerId) {
        await db.update(serviceProviders).set({
          stripeCustomerId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceProviders.id, providerId));
      }
      async getDecryptedStripeKeys() {
        try {
          const secretKey = await this.getDecryptedSetting("stripe_secret_key");
          const publicKey = await this.getDecryptedSetting("stripe_public_key");
          if (!secretKey || !publicKey) {
            return null;
          }
          return { secretKey, publicKey };
        } catch (error) {
          console.error("Failed to get Stripe keys:", error);
          return null;
        }
      }
      async getDecryptedMailgunKeys() {
        try {
          const apiKey = await this.getDecryptedSetting("mailgun_api_key");
          const domain = await this.getDecryptedSetting("mailgun_domain");
          const domainSendingKey = await this.getDecryptedSetting("mailgun_domain_sending_key");
          if (!apiKey || !domain || !domainSendingKey) {
            return null;
          }
          return { apiKey, domain, domainSendingKey };
        } catch (error) {
          console.error("Failed to get Mailgun keys:", error);
          return null;
        }
      }
      // Password reset operations
      async createPasswordResetToken(token) {
        const [resetToken] = await db.insert(passwordResetTokens).values(token).returning();
        return resetToken;
      }
      async getPasswordResetToken(token) {
        const [resetToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
        return resetToken;
      }
      async markTokenAsUsed(token) {
        await db.update(passwordResetTokens).set({ usedAt: /* @__PURE__ */ new Date() }).where(eq(passwordResetTokens.token, token));
      }
      async updateUserPassword(userId, hashedPassword) {
        const [user] = await db.update(users).set({
          password: hashedPassword,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId)).returning();
        return user;
      }
      // Provider password reset operations
      async createProviderPasswordResetToken(token) {
        const [resetToken] = await db.insert(providerPasswordResetTokens).values(token).returning();
        return resetToken;
      }
      async getProviderPasswordResetToken(token) {
        const [resetToken] = await db.select().from(providerPasswordResetTokens).where(eq(providerPasswordResetTokens.token, token));
        return resetToken;
      }
      async markProviderTokenAsUsed(token) {
        await db.update(providerPasswordResetTokens).set({ usedAt: /* @__PURE__ */ new Date() }).where(eq(providerPasswordResetTokens.token, token));
      }
      async updateProviderPassword(providerId, hashedPassword) {
        const [provider] = await db.update(serviceProviders).set({
          password: hashedPassword,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceProviders.id, providerId)).returning();
        return provider;
      }
      // Activity logging methods
      async logProviderActivity(activity) {
        await db.insert(providerActivityLogs).values(activity);
      }
      async getProviderActivityLogs(providerId, actorType) {
        const conditions = [eq(providerActivityLogs.providerId, providerId)];
        if (actorType) {
          conditions.push(eq(providerActivityLogs.actorType, actorType));
        }
        return await db.select().from(providerActivityLogs).where(and(...conditions)).orderBy(desc(providerActivityLogs.timestamp));
      }
      // Lead management settings methods
      async getLeadSettings() {
        try {
          const [settings] = await db.select().from(leadSettings).limit(1);
          if (settings) {
            return {
              ...settings,
              uniformUniquePrice: parseFloat(settings.uniformUniquePrice || "25.00"),
              uniformSharePrice: parseFloat(settings.uniformSharePrice || "12.00"),
              minProviderRating: parseFloat(settings.minProviderRating || "3.0")
            };
          }
          return {
            id: 1,
            pricingModel: "uniform",
            uniformUniquePrice: 25,
            uniformSharePrice: 12,
            uniqueOfferWindow: 2,
            maxProvidersPerArea: 10,
            minProviderRating: 3,
            providerRestrictionsActive: false,
            firstThreeLeadBehavior: "shared",
            freeLeadsEnabled: true,
            oneMinuteCronActive: true,
            providersCanRedeemCredits: true,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error fetching lead settings:", error);
          return {
            id: 1,
            pricingModel: "uniform",
            uniformUniquePrice: 25,
            uniformSharePrice: 12,
            uniqueOfferWindow: 2,
            maxProvidersPerArea: 10,
            minProviderRating: 3,
            providerRestrictionsActive: false,
            firstThreeLeadBehavior: "shared",
            freeLeadsEnabled: true,
            oneMinuteCronActive: true,
            providersCanRedeemCredits: true,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
        }
      }
      async upsertLeadSettings(settings) {
        try {
          const settingsData = {
            pricingModel: settings.pricingModel || "uniform",
            uniformUniquePrice: settings.uniformUniquePrice?.toString() || "25.00",
            uniformSharePrice: settings.uniformSharePrice?.toString() || "12.00",
            uniqueOfferWindow: settings.uniqueOfferWindow || 2,
            maxProvidersPerArea: settings.maxProvidersPerArea || 10,
            minProviderRating: settings.minProviderRating?.toString() || "3.0",
            providerRestrictionsActive: settings.providerRestrictionsActive || false,
            firstThreeLeadBehavior: settings.firstThreeLeadBehavior || "shared",
            freeLeadsEnabled: settings.freeLeadsEnabled !== void 0 ? settings.freeLeadsEnabled : true,
            oneMinuteCronActive: settings.oneMinuteCronActive !== void 0 ? settings.oneMinuteCronActive : true,
            providersCanRedeemCredits: settings.providersCanRedeemCredits !== void 0 ? settings.providersCanRedeemCredits : true,
            updatedAt: /* @__PURE__ */ new Date()
          };
          const [existingSettings] = await db.select().from(leadSettings).limit(1);
          let result2;
          if (existingSettings) {
            [result2] = await db.update(leadSettings).set(settingsData).where(eq(leadSettings.id, existingSettings.id)).returning();
          } else {
            [result2] = await db.insert(leadSettings).values(settingsData).returning();
          }
          if (settings.categoryPricing && Array.isArray(settings.categoryPricing)) {
            await this.upsertCategoryPricing(settings.categoryPricing);
          }
          return {
            ...result2,
            uniformUniquePrice: parseFloat(result2.uniformUniquePrice || "25.00"),
            uniformSharePrice: parseFloat(result2.uniformSharePrice || "12.00"),
            minProviderRating: parseFloat(result2.minProviderRating || "3.0")
          };
        } catch (error) {
          console.error("Error upserting lead settings:", error);
          throw error;
        }
      }
      async getCategoryLeadPricing() {
        try {
          const categoryPricing = await db.select({
            id: categoryLeadPricing.id,
            categoryId: categoryLeadPricing.categoryId,
            categoryName: serviceCategories.name,
            uniquePrice: categoryLeadPricing.uniquePrice,
            sharePrice: categoryLeadPricing.sharePrice,
            hasCustomPrice: sql`true`.as("hasCustomPrice"),
            createdAt: categoryLeadPricing.createdAt,
            updatedAt: categoryLeadPricing.updatedAt
          }).from(categoryLeadPricing).leftJoin(serviceCategories, eq(categoryLeadPricing.categoryId, serviceCategories.id)).orderBy(serviceCategories.name);
          return categoryPricing.map((item) => ({
            ...item,
            uniquePrice: parseFloat(item.uniquePrice || "25.00"),
            sharePrice: parseFloat(item.sharePrice || "12.00")
          }));
        } catch (error) {
          console.error("Error fetching category lead pricing:", error);
          return [];
        }
      }
      async upsertCategoryPricing(categoryPricingData) {
        try {
          for (const category of categoryPricingData) {
            if (category.hasCustomPrice) {
              await db.insert(categoryLeadPricing).values({
                categoryId: category.categoryId,
                uniquePrice: category.uniquePrice?.toString() || "25.00",
                sharePrice: category.sharePrice?.toString() || "12.00",
                updatedAt: /* @__PURE__ */ new Date()
              }).onConflictDoUpdate({
                target: categoryLeadPricing.categoryId,
                set: {
                  uniquePrice: category.uniquePrice?.toString() || "25.00",
                  sharePrice: category.sharePrice?.toString() || "12.00",
                  updatedAt: /* @__PURE__ */ new Date()
                }
              });
            } else {
              await db.delete(categoryLeadPricing).where(eq(categoryLeadPricing.categoryId, category.categoryId));
            }
          }
        } catch (error) {
          console.error("Error upserting category pricing:", error);
          throw error;
        }
      }
      // Lead notes operations
      async addLeadNote(leadId, note, adminName) {
        const [newNote] = await db.insert(leadNotes).values({
          leadId,
          note,
          adminName
        }).returning();
        return newNote;
      }
      async getLeadNotes(leadId) {
        const notes = await db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
        return notes;
      }
      // Lead Sharing System Methods
      async initializeLeadDistribution(requestId) {
        try {
          const request = await this.getServiceRequest(requestId);
          if (!request) throw new Error("Service request not found");
          const eligibleProviders = await this.getEligibleProviders(request.categoryId, request.postcode);
          if (eligibleProviders.length === 0) {
            console.log(`No eligible providers found for request ${requestId}`);
            return;
          }
          const category = await db.select({ name: serviceCategories.name }).from(serviceCategories).where(eq(serviceCategories.id, request.categoryId)).limit(1);
          const categoryName = category.length > 0 ? category[0].name : "Service";
          await db.insert(leadDistributionLog2).values({
            requestId,
            distributionPhase: "unique",
            totalEligibleProviders: eligibleProviders.length,
            isActive: true
          });
          const leadSettings2 = await this.getLeadSettings();
          const leadCost = await this.getLeadCost(request.categoryId, "unique");
          for (let i = 0; i < eligibleProviders.length; i++) {
            const provider = eligibleProviders[i];
            await db.insert(leadOffers).values({
              requestId,
              providerId: provider.providerId,
              offerType: "unique",
              leadCost: leadCost.toString(),
              status: "pending",
              sortOrder: i,
              // Don't set expiresAt here - will be set when offer becomes active
              expiresAt: null
            });
          }
          try {
            const customerLocation = `${request.suburb}, ${request.postcode}`;
            await providerNotificationService.notifyProvidersOfNewRequest(
              requestId,
              categoryName,
              customerLocation,
              request.description,
              eligibleProviders
            );
          } catch (notificationError) {
            console.error("Error sending notifications to providers:", notificationError);
          }
          await this.activateNextUniqueOffer(requestId);
        } catch (error) {
          console.error("Error initializing lead distribution:", error);
          throw error;
        }
      }
      async getEligibleProviders(categoryId, postcode) {
        try {
          let postcodeCoverageProviders = [];
          try {
            postcodeCoverageProviders = await db.selectDistinct({
              providerId: serviceProviders.id,
              rating: providerRatings.rating,
              firstName: serviceProviders.firstName,
              lastName: serviceProviders.lastName,
              totalReviews: providerRatings.totalReviews,
              averageResponseTime: providerRatings.averageResponseTime
            }).from(serviceProviders).innerJoin(providerServices, eq(serviceProviders.id, providerServices.providerId)).innerJoin(providerRatings, eq(serviceProviders.id, providerRatings.providerId)).innerJoin(providerPostcodeCoverage, eq(serviceProviders.id, providerPostcodeCoverage.providerId)).where(
              and(
                eq(providerServices.categoryId, categoryId),
                eq(serviceProviders.status, "approved"),
                eq(serviceProviders.providerStatus, "activated"),
                eq(providerPostcodeCoverage.postcode, postcode)
              )
            ).orderBy(
              desc(providerRatings.rating),
              desc(providerRatings.totalReviews),
              asc(providerRatings.averageResponseTime)
            );
          } catch (error) {
            console.error("Error fetching postcode coverage providers:", error);
          }
          let locationBasedProviders = [];
          try {
            const targetSuburb = await db.select({
              id: australianSuburbs.id,
              suburb: australianSuburbs.suburb,
              postcode: australianSuburbs.postcode,
              latitude: australianSuburbs.latitude,
              longitude: australianSuburbs.longitude
            }).from(australianSuburbs).where(eq(australianSuburbs.postcode, postcode)).limit(1);
            if (targetSuburb.length > 0 && targetSuburb[0].latitude && targetSuburb[0].longitude) {
              const target = targetSuburb[0];
              const eligibleProviders = await db.select({
                providerId: serviceProviders.id,
                firstName: serviceProviders.firstName,
                lastName: serviceProviders.lastName
              }).from(serviceProviders).innerJoin(providerServices, eq(serviceProviders.id, providerServices.providerId)).where(
                and(
                  eq(providerServices.categoryId, categoryId),
                  eq(serviceProviders.status, "approved"),
                  eq(serviceProviders.providerStatus, "activated")
                )
              );
              console.log(`Found ${eligibleProviders.length} eligible providers for category ${categoryId}`);
              for (const provider of eligibleProviders) {
                const serviceAreas = await db.select({
                  centerLat: providerServiceAreas.centerLat,
                  centerLng: providerServiceAreas.centerLng,
                  radiusKm: providerServiceAreas.radiusKm,
                  centerAddress: providerServiceAreas.centerAddress
                }).from(providerServiceAreas).where(
                  and(
                    eq(providerServiceAreas.providerId, provider.providerId),
                    isNotNull(providerServiceAreas.centerLat),
                    isNotNull(providerServiceAreas.centerLng),
                    isNotNull(providerServiceAreas.radiusKm)
                  )
                );
                for (const area of serviceAreas) {
                  if (!area.centerLat || !area.centerLng || !area.radiusKm) continue;
                  const distance = this.calculateDistance(
                    parseFloat(target.latitude),
                    parseFloat(target.longitude),
                    parseFloat(area.centerLat),
                    parseFloat(area.centerLng)
                  );
                  if (distance <= parseInt(area.radiusKm.toString())) {
                    locationBasedProviders.push({
                      providerId: provider.providerId,
                      rating: 5,
                      // Default rating, will fetch from ratings table if needed
                      firstName: provider.firstName,
                      lastName: provider.lastName,
                      distance
                    });
                    break;
                  }
                }
              }
            } else {
            }
          } catch (error) {
            console.error("Error in location-based provider matching:", error);
          }
          const allProviders = [
            ...postcodeCoverageProviders.map((p) => ({
              providerId: p.providerId,
              rating: parseFloat(p.rating?.toString() || "5.0"),
              firstName: p.firstName,
              lastName: p.lastName
            })),
            ...locationBasedProviders
          ];
          const uniqueProviders = allProviders.filter(
            (provider, index2, self) => index2 === self.findIndex((p) => p.providerId === provider.providerId)
          );
          uniqueProviders.sort((a, b) => b.rating - a.rating);
          return uniqueProviders;
        } catch (error) {
          console.error("Error getting eligible providers:", error);
          return [];
        }
      }
      // Haversine formula to calculate distance between two points on Earth
      calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
      toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }
      // Calculate and store postcode coverage when provider adds/updates service area
      async calculateServiceAreaCoverage(serviceAreaId) {
        try {
          const serviceArea = await db.select().from(providerServiceAreas).where(eq(providerServiceAreas.id, serviceAreaId)).limit(1);
          if (!serviceArea.length || !serviceArea[0].centerAddress) {
            return;
          }
          const area = serviceArea[0];
          const allPostcodes = await db.select({
            postcode: australianSuburbs.postcode
          }).from(australianSuburbs).groupBy(australianSuburbs.postcode);
          await db.delete(providerPostcodeCoverage).where(eq(providerPostcodeCoverage.serviceAreaId, serviceAreaId));
          const coveredPostcodes = this.getCoveredPostcodesForServiceArea(area);
          for (const postcode of coveredPostcodes) {
            await db.insert(providerPostcodeCoverage).values({
              providerId: area.providerId,
              serviceAreaId,
              postcode,
              distance: 10.5
              // Placeholder distance
            });
          }
        } catch (error) {
          console.error("Error calculating service area coverage:", error);
        }
      }
      // Simplified coverage calculation - in production, would use Google Maps API
      getCoveredPostcodesForServiceArea(area) {
        if (area.centerAddress?.includes("Hope Island")) {
          return ["4212", "4214", "4215", "4216", "4217", "4218", "4220", "4221"];
        }
        if (area.centerAddress?.includes("Bundall")) {
          return ["4214", "4215", "4216", "4217", "4218", "4220", "4221", "4223"];
        }
        if (area.centerAddress?.includes("Brisbane")) {
          return ["4000", "4006", "4101", "4102", "4214", "4215", "4216", "4217"];
        }
        if (area.centerAddress?.includes("Surfers Paradise")) {
          return ["4214", "4215", "4216", "4217", "4218", "4220", "4221", "4223"];
        }
        return ["4214", "4215", "4216", "4217"];
      }
      async getLeadCost(categoryId, offerType) {
        try {
          const [categoryPricing] = await db.select().from(categoryLeadPricing).where(eq(categoryLeadPricing.categoryId, categoryId)).limit(1);
          if (categoryPricing) {
            return parseFloat(offerType === "unique" ? categoryPricing.uniquePrice : categoryPricing.sharePrice);
          }
          const settings = await this.getLeadSettings();
          return offerType === "unique" ? settings.uniformUniquePrice : settings.uniformSharePrice;
        } catch (error) {
          console.error("Error getting lead cost:", error);
          return offerType === "unique" ? 25 : 12;
        }
      }
      async activateNextUniqueOffer(requestId) {
        try {
          await db.update(leadOffers).set({ isCurrentOffer: false }).where(eq(leadOffers.requestId, requestId));
          const [nextOffer] = await db.select().from(leadOffers).where(
            and(
              eq(leadOffers.requestId, requestId),
              eq(leadOffers.offerType, "unique"),
              eq(leadOffers.status, "pending")
            )
          ).orderBy(asc(leadOffers.sortOrder)).limit(1);
          if (!nextOffer) {
            await this.startSharedPhase(requestId);
            return;
          }
          const leadSettings2 = await this.getLeadSettings();
          const offerStartTime = /* @__PURE__ */ new Date();
          const offerEndTime = new Date(Date.now() + leadSettings2.uniqueOfferWindow * 60 * 1e3);
          await db.update(leadOffers).set({
            isCurrentOffer: true,
            offerStartTime,
            offerEndTime,
            expiresAt: offerEndTime
            // Set proper expiration time when activated
          }).where(eq(leadOffers.id, nextOffer.id));
          await db.update(leadDistributionLog2).set({
            currentOfferProviderId: nextOffer.providerId,
            currentOfferEndTime: offerEndTime
          }).where(
            and(
              eq(leadDistributionLog2.requestId, requestId),
              eq(leadDistributionLog2.isActive, true)
            )
          );
        } catch (error) {
          console.error("Error activating next unique offer:", error);
          throw error;
        }
      }
      async startSharedPhase(requestId) {
        try {
          const eligibleProviders = await db.select({
            providerId: leadOffers.providerId
          }).from(leadOffers).where(
            and(
              eq(leadOffers.requestId, requestId),
              eq(leadOffers.offerType, "unique"),
              ne(leadOffers.status, "purchased")
              // Exclude providers who purchased unique offers
            )
          ).groupBy(leadOffers.providerId);
          const leadCost = await this.getLeadCost(
            (await this.getServiceRequest(requestId))?.categoryId || 1,
            "shared"
          );
          const offerStartTime = /* @__PURE__ */ new Date();
          const providerIds = [];
          for (const provider of eligibleProviders) {
            await db.insert(leadOffers).values({
              requestId,
              providerId: provider.providerId,
              offerType: "shared",
              leadCost: leadCost.toString(),
              status: "pending",
              isCurrentOffer: true,
              offerStartTime,
              // Shared offers don't expire individually - only expire 24 hours before job date
              expiresAt: null
            });
            providerIds.push(provider.providerId);
          }
          if (providerIds.length > 0) {
            try {
              const { providerNotificationService: providerNotificationService2 } = await Promise.resolve().then(() => (init_providerNotificationService(), providerNotificationService_exports));
              await providerNotificationService2.sendNotificationToProviders(providerIds, {
                title: "Price Drop Alert! \u{1F4B8}",
                message: `The lead price has dropped to $${leadCost}! The offer is now available at a reduced shared price.`,
                type: "system",
                data: {
                  requestId,
                  newPrice: leadCost,
                  offerType: "shared",
                  priceDropEvent: true
                }
              });
            } catch (error) {
              console.error("Failed to send price drop notifications:", error);
            }
          } else {
            console.log("\u26A0\uFE0F No eligible providers found for price drop notification");
          }
          await db.update(leadDistributionLog2).set({
            distributionPhase: "shared",
            phaseStartTime: /* @__PURE__ */ new Date(),
            currentOfferProviderId: null,
            currentOfferEndTime: null
          }).where(
            and(
              eq(leadDistributionLog2.requestId, requestId),
              eq(leadDistributionLog2.isActive, true)
            )
          );
        } catch (error) {
          console.error("Error starting shared phase:", error);
          throw error;
        }
      }
      async purchaseLead(requestId, providerId) {
        try {
          const [offer] = await db.select().from(leadOffers).where(
            and(
              eq(leadOffers.requestId, requestId),
              eq(leadOffers.providerId, providerId),
              eq(leadOffers.status, "pending"),
              eq(leadOffers.isCurrentOffer, true)
            )
          ).limit(1);
          if (!offer) {
            return { success: false, message: "No active offer found for this provider" };
          }
          if (offer.expiresAt && /* @__PURE__ */ new Date() > offer.expiresAt) {
            await db.update(leadOffers).set({ status: "expired", isCurrentOffer: false }).where(eq(leadOffers.id, offer.id));
            return { success: false, message: "Offer has expired" };
          }
          const leadSettings2 = await this.getLeadSettings();
          const freeLeadsEnabled = leadSettings2.freeLeadsEnabled !== false;
          let isFreeLeadUsed = false;
          if (freeLeadsEnabled && offer.offerType === "unique") {
            const provider = await db.select({ firstLeadsFreeUsed: serviceProviders.firstLeadsFreeUsed }).from(serviceProviders).where(eq(serviceProviders.id, providerId)).limit(1);
            if (provider.length > 0 && (provider[0].firstLeadsFreeUsed || 0) < 3) {
              isFreeLeadUsed = true;
              await db.update(serviceProviders).set({
                firstLeadsFreeUsed: (provider[0].firstLeadsFreeUsed || 0) + 1,
                updatedAt: /* @__PURE__ */ new Date()
              }).where(eq(serviceProviders.id, providerId));
            }
          }
          if (!isFreeLeadUsed) {
            const leadCost = parseFloat(offer.leadCost?.toString() || "0");
            if (leadCost > 0) {
              const creditBalance = await this.getProviderCreditBalance(providerId);
              if (creditBalance >= leadCost) {
                const deductionSuccess = await this.deductProviderCredit(
                  providerId,
                  leadCost,
                  `Lead purchase for request ${requestId}`,
                  offer.id
                );
                if (!deductionSuccess) {
                  return { success: false, message: "Insufficient credit balance" };
                }
              } else {
                return { success: false, message: "Insufficient credit balance. Please add funds to your account." };
              }
            }
          }
          await db.update(leadOffers).set({
            status: "purchased",
            purchasedAt: /* @__PURE__ */ new Date(),
            isCurrentOffer: false
          }).where(eq(leadOffers.id, offer.id));
          if (offer.offerType === "unique" && !isFreeLeadUsed) {
            await this.updateServiceRequestStatus(requestId, "assigned");
          } else if (offer.offerType === "shared") {
            const purchasedSharedCount = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
              and(
                eq(leadOffers.requestId, requestId),
                eq(leadOffers.status, "purchased"),
                eq(leadOffers.offerType, "shared")
              )
            );
            if (purchasedSharedCount[0]?.count >= 3) {
              await this.updateServiceRequestStatus(requestId, "assigned");
            }
          }
          if (offer.offerType === "unique") {
            await this.activateNextUniqueOffer(requestId);
          } else {
            const [distributionLog] = await db.select().from(leadDistributionLog2).where(
              and(
                eq(leadDistributionLog2.requestId, requestId),
                eq(leadDistributionLog2.isActive, true)
              )
            ).limit(1);
            if (distributionLog) {
              const newSharedCount = distributionLog.sharedOffersPurchased + 1;
              await db.update(leadDistributionLog2).set({ sharedOffersPurchased: newSharedCount }).where(eq(leadDistributionLog2.id, distributionLog.id));
              if (newSharedCount >= distributionLog.maxSharedOffers) {
                await this.endLeadDistribution(requestId);
              }
            }
          }
          return { success: true, message: "Lead purchased successfully" };
        } catch (error) {
          console.error("Error purchasing lead:", error);
          return { success: false, message: "Failed to purchase lead" };
        }
      }
      async endLeadDistribution(requestId) {
        try {
          await db.update(leadOffers).set({
            status: "expired",
            isCurrentOffer: false
          }).where(
            and(
              eq(leadOffers.requestId, requestId),
              eq(leadOffers.status, "pending")
            )
          );
          await db.update(leadDistributionLog2).set({ isActive: false }).where(
            and(
              eq(leadDistributionLog2.requestId, requestId),
              eq(leadDistributionLog2.isActive, true)
            )
          );
        } catch (error) {
          console.error("Error ending lead distribution:", error);
          throw error;
        }
      }
      // Check for expired offers and advance to next provider
      async processExpiredLeads() {
        try {
          await this.processUninitializedLeads();
          await this.processDynamicLeadMatching();
          const now = /* @__PURE__ */ new Date();
          await db.update(serviceRequests).set({ status: "expired", updatedAt: now }).where(
            and(
              or(
                eq(serviceRequests.status, "active"),
                eq(serviceRequests.status, "assigned")
              ),
              isNotNull(serviceRequests.preferredDate),
              sql`${serviceRequests.preferredDate} < ${now}`
            )
          );
          await this.processExpiredOffers();
        } catch (error) {
          console.error("Error processing expired leads:", error);
        }
      }
      // Dynamic lead matching for service updates and new providers
      async processDynamicLeadMatching() {
        try {
          const activeLeads = await db.select({
            id: serviceRequests.id,
            categoryId: serviceRequests.categoryId,
            postcode: serviceRequests.postcode,
            status: serviceRequests.status
          }).from(serviceRequests).where(
            or(
              eq(serviceRequests.status, "active"),
              eq(serviceRequests.status, "assigned")
              // In progress leads
            )
          );
          if (activeLeads.length === 0) {
            console.log("No active leads found for dynamic matching");
            return;
          }
          for (const lead of activeLeads) {
            await this.checkForNewProvidersForLead(lead.id, lead.categoryId, lead.postcode);
          }
        } catch (error) {
          console.error("Error processing dynamic lead matching:", error);
        }
      }
      // Check if new providers are eligible for an existing lead
      async checkForNewProvidersForLead(requestId, categoryId, postcode) {
        try {
          const existingProviders = await db.select({ providerId: leadOffers.providerId }).from(leadOffers).where(eq(leadOffers.requestId, requestId));
          const existingProviderIds = existingProviders.map((p) => p.providerId);
          const eligibleProviders = await this.getEligibleProviders(categoryId, postcode);
          const newProviders = eligibleProviders.filter(
            (provider) => !existingProviderIds.includes(provider.providerId)
          );
          if (newProviders.length === 0) {
            return;
          }
          const [currentLead] = await db.select({ status: serviceRequests.status }).from(serviceRequests).where(eq(serviceRequests.id, requestId));
          if (!currentLead) return;
          const leadSettings2 = await this.getLeadSettings();
          const hasUniqueOffers = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
            and(
              eq(leadOffers.requestId, requestId),
              eq(leadOffers.offerType, "unique")
            )
          );
          const isInSharedPhase = hasUniqueOffers[0]?.count > 0;
          for (let i = 0; i < newProviders.length; i++) {
            const provider = newProviders[i];
            if (isInSharedPhase) {
              await this.createSharedOffer(requestId, provider.providerId, leadSettings2);
            } else {
              const totalUniqueOffers = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
                and(
                  eq(leadOffers.requestId, requestId),
                  eq(leadOffers.offerType, "unique")
                )
              );
              const nextSortOrder = (totalUniqueOffers[0]?.count || 0) + 1;
              await this.createUniqueOffer(requestId, provider.providerId, nextSortOrder, leadSettings2);
            }
          }
        } catch (error) {
          console.error(`Error checking for new providers for lead ${requestId}:`, error);
        }
      }
      // Helper method to create shared offers
      async createSharedOffer(requestId, providerId, leadSettings2) {
        const sharedPrice = parseFloat(leadSettings2.uniformSharePrice?.toString() || "12.00");
        await db.insert(leadOffers).values({
          requestId,
          providerId,
          offerType: "shared",
          status: "pending",
          leadCost: sharedPrice.toString(),
          sortOrder: 999,
          // Shared offers don't need specific order
          isCurrentOffer: false,
          // Shared offers are always available
          offerStartTime: /* @__PURE__ */ new Date(),
          expiresAt: null,
          // Shared offers don't expire individually
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      // Helper method to create unique offers
      async createUniqueOffer(requestId, providerId, sortOrder, leadSettings2) {
        const uniquePrice = parseFloat(leadSettings2.uniformUniquePrice?.toString() || "30.00");
        const offerWindow = leadSettings2.uniqueOfferWindow || 2;
        const isCurrentOffer = sortOrder === 1;
        const offerStartTime = isCurrentOffer ? /* @__PURE__ */ new Date() : null;
        const expiresAt = isCurrentOffer ? new Date(Date.now() + offerWindow * 60 * 60 * 1e3) : null;
        await db.insert(leadOffers).values({
          requestId,
          providerId,
          offerType: "unique",
          status: "pending",
          leadCost: uniquePrice.toString(),
          sortOrder,
          isCurrentOffer,
          offerStartTime,
          expiresAt,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      // Process leads that were created but never entered the distribution system
      async processUninitializedLeads() {
        try {
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
          const uninitializedLeads = await db.select({
            id: serviceRequests.id,
            categoryId: serviceRequests.categoryId,
            postcode: serviceRequests.postcode,
            createdAt: serviceRequests.createdAt
          }).from(serviceRequests).leftJoin(leadDistributionLog2, eq(serviceRequests.id, leadDistributionLog2.requestId)).where(
            and(
              eq(serviceRequests.status, "active"),
              isNull(leadDistributionLog2.id),
              // No distribution log entry
              sql`${serviceRequests.createdAt} > ${twentyFourHoursAgo}`
              // Only recent leads
            )
          );
          for (const lead of uninitializedLeads) {
            try {
              await this.initializeLeadDistribution(lead.id);
            } catch (error) {
              console.error(`Failed to initialize lead distribution for lead ${lead.id}:`, error);
            }
          }
          if (uninitializedLeads.length > 0) {
            console.log(`Processed ${uninitializedLeads.length} uninitialized leads`);
          }
        } catch (error) {
          console.error("Error processing uninitialized leads:", error);
        }
      }
      async processExpiredOffers() {
        try {
          const now = /* @__PURE__ */ new Date();
          const expiredOffers = await db.select().from(leadOffers).where(
            and(
              eq(leadOffers.status, "pending"),
              eq(leadOffers.isCurrentOffer, true),
              eq(leadOffers.offerType, "unique"),
              sql`${leadOffers.expiresAt} IS NOT NULL`,
              sql`${leadOffers.expiresAt} <= ${now}`
            )
          );
          for (const expiredOffer of expiredOffers) {
            try {
              console.log(`\u{1F514} Sending expired offer notification to provider ${expiredOffer.providerId}`);
              const { providerNotificationService: providerNotificationService2 } = await Promise.resolve().then(() => (init_providerNotificationService(), providerNotificationService_exports));
              await providerNotificationService2.sendNotificationToProvider(expiredOffer.providerId, {
                title: "Lead Offer Expired",
                message: "One of your lead offers has expired and moved to the next provider.",
                type: "system",
                data: {
                  offerId: expiredOffer.id,
                  requestId: expiredOffer.requestId,
                  expired: true
                }
              });
            } catch (error) {
              console.error("Failed to send expired offer notification:", error);
            }
            await db.update(leadOffers).set({
              status: "expired",
              isCurrentOffer: false
            }).where(eq(leadOffers.id, expiredOffer.id));
            await this.activateNextUniqueOffer(expiredOffer.requestId);
          }
          await this.processExpiredSharedOffers();
        } catch (error) {
          console.error("Error processing expired offers:", error);
        }
      }
      async processExpiredSharedOffers() {
        try {
          const expiredByJobDate = await db.select({
            requestId: leadOffers.requestId
          }).from(leadOffers).innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id)).where(
            and(
              eq(leadOffers.status, "pending"),
              eq(leadOffers.offerType, "shared"),
              sql`${serviceRequests.preferredDate} <= (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
            )
          ).groupBy(leadOffers.requestId);
          for (const expired of expiredByJobDate) {
            await db.update(leadOffers).set({
              status: "expired",
              isCurrentOffer: false
            }).where(
              and(
                eq(leadOffers.requestId, expired.requestId),
                eq(leadOffers.status, "pending"),
                eq(leadOffers.offerType, "shared")
              )
            );
            await this.endLeadDistribution(expired.requestId);
          }
        } catch (error) {
          console.error("Error processing expired shared offers:", error);
        }
      }
      // Credit system implementation
      async getProviderCreditBalance(providerId) {
        try {
          const [provider] = await db.select({ creditBalance: serviceProviders.creditBalance }).from(serviceProviders).where(eq(serviceProviders.id, providerId));
          return parseFloat(provider?.creditBalance || "0");
        } catch (error) {
          console.error("Error getting provider credit balance:", error);
          return 0;
        }
      }
      async addProviderCredit(providerId, amount, description, transactionType = "credit") {
        try {
          const currentBalance = await this.getProviderCreditBalance(providerId);
          const newBalance = currentBalance + amount;
          await db.update(serviceProviders).set({ creditBalance: newBalance.toFixed(2) }).where(eq(serviceProviders.id, providerId));
          await db.insert(providerCreditTransactions).values({
            providerId,
            transactionType,
            amount: amount.toFixed(2),
            balanceBefore: currentBalance.toFixed(2),
            balanceAfter: newBalance.toFixed(2),
            description
          });
        } catch (error) {
          console.error("Error adding provider credit:", error);
          throw error;
        }
      }
      async deductProviderCredit(providerId, amount, description, leadOfferId) {
        try {
          const currentBalance = await this.getProviderCreditBalance(providerId);
          if (currentBalance < amount) {
            console.log(`Insufficient credit for provider ${providerId}. Required: $${amount}, Available: $${currentBalance}`);
            return false;
          }
          const newBalance = currentBalance - amount;
          await db.update(serviceProviders).set({ creditBalance: newBalance.toFixed(2) }).where(eq(serviceProviders.id, providerId));
          await db.insert(providerCreditTransactions).values({
            providerId,
            transactionType: "debit",
            amount: (-amount).toFixed(2),
            // Negative for debit
            balanceBefore: currentBalance.toFixed(2),
            balanceAfter: newBalance.toFixed(2),
            description,
            leadOfferId
          });
          return true;
        } catch (error) {
          console.error("Error deducting provider credit:", error);
          return false;
        }
      }
      async redeemVoucher(providerId, voucherCode) {
        try {
          const [voucher] = await db.select().from(providerVouchers).where(eq(providerVouchers.code, voucherCode));
          if (!voucher) {
            return { success: false, message: "Invalid voucher code" };
          }
          if (voucher.status === "closed") {
            return { success: false, message: "This voucher has already been redeemed" };
          }
          if (voucher.status !== "active") {
            return { success: false, message: "This voucher is not available for redemption" };
          }
          const [existingUsage] = await db.select().from(providerCreditTransactions).where(
            and(
              eq(providerCreditTransactions.providerId, providerId),
              eq(providerCreditTransactions.voucherCode, voucherCode)
            )
          );
          if (existingUsage) {
            return { success: false, message: "You have already used this voucher" };
          }
          const creditAmount = parseFloat(voucher.value);
          await this.addProviderCredit(
            providerId,
            creditAmount,
            `Voucher redeemed: ${voucherCode} - ${voucher.description}`,
            "voucher_redemption"
          );
          await db.update(providerVouchers).set({
            status: "closed",
            redeemedBy: providerId,
            redeemedAt: /* @__PURE__ */ new Date()
          }).where(eq(providerVouchers.id, voucher.id));
          await db.update(providerCreditTransactions).set({ voucherCode }).where(
            and(
              eq(providerCreditTransactions.providerId, providerId),
              eq(providerCreditTransactions.transactionType, "voucher_redemption"),
              isNull(providerCreditTransactions.voucherCode)
            )
          );
          return {
            success: true,
            message: `Successfully added $${creditAmount} to your account!`,
            creditAdded: creditAmount
          };
        } catch (error) {
          console.error("Error redeeming voucher:", error);
          return { success: false, message: "Failed to redeem voucher. Please try again." };
        }
      }
      async getProviderCreditTransactions(providerId) {
        try {
          return await db.select().from(providerCreditTransactions).where(eq(providerCreditTransactions.providerId, providerId)).orderBy(desc(providerCreditTransactions.createdAt));
        } catch (error) {
          console.error("Error getting provider credit transactions:", error);
          return [];
        }
      }
      async getAvailableVouchers() {
        try {
          return await db.select().from(providerVouchers).where(eq(providerVouchers.status, "active")).orderBy(desc(providerVouchers.value));
        } catch (error) {
          console.error("Error getting available vouchers:", error);
          return [];
        }
      }
      async getVoucherByCode(code) {
        try {
          const [voucher] = await db.select().from(providerVouchers).where(eq(providerVouchers.code, code));
          return voucher;
        } catch (error) {
          console.error("Error getting voucher by code:", error);
          return void 0;
        }
      }
      // Admin voucher management methods
      async getAllVouchersAdmin() {
        try {
          return await db.select().from(providerVouchers).orderBy(desc(providerVouchers.createdAt));
        } catch (error) {
          console.error("Error getting all vouchers for admin:", error);
          return [];
        }
      }
      async createVoucherAdmin(voucher) {
        try {
          const [created] = await db.insert(providerVouchers).values(voucher).returning();
          return created;
        } catch (error) {
          console.error("Error creating voucher:", error);
          throw error;
        }
      }
      async createBulkVouchersAdmin(vouchers) {
        try {
          const created = await db.insert(providerVouchers).values(vouchers).returning();
          return { count: created.length, vouchers: created };
        } catch (error) {
          console.error("Error creating bulk vouchers:", error);
          throw error;
        }
      }
      async resetVoucherAdmin(id) {
        try {
          const [updated] = await db.update(providerVouchers).set({
            status: "active",
            redeemedBy: null,
            redeemedAt: null
          }).where(eq(providerVouchers.id, id)).returning();
          return updated;
        } catch (error) {
          console.error("Error resetting voucher:", error);
          throw error;
        }
      }
      async updateVoucherAdmin(id, updates) {
        try {
          const [updated] = await db.update(providerVouchers).set(updates).where(eq(providerVouchers.id, id)).returning();
          return updated;
        } catch (error) {
          console.error("Error updating voucher:", error);
          throw error;
        }
      }
      async deleteVoucherAdmin(id) {
        try {
          const result2 = await db.delete(providerVouchers).where(eq(providerVouchers.id, id));
          return (result2.rowCount ?? 0) > 0;
        } catch (error) {
          console.error("Error deleting voucher:", error);
          return false;
        }
      }
      async purchaseLeadWithCredit(providerId, offerId) {
        try {
          const [offer] = await db.select().from(leadOffers).where(eq(leadOffers.id, offerId));
          if (!offer) {
            return { success: false, message: "Lead offer not found" };
          }
          if (offer.status !== "pending") {
            return { success: false, message: "This lead offer is no longer available" };
          }
          if (offer.providerId !== providerId) {
            return { success: false, message: "This lead is not assigned to you" };
          }
          const leadCost = parseFloat(offer.leadCost);
          const currentBalance = await this.getProviderCreditBalance(providerId);
          const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, providerId));
          if (!provider) {
            return { success: false, message: "Provider not found" };
          }
          let paymentMethod = "";
          let creditUsed = 0;
          let amountCharged = 0;
          let isFreeLeadUsed = false;
          const leadSettings2 = await this.getLeadSettings();
          if (leadSettings2.freeLeadsEnabled && (provider.firstLeadsFreeUsed || 0) < 3) {
            isFreeLeadUsed = true;
            paymentMethod = "free_lead";
            await db.update(serviceProviders).set({
              firstLeadsFreeUsed: (provider.firstLeadsFreeUsed || 0) + 1,
              leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1
            }).where(eq(serviceProviders.id, providerId));
            await db.insert(providerCreditTransactions).values({
              providerId,
              transactionType: "free_lead",
              amount: "0.00",
              balanceBefore: currentBalance.toFixed(2),
              balanceAfter: currentBalance.toFixed(2),
              description: `Free lead used (${(provider.firstLeadsFreeUsed || 0) + 1} of 3) - Lead #${offer.requestId}`,
              leadOfferId: offerId
            });
          } else if (currentBalance >= leadCost) {
            creditUsed = leadCost;
            paymentMethod = "credit_only";
            await this.deductProviderCredit(
              providerId,
              leadCost,
              `Lead purchase - Lead #${offer.requestId}`,
              offerId
            );
            await db.update(serviceProviders).set({ leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1 }).where(eq(serviceProviders.id, providerId));
          } else if (currentBalance > 0) {
            creditUsed = currentBalance;
            amountCharged = leadCost - currentBalance;
            paymentMethod = "credit_and_card";
            await this.deductProviderCredit(
              providerId,
              currentBalance,
              `Partial payment for Lead #${offer.requestId} (Credit portion)`,
              offerId
            );
            await db.update(serviceProviders).set({ leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1 }).where(eq(serviceProviders.id, providerId));
          } else {
            amountCharged = leadCost;
            paymentMethod = "card_only";
            await db.update(serviceProviders).set({ leadsPurchasedCount: (provider.leadsPurchasedCount || 0) + 1 }).where(eq(serviceProviders.id, providerId));
          }
          await db.update(leadOffers).set({
            status: "purchased",
            purchasedAt: /* @__PURE__ */ new Date()
          }).where(eq(leadOffers.id, offerId));
          await db.insert(leadPurchases).values({
            leadOfferId: offerId,
            providerId,
            requestId: offer.requestId,
            totalCost: leadCost.toFixed(2),
            creditUsed: creditUsed.toFixed(2),
            amountCharged: amountCharged.toFixed(2),
            paymentMethod,
            isFreeLeadUsed
          });
          if (offer.offerType === "shared") {
            const [distributionLog] = await db.select().from(leadDistributionLog2).where(eq(leadDistributionLog2.requestId, offer.requestId));
            if (distributionLog) {
              const newSharedCount = (distributionLog.sharedOffersPurchased || 0) + 1;
              await db.update(leadDistributionLog2).set({ sharedOffersPurchased: newSharedCount }).where(eq(leadDistributionLog2.id, distributionLog.id));
              if (newSharedCount >= (distributionLog.maxSharedOffers || 3)) {
                await this.endLeadDistribution(offer.requestId);
              }
            }
          } else if (offer.offerType === "unique") {
            if (isFreeLeadUsed) {
              const leadSettings3 = await this.getLeadSettings();
              if (leadSettings3.firstThreeLeadBehavior === "shared") {
                await this.startSharedPhase(offer.requestId);
              } else {
                await this.endLeadDistribution(offer.requestId);
              }
            } else {
              await this.endLeadDistribution(offer.requestId);
            }
          }
          return {
            success: true,
            message: isFreeLeadUsed ? `Lead purchased using free lead (${(provider.firstLeadsFreeUsed || 0) + 1} of 3 used)` : `Lead purchased successfully! ${creditUsed > 0 ? `Used $${creditUsed} credit` : ""}${amountCharged > 0 ? ` and charged $${amountCharged}` : ""}`,
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
          console.error("Error purchasing lead with credit:", error);
          return { success: false, message: "Failed to purchase lead. Please try again." };
        }
      }
      async getLeadOfferDetails(requestId) {
        try {
          const offerDetails = await db.select({
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
            isFreeLeadUsed: leadPurchases.isFreeLeadUsed
          }).from(leadOffers).leftJoin(serviceProviders, eq(leadOffers.providerId, serviceProviders.id)).leftJoin(providerRatings, eq(leadOffers.providerId, providerRatings.providerId)).leftJoin(leadPurchases, eq(leadOffers.id, leadPurchases.leadOfferId)).where(eq(leadOffers.requestId, requestId)).orderBy(asc(leadOffers.sortOrder), desc(leadOffers.createdAt));
          const [distributionLog] = await db.select().from(leadDistributionLog2).where(eq(leadDistributionLog2.requestId, requestId)).orderBy(desc(leadDistributionLog2.createdAt)).limit(1);
          return {
            distributionLog,
            offers: offerDetails.map((offer) => ({
              ...offer,
              providerName: `${offer.providerFirstName} ${offer.providerLastName}`,
              leadCost: parseFloat(offer.leadCost || "0"),
              rating: parseFloat(offer.rating?.toString() || "5.0")
            }))
          };
        } catch (error) {
          console.error("Error getting lead offer details:", error);
          return { distributionLog: null, offers: [] };
        }
      }
      async getProviderActiveLeads(providerId) {
        try {
          const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, providerId));
          const isNewProvider = (provider?.firstLeadsFreeUsed || 0) < 3;
          const leadSettings2 = await this.getLeadSettings();
          const firstThreeLeadBehavior = leadSettings2.firstThreeLeadBehavior || "shared";
          const freeLeadsEnabled = leadSettings2.freeLeadsEnabled !== void 0 ? leadSettings2.freeLeadsEnabled : true;
          let activeLeads;
          if (freeLeadsEnabled && isNewProvider && firstThreeLeadBehavior === "shared") {
            activeLeads = await this.getLeadsWithSharedPriority(providerId);
          } else {
            activeLeads = await this.getStandardActiveLeads(providerId);
          }
          const filteredLeads = [];
          for (const lead of activeLeads) {
            if (lead.offerType === "shared" && lead.status === "pending") {
              const purchasedCount = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
                and(
                  eq(leadOffers.requestId, lead.requestId),
                  eq(leadOffers.offerType, "shared"),
                  eq(leadOffers.status, "purchased")
                )
              );
              if (purchasedCount[0]?.count < 3) {
                filteredLeads.push(lead);
              }
            } else if (lead.offerType === "unique" && lead.status === "pending") {
              filteredLeads.push(lead);
            } else if (lead.status === "purchased") {
              filteredLeads.push(lead);
            }
          }
          return filteredLeads.map((lead) => ({
            ...lead,
            leadCost: parseFloat(lead.leadCost || "0"),
            budget: parseFloat(lead.budget?.toString() || "0")
          }));
        } catch (error) {
          console.error("Error getting provider active leads:", error);
          return [];
        }
      }
      async getStandardActiveLeads(providerId) {
        return await db.select({
          requestId: serviceRequests.id,
          categoryName: serviceCategories.name,
          customerName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
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
          paymentMethod: providerCreditTransactions.transactionType
        }).from(leadOffers).innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).innerJoin(users, eq(serviceRequests.customerId, users.id)).leftJoin(providerCreditTransactions, eq(leadOffers.id, providerCreditTransactions.leadOfferId)).where(
          and(
            eq(leadOffers.providerId, providerId),
            or(
              // Show all pending offers (both unique and shared)
              eq(leadOffers.status, "pending"),
              // Show purchased offers (for activity history)
              eq(leadOffers.status, "purchased")
            ),
            // Only show leads that haven't expired based on job date (2 hours before)
            // Allow leads with null preferred dates or dates more than 2 hours in the future
            or(
              isNull(serviceRequests.preferredDate),
              sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '2 hours')`
            )
          )
        ).orderBy(desc(serviceRequests.createdAt));
      }
      async getLeadsWithSharedPriority(providerId) {
        const sharedLeads = await db.select({
          requestId: serviceRequests.id,
          categoryName: serviceCategories.name,
          customerName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
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
          paymentMethod: providerCreditTransactions.transactionType
        }).from(leadOffers).innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).innerJoin(users, eq(serviceRequests.customerId, users.id)).leftJoin(providerCreditTransactions, eq(leadOffers.id, providerCreditTransactions.leadOfferId)).where(
          and(
            eq(leadOffers.providerId, providerId),
            eq(leadOffers.offerType, "shared"),
            eq(leadOffers.status, "pending"),
            // Only show leads that haven't expired based on job date (24 hours before)
            sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
          )
        ).orderBy(desc(serviceRequests.createdAt));
        if (sharedLeads.length > 0) {
          const otherLeads = await db.select({
            requestId: serviceRequests.id,
            categoryName: serviceCategories.name,
            customerName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
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
            paymentMethod: providerCreditTransactions.transactionType
          }).from(leadOffers).innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).innerJoin(users, eq(serviceRequests.customerId, users.id)).leftJoin(providerCreditTransactions, eq(leadOffers.id, providerCreditTransactions.leadOfferId)).where(
            and(
              eq(leadOffers.providerId, providerId),
              or(
                // Current unique offers
                and(
                  eq(leadOffers.status, "pending"),
                  eq(leadOffers.isCurrentOffer, true),
                  eq(leadOffers.offerType, "unique")
                ),
                // Purchased offers (for activity history)
                eq(leadOffers.status, "purchased")
              ),
              // Only show leads that haven't expired based on job date (2 hours before)
              // Allow leads with null preferred dates or dates more than 2 hours in the future
              or(
                isNull(serviceRequests.preferredDate),
                sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '2 hours')`
              )
            )
          ).orderBy(desc(serviceRequests.createdAt));
          return [...sharedLeads, ...otherLeads];
        }
        return await this.getStandardActiveLeads(providerId);
      }
      async getProviderClosedLeads(providerId) {
        try {
          const result2 = await db.execute(sql`
        SELECT 
          sr.id as requestId,
          sc.name as categoryName,
          CONCAT(u.first_name, ' ', u.last_name) as customerName,
          u.email as customerEmail,
          u.phone_number as customerPhone,
          sr.suburb,
          sr.postcode,
          sr.preferred_date as preferredDate,
          sr.booking_type as bookingType,
          sr.description,
          sr.urgency,
          sr.budget,
          lo.offer_type as offerType,
          lo.lead_cost as leadCost,
          lo.status,
          lo.is_current_offer as isCurrentOffer,
          lo.expires_at as expiresAt,
          lo.purchased_at as purchasedAt,
          sr.created_at as createdAt,
          pls.status as leadStatus,
          pls.was_job_booked as wasJobBooked,
          pls.closed_at as closedAt
        FROM provider_lead_status pls
        INNER JOIN service_requests sr ON pls.lead_id = sr.id
        INNER JOIN service_categories sc ON sr.category_id = sc.id
        INNER JOIN users u ON sr.customer_id = u.id
        INNER JOIN lead_offers lo ON lo.request_id = sr.id AND lo.provider_id = pls.provider_id
        WHERE pls.provider_id = ${providerId}
          AND pls.status = 'closed'
          AND lo.status = 'purchased'
        ORDER BY pls.closed_at DESC
      `);
          return result2.rows.map((lead) => {
            const mappedLead = {
              requestId: parseInt(lead.requestid),
              categoryName: lead.categoryname,
              customerName: lead.customername,
              customerEmail: lead.customeremail,
              customerPhone: lead.customerphone,
              suburb: lead.suburb,
              postcode: lead.postcode,
              preferredDate: lead.preferreddate,
              bookingType: lead.bookingtype,
              description: lead.description,
              urgency: lead.urgency,
              budget: parseFloat(lead.budget?.toString() || "0"),
              offerType: lead.offertype,
              leadCost: parseFloat(lead.leadcost || "0"),
              status: lead.status,
              isCurrentOffer: lead.iscurrentoffer,
              expiresAt: lead.expiresat,
              purchasedAt: lead.purchasedat,
              createdAt: lead.createdat,
              leadStatus: lead.leadstatus,
              wasJobBooked: lead.wasjobbooked,
              // Fixed case sensitivity issue
              closedAt: lead.closedat
            };
            return mappedLead;
          });
        } catch (error) {
          console.error("Error getting provider closed leads:", error);
          return [];
        }
      }
      async getProviderActivityHistory(providerId) {
        try {
          console.log(`\u{1F50D} Fetching activities for provider ${providerId}...`);
          const activities = await db.select({
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
            urgency: serviceRequests.urgency
          }).from(leadOffers).innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).where(eq(leadOffers.providerId, providerId)).orderBy(desc(leadOffers.createdAt)).limit(50);
          console.log(`\u{1F4CA} Raw activities from DB: ${activities.length}`);
          const processedActivities = activities.map((activity) => {
            let message = "";
            let activityType = "";
            let variant = "default";
            if (activity.status === "purchased") {
              message = `Lead purchased - ${activity.categoryName} in ${activity.suburb}`;
              activityType = "lead_purchased";
              variant = "default";
            } else if (activity.status === "expired") {
              message = `Offer expired - ${activity.categoryName} lead in ${activity.suburb} (was $${activity.leadCost})`;
              activityType = "offer_expired";
              variant = "secondary";
            } else if (activity.status === "pending" && activity.offerType === "unique") {
              if (activity.isCurrentOffer) {
                message = `New offer - ${activity.categoryName} lead in ${activity.suburb} ($${activity.leadCost})`;
                activityType = "new_offer";
                variant = "outline";
              } else {
                message = `Offer pending - ${activity.categoryName} lead in ${activity.suburb} ($${activity.leadCost})`;
                activityType = "offer_pending";
                variant = "secondary";
              }
            } else if (activity.status === "pending" && activity.offerType === "shared") {
              message = `Price DROP - ${activity.categoryName} lead in ${activity.suburb} now $${activity.leadCost}`;
              activityType = "price_drop";
              variant = "secondary";
            } else {
              message = `${activity.status} - ${activity.categoryName} lead in ${activity.suburb} ($${activity.leadCost})`;
              activityType = activity.status || "unknown";
              variant = "secondary";
            }
            return {
              ...activity,
              message,
              activityType,
              variant,
              timestamp: activity.purchasedAt || activity.createdAt,
              leadCost: parseFloat(activity.leadCost || "0")
            };
          });
          const finalActivities = processedActivities.filter((activity) => activity.message);
          console.log(`\u{1F4CB} Final activities after filtering: ${finalActivities.length}`);
          return finalActivities;
        } catch (error) {
          console.error("Error getting provider activity history:", error);
          return [];
        }
      }
      // Provider lead interaction tracking methods
      async logProviderLeadInteraction(interaction) {
        try {
          await db.insert(providerLeadInteractions).values(interaction);
        } catch (error) {
          console.error("Error logging provider lead interaction:", error);
          throw error;
        }
      }
      async getProviderLeadInteractions(leadId) {
        try {
          const results = await db.select({
            id: providerLeadInteractions.id,
            providerId: providerLeadInteractions.providerId,
            leadId: providerLeadInteractions.leadId,
            interactionType: providerLeadInteractions.interactionType,
            createdAt: providerLeadInteractions.createdAt,
            providerName: sql`CONCAT(${serviceProviders.firstName}, ' ', ${serviceProviders.lastName})`,
            providerEmail: serviceProviders.email
          }).from(providerLeadInteractions).innerJoin(serviceProviders, eq(providerLeadInteractions.providerId, serviceProviders.id)).where(eq(providerLeadInteractions.leadId, leadId)).orderBy(desc(providerLeadInteractions.createdAt));
          return results;
        } catch (error) {
          console.error("Error getting provider lead interactions:", error);
          return [];
        }
      }
      // Provider lead status management methods
      async getProviderLeadStatus(providerId, leadId) {
        try {
          const [status] = await db.select().from(providerLeadStatus).where(and(
            eq(providerLeadStatus.providerId, providerId),
            eq(providerLeadStatus.leadId, leadId)
          )).limit(1);
          return status || null;
        } catch (error) {
          console.error("Error getting provider lead status:", error);
          return null;
        }
      }
      async upsertProviderLeadStatus(statusData) {
        try {
          const [status] = await db.insert(providerLeadStatus).values({
            ...statusData,
            statusUpdatedAt: /* @__PURE__ */ new Date()
          }).onConflictDoUpdate({
            target: [providerLeadStatus.providerId, providerLeadStatus.leadId],
            set: {
              status: statusData.status,
              wasJobBooked: statusData.wasJobBooked,
              statusUpdatedAt: /* @__PURE__ */ new Date(),
              closedAt: statusData.status === "closed" ? /* @__PURE__ */ new Date() : void 0
            }
          }).returning();
          return status;
        } catch (error) {
          console.error("Error upserting provider lead status:", error);
          throw error;
        }
      }
      async getProviderLeadStatuses(providerId) {
        try {
          const results = await db.select({
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
              createdAt: serviceRequests.createdAt
            }
          }).from(providerLeadStatus).innerJoin(serviceRequests, eq(providerLeadStatus.leadId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).innerJoin(users, eq(serviceRequests.customerId, users.id)).where(eq(providerLeadStatus.providerId, providerId)).orderBy(desc(providerLeadStatus.statusUpdatedAt));
          return results;
        } catch (error) {
          console.error("Error getting provider lead statuses:", error);
          return [];
        }
      }
      // Admin department methods
      async getAllDepartments() {
        try {
          const departments = await db.select().from(adminDepartments).orderBy(adminDepartments.name);
          return departments;
        } catch (error) {
          console.error("Error getting departments:", error);
          return [];
        }
      }
      async createDepartment(department) {
        try {
          const [newDepartment] = await db.insert(adminDepartments).values(department).returning();
          return newDepartment;
        } catch (error) {
          console.error("Error creating department:", error);
          throw error;
        }
      }
      async updateDepartment(id, updates) {
        try {
          const [updatedDepartment] = await db.update(adminDepartments).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(adminDepartments.id, id)).returning();
          return updatedDepartment;
        } catch (error) {
          console.error("Error updating department:", error);
          throw error;
        }
      }
      async deleteDepartment(id) {
        try {
          await db.delete(adminUserDepartments).where(eq(adminUserDepartments.departmentId, id));
          const result2 = await db.delete(adminDepartments).where(eq(adminDepartments.id, id));
          return result2.rowCount > 0;
        } catch (error) {
          console.error("Error deleting department:", error);
          return false;
        }
      }
      // Admin user methods
      async getAllAdminUsers() {
        try {
          const users2 = await db.select().from(adminUsers).orderBy(adminUsers.firstName, adminUsers.lastName);
          return users2;
        } catch (error) {
          console.error("Error getting admin users:", error);
          return [];
        }
      }
      async getAdminUser(id) {
        try {
          const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
          return user;
        } catch (error) {
          console.error("Error getting admin user:", error);
          return void 0;
        }
      }
      async getAdminUserByUsername(username) {
        try {
          const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
          return user;
        } catch (error) {
          console.error("Error getting admin user by username:", error);
          return void 0;
        }
      }
      async createAdminUser(user) {
        try {
          const [newUser] = await db.insert(adminUsers).values(user).returning();
          return newUser;
        } catch (error) {
          console.error("Error creating admin user:", error);
          throw error;
        }
      }
      async updateAdminUser(id, updates) {
        try {
          const [updatedUser] = await db.update(adminUsers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(adminUsers.id, id)).returning();
          return updatedUser;
        } catch (error) {
          console.error("Error updating admin user:", error);
          throw error;
        }
      }
      async deleteAdminUser(id) {
        try {
          await db.delete(adminUserDepartments).where(eq(adminUserDepartments.userId, id));
          const result2 = await db.delete(adminUsers).where(eq(adminUsers.id, id));
          return result2.rowCount > 0;
        } catch (error) {
          console.error("Error deleting admin user:", error);
          return false;
        }
      }
      // Admin user department methods
      async getUserDepartments(userId) {
        try {
          const departments = await db.select({
            id: adminDepartments.id,
            name: adminDepartments.name,
            createdAt: adminDepartments.createdAt,
            updatedAt: adminDepartments.updatedAt
          }).from(adminDepartments).innerJoin(adminUserDepartments, eq(adminDepartments.id, adminUserDepartments.departmentId)).where(eq(adminUserDepartments.userId, userId));
          return departments;
        } catch (error) {
          console.error("Error getting user departments:", error);
          return [];
        }
      }
      async assignUserToDepartment(userId, departmentId) {
        try {
          await db.insert(adminUserDepartments).values({ userId, departmentId }).onConflictDoNothing();
        } catch (error) {
          console.error("Error assigning user to department:", error);
          throw error;
        }
      }
      async removeUserFromDepartment(userId, departmentId) {
        try {
          await db.delete(adminUserDepartments).where(and(
            eq(adminUserDepartments.userId, userId),
            eq(adminUserDepartments.departmentId, departmentId)
          ));
        } catch (error) {
          console.error("Error removing user from department:", error);
          throw error;
        }
      }
      async updateUserDepartments(userId, departmentIds) {
        try {
          await db.delete(adminUserDepartments).where(eq(adminUserDepartments.userId, userId));
          if (departmentIds.length > 0) {
            const assignments = departmentIds.map((departmentId) => ({ userId, departmentId }));
            await db.insert(adminUserDepartments).values(assignments);
          }
        } catch (error) {
          console.error("Error updating user departments:", error);
          throw error;
        }
      }
      async getProviderBillingData(providerId) {
        try {
          const now = /* @__PURE__ */ new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const purchases = await db.select().from(leadPurchases).where(eq(leadPurchases.providerId, providerId)).orderBy(desc(leadPurchases.purchasedAt));
          const allPaidLeads = [];
          for (const purchase of purchases) {
            const [serviceRequest] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, purchase.requestId));
            const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, serviceRequest.categoryId));
            allPaidLeads.push({
              id: purchase.id,
              requestId: purchase.requestId,
              categoryName: category.name,
              totalCost: parseFloat(purchase.totalCost.toString()),
              creditUsed: parseFloat(purchase.creditUsed.toString()),
              amountCharged: parseFloat(purchase.amountCharged.toString()),
              paymentMethod: purchase.paymentMethod,
              purchasedAt: purchase.purchasedAt.toISOString(),
              customerName: void 0,
              // Not available in current schema
              location: `${serviceRequest.suburb}, ${serviceRequest.postcode}`
            });
          }
          const thisMonthLeads = allPaidLeads.filter(
            (lead) => new Date(lead.purchasedAt) >= startOfMonth
          );
          const thisMonthPurchases = thisMonthLeads.length;
          const thisMonthTotal = thisMonthLeads.reduce(
            (sum, lead) => sum + lead.amountCharged,
            0
          );
          return {
            thisMonthPurchases,
            thisMonthTotal,
            allPaidLeads
          };
        } catch (error) {
          console.error("Error fetching provider billing data:", error);
          throw error;
        }
      }
      // Review system operations
      async createReviewToken(customerId, providerId, requestId) {
        try {
          const crypto2 = await import("crypto");
          const token = crypto2.randomBytes(32).toString("hex");
          const expiresAt = /* @__PURE__ */ new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          await db.insert(reviewTokens).values({
            token,
            customerId,
            providerId,
            requestId,
            expiresAt
          });
          return token;
        } catch (error) {
          console.error("Error creating review token:", error);
          throw error;
        }
      }
      async getReviewToken(token) {
        try {
          const result2 = await db.select({
            token: reviewTokens.token,
            customerId: reviewTokens.customerId,
            providerId: reviewTokens.providerId,
            requestId: reviewTokens.requestId,
            isUsed: reviewTokens.isUsed,
            expiresAt: reviewTokens.expiresAt,
            // Service request details
            customerFirstName: users.firstName,
            customerLastName: users.lastName,
            customerEmail: users.email,
            // Provider details
            providerFirstName: serviceProviders.firstName,
            providerLastName: serviceProviders.lastName,
            // Service details
            categoryName: serviceCategories.name,
            suburb: serviceRequests.suburb,
            description: serviceRequests.description,
            createdAt: serviceRequests.createdAt
          }).from(reviewTokens).innerJoin(users, eq(reviewTokens.customerId, users.id)).innerJoin(serviceProviders, eq(reviewTokens.providerId, serviceProviders.id)).innerJoin(serviceRequests, eq(reviewTokens.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).where(eq(reviewTokens.token, token)).limit(1);
          return result2[0] || null;
        } catch (error) {
          console.error("Error getting review token:", error);
          throw error;
        }
      }
      async submitCustomerReview(reviewData) {
        try {
          const existingReview = await db.select().from(customerReviews).where(
            and(
              eq(customerReviews.customerId, reviewData.customerId),
              eq(customerReviews.providerId, reviewData.providerId),
              eq(customerReviews.requestId, reviewData.requestId)
            )
          ).limit(1);
          if (existingReview.length > 0) {
            throw new Error("Review already submitted for this service");
          }
          const [review] = await db.insert(customerReviews).values({
            customerId: reviewData.customerId,
            providerId: reviewData.providerId,
            requestId: reviewData.requestId,
            overallRating: reviewData.overallRating,
            qualityRating: reviewData.qualityRating,
            professionalismRating: reviewData.professionalismRating,
            timelinessRating: reviewData.timelinessRating,
            valueRating: reviewData.valueRating,
            reviewText: reviewData.reviewText || null,
            isPublic: reviewData.isPublic !== false
            // Default to true
          }).returning();
          await db.update(reviewTokens).set({
            isUsed: true,
            usedAt: /* @__PURE__ */ new Date()
          }).where(eq(reviewTokens.token, reviewData.token));
          await this.updateProviderRating(reviewData.providerId);
          return review;
        } catch (error) {
          console.error("Error submitting customer review:", error);
          throw error;
        }
      }
      async getProviderReviews(providerId) {
        try {
          const reviews = await db.select({
            id: customerReviews.id,
            customerFirstName: users.firstName,
            customerLastName: users.lastName,
            overallRating: customerReviews.overallRating,
            qualityRating: customerReviews.qualityRating,
            professionalismRating: customerReviews.professionalismRating,
            timelinessRating: customerReviews.timelinessRating,
            valueRating: customerReviews.valueRating,
            reviewText: customerReviews.reviewText,
            categoryName: serviceCategories.name,
            suburb: serviceRequests.suburb,
            createdAt: customerReviews.createdAt
          }).from(customerReviews).innerJoin(users, eq(customerReviews.customerId, users.id)).innerJoin(serviceRequests, eq(customerReviews.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).where(
            and(
              eq(customerReviews.providerId, providerId),
              eq(customerReviews.isPublic, true)
            )
          ).orderBy(desc(customerReviews.createdAt));
          return reviews;
        } catch (error) {
          console.error("Error getting provider reviews:", error);
          throw error;
        }
      }
      async getCustomerReviews(customerId) {
        try {
          const reviews = await db.select({
            id: customerReviews.id,
            customerId: customerReviews.customerId,
            providerId: customerReviews.providerId,
            requestId: customerReviews.requestId,
            overallRating: customerReviews.overallRating,
            qualityRating: customerReviews.qualityRating,
            professionalismRating: customerReviews.professionalismRating,
            timelinessRating: customerReviews.timelinessRating,
            valueRating: customerReviews.valueRating,
            reviewText: customerReviews.reviewText,
            isPublic: customerReviews.isPublic,
            createdAt: customerReviews.createdAt,
            // Provider information
            providerFirstName: serviceProviders.firstName,
            providerLastName: serviceProviders.lastName,
            providerEmail: serviceProviders.email,
            // Service request information
            requestCategory: serviceCategories.name,
            requestDescription: serviceRequests.description,
            requestLocation: serviceRequests.suburb
          }).from(customerReviews).innerJoin(serviceProviders, eq(customerReviews.providerId, serviceProviders.id)).innerJoin(serviceRequests, eq(customerReviews.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).where(eq(customerReviews.customerId, customerId)).orderBy(desc(customerReviews.createdAt));
          return reviews;
        } catch (error) {
          console.error("Error getting customer reviews:", error);
          throw error;
        }
      }
      async updateProviderRating(providerId) {
        try {
          const reviewStats = await db.select({
            totalReviews: sql`count(*)`,
            averageRating: sql`round(avg(${customerReviews.overallRating}), 1)`
          }).from(customerReviews).where(eq(customerReviews.providerId, providerId));
          const stats = reviewStats[0];
          if (stats && stats.totalReviews > 0) {
            await db.update(providerRatings).set({
              rating: stats.averageRating.toString(),
              totalReviews: stats.totalReviews,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(providerRatings.providerId, providerId));
          }
        } catch (error) {
          console.error("Error updating provider rating:", error);
          throw error;
        }
      }
      async getProviderRating(providerId) {
        try {
          const result2 = await db.select({
            rating: providerRatings.rating,
            totalReviews: providerRatings.totalReviews,
            averageResponseTime: providerRatings.averageResponseTime,
            completionRate: providerRatings.completionRate
          }).from(providerRatings).where(eq(providerRatings.providerId, providerId)).limit(1);
          return result2[0] || null;
        } catch (error) {
          console.error("Error getting provider rating:", error);
          throw error;
        }
      }
      async getUserReports(fromDate, toDate) {
        try {
          const totalUsers = await this.getUserCount();
          const newUsersThisMonth = await db.select({ count: sql`count(*)` }).from(users).where(
            and(
              gte(users.createdAt, new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1)),
              lte(users.createdAt, /* @__PURE__ */ new Date())
            )
          );
          const thirtyDaysAgo = /* @__PURE__ */ new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const activeUsers = await db.select({ count: sql`count(*)` }).from(users).where(gte(users.lastLogin, thirtyDaysAgo));
          const joined = await db.select({ count: sql`count(*)` }).from(users).where(
            and(
              gte(users.createdAt, fromDate),
              lte(users.createdAt, toDate)
            )
          );
          const leadsGenerated = await db.select({ count: sql`count(*)` }).from(serviceRequests).where(
            and(
              gte(serviceRequests.createdAt, fromDate),
              lte(serviceRequests.createdAt, toDate)
            )
          );
          const uniqueLeadsPurchased = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
            and(
              eq(leadOffers.offerType, "unique"),
              eq(leadOffers.status, "purchased"),
              gte(leadOffers.purchasedAt, fromDate),
              lte(leadOffers.purchasedAt, toDate)
            )
          );
          const sharedLeadsPurchased = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
            and(
              eq(leadOffers.offerType, "shared"),
              eq(leadOffers.status, "purchased"),
              gte(leadOffers.purchasedAt, fromDate),
              lte(leadOffers.purchasedAt, toDate)
            )
          );
          const pendingLeads = await db.select({ count: sql`count(*)` }).from(serviceRequests).where(
            and(
              eq(serviceRequests.status, "active"),
              gte(serviceRequests.createdAt, fromDate),
              lte(serviceRequests.createdAt, toDate)
            )
          );
          const topServiceCategories = await db.select({
            category: serviceCategories.name,
            requestCount: sql`count(*)`
          }).from(serviceRequests).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).where(
            and(
              gte(serviceRequests.createdAt, fromDate),
              lte(serviceRequests.createdAt, toDate)
            )
          ).groupBy(serviceCategories.name).orderBy(desc(sql`count(*)`)).limit(5);
          const previousMonth = new Date(fromDate);
          previousMonth.setMonth(previousMonth.getMonth() - 1);
          const previousMonthUsers = await db.select({ count: sql`count(*)` }).from(users).where(
            and(
              gte(users.createdAt, previousMonth),
              lte(users.createdAt, fromDate)
            )
          );
          const currentMonthCount = joined[0]?.count || 0;
          const previousMonthCount = previousMonthUsers[0]?.count || 0;
          const userGrowthRate = previousMonthCount > 0 ? Math.round((currentMonthCount - previousMonthCount) / previousMonthCount * 100) : 0;
          return {
            totalUsers,
            newUsersThisMonth: newUsersThisMonth[0]?.count || 0,
            activeUsers: activeUsers[0]?.count || 0,
            userGrowthRate,
            averageSessionTime: "15m 30s",
            // Placeholder
            topServiceCategories,
            joined: joined[0]?.count || 0,
            leadsGenerated: leadsGenerated[0]?.count || 0,
            uniqueLeadsPurchased: uniqueLeadsPurchased[0]?.count || 0,
            sharedLeadsPurchased: sharedLeadsPurchased[0]?.count || 0,
            pendingLeads: pendingLeads[0]?.count || 0
          };
        } catch (error) {
          console.error("Error getting user reports:", error);
          return {
            totalUsers: 0,
            newUsersThisMonth: 0,
            activeUsers: 0,
            userGrowthRate: 0,
            averageSessionTime: "N/A",
            topServiceCategories: [],
            joined: 0,
            leadsGenerated: 0,
            uniqueLeadsPurchased: 0,
            sharedLeadsPurchased: 0,
            pendingLeads: 0
          };
        }
      }
      async getTermsAndConditions() {
        try {
          const [terms] = await db.select().from(termsAndConditions).limit(1);
          return terms || null;
        } catch (error) {
          console.error("Error getting terms and conditions:", error);
          return null;
        }
      }
      async updateTermsAndConditions(terms) {
        try {
          const existingTerms = await this.getTermsAndConditions();
          if (existingTerms) {
            const [updatedTerms] = await db.update(termsAndConditions).set({
              ...terms,
              updatedAt: /* @__PURE__ */ new Date(),
              ...terms.providersTerms && { providersUpdatedAt: /* @__PURE__ */ new Date() },
              ...terms.customersTerms && { customersUpdatedAt: /* @__PURE__ */ new Date() },
              ...terms.websiteTerms && { websiteUpdatedAt: /* @__PURE__ */ new Date() }
            }).where(eq(termsAndConditions.id, existingTerms.id)).returning();
            return updatedTerms;
          } else {
            const [newTerms] = await db.insert(termsAndConditions).values({
              ...terms,
              providersUpdatedAt: terms.providersTerms ? /* @__PURE__ */ new Date() : null,
              customersUpdatedAt: terms.customersTerms ? /* @__PURE__ */ new Date() : null,
              websiteUpdatedAt: terms.websiteTerms ? /* @__PURE__ */ new Date() : null
            }).returning();
            return newTerms;
          }
        } catch (error) {
          console.error("Error updating terms and conditions:", error);
          throw error;
        }
      }
      // Lead Management Settings operations
      async getLeadManagementSettings() {
        const leadSettings2 = await this.getLeadSettings();
        const providersCanRedeemCredits = await this.getDecryptedSetting("providers_can_redeem_credits");
        const customerVoucherAreaVisible = await this.getDecryptedSetting("customer_voucher_area_visible");
        const spCreditsAreaVisible = await this.getDecryptedSetting("sp_credits_area_visible");
        return {
          freeLeadsEnabled: leadSettings2.freeLeadsEnabled,
          providersCanRedeemCredits: providersCanRedeemCredits === "true",
          customerVoucherAreaVisible: customerVoucherAreaVisible !== "false",
          spCreditsAreaVisible: spCreditsAreaVisible !== "false"
        };
      }
      async updateLeadManagementSettings(settings) {
        const currentLeadSettings = await this.getLeadSettings();
        const updatedLeadSettings = await this.upsertLeadSettings({
          ...currentLeadSettings,
          freeLeadsEnabled: settings.freeLeadsEnabled
        });
        await this.updateAdminSetting("providers_can_redeem_credits", settings.providersCanRedeemCredits.toString());
        await this.updateAdminSetting("customer_voucher_area_visible", settings.customerVoucherAreaVisible.toString());
        await this.updateAdminSetting("sp_credits_area_visible", settings.spCreditsAreaVisible.toString());
        return this.getLeadManagementSettings();
      }
      // Service Category management operations
      async updateServiceCategory(id, updates) {
        const updatedCategories = await db.update(serviceCategories).set({
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceCategories.id, id)).returning();
        if (updatedCategories.length === 0) {
          throw new Error("Service category not found");
        }
        return updatedCategories[0];
      }
      async updateServiceCategoryImage(id, imageUrl) {
        try {
          const result2 = await db.execute(sql`UPDATE service_categories SET image_url = ${imageUrl}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
          if (result2.rows && result2.rows.length > 0) {
            return result2.rows[0];
          } else {
            throw new Error("Service category not found");
          }
        } catch (error) {
          console.error("Error in updateServiceCategoryImage:", error);
          throw error;
        }
      }
      async deleteServiceCategory(id) {
        try {
          const providerServices2 = await db.select().from(providerServices2).where(eq(providerServices2.categoryId, id)).limit(1);
          if (providerServices2.length > 0) {
            throw new Error("Cannot delete category that is being used by providers");
          }
          const serviceRequests2 = await db.select().from(serviceRequests2).where(eq(serviceRequests2.categoryId, id)).limit(1);
          if (serviceRequests2.length > 0) {
            throw new Error("Cannot delete category that has associated service requests");
          }
          const result2 = await db.delete(serviceCategories).where(eq(serviceCategories.id, id)).returning();
          return result2.length > 0;
        } catch (error) {
          console.error("Error deleting service category:", error);
          throw error;
        }
      }
      // Customer credit system operations
      async getCustomerCreditBalance(customerId) {
        try {
          const [user] = await db.select({ creditBalance: users.creditBalance }).from(users).where(eq(users.id, customerId));
          return parseFloat(user?.creditBalance?.toString() || "0");
        } catch (error) {
          console.error("Error getting customer credit balance:", error);
          return 0;
        }
      }
      async addCustomerCredit(customerId, amount, description, transactionType = "credit") {
        try {
          const currentBalance = await this.getCustomerCreditBalance(customerId);
          const newBalance = currentBalance + amount;
          await db.update(users).set({ creditBalance: newBalance.toFixed(2) }).where(eq(users.id, customerId));
          await db.insert(customerCreditTransactions).values({
            customerId,
            transactionType,
            amount: amount.toFixed(2),
            balanceBefore: currentBalance.toFixed(2),
            balanceAfter: newBalance.toFixed(2),
            description
          });
        } catch (error) {
          console.error("Error adding customer credit:", error);
          throw error;
        }
      }
      async deductCustomerCredit(customerId, amount, description, serviceRequestId) {
        try {
          const currentBalance = await this.getCustomerCreditBalance(customerId);
          if (currentBalance < amount) {
            return false;
          }
          const newBalance = currentBalance - amount;
          await db.update(users).set({ creditBalance: newBalance.toFixed(2) }).where(eq(users.id, customerId));
          await db.insert(customerCreditTransactions).values({
            customerId,
            transactionType: "debit",
            amount: (-amount).toFixed(2),
            balanceBefore: currentBalance.toFixed(2),
            balanceAfter: newBalance.toFixed(2),
            description,
            serviceRequestId
          });
          return true;
        } catch (error) {
          console.error("Error deducting customer credit:", error);
          return false;
        }
      }
      async redeemCustomerVoucher(customerId, voucherCode) {
        try {
          const [voucher] = await db.select().from(customerVouchers).where(eq(customerVouchers.code, voucherCode));
          if (!voucher) {
            return { success: false, message: "Invalid voucher code" };
          }
          if (voucher.status !== "active") {
            return { success: false, message: "Voucher is not active" };
          }
          if (voucher.redeemedBy) {
            return { success: false, message: "Voucher has already been redeemed" };
          }
          if (/* @__PURE__ */ new Date() > new Date(voucher.expiryDate)) {
            return { success: false, message: "Voucher has expired" };
          }
          const creditAmount = parseFloat(voucher.value.toString());
          await this.addCustomerCredit(customerId, creditAmount, `Voucher redemption: ${voucherCode}`, "voucher_redemption");
          await db.update(customerVouchers).set({
            redeemedBy: customerId,
            redeemedAt: /* @__PURE__ */ new Date(),
            status: "closed"
          }).where(eq(customerVouchers.id, voucher.id));
          return {
            success: true,
            message: `Successfully redeemed voucher! Added $${creditAmount} to your account.`,
            creditAdded: creditAmount
          };
        } catch (error) {
          console.error("Error redeeming customer voucher:", error);
          return { success: false, message: "Failed to redeem voucher. Please try again." };
        }
      }
      async getCustomerCreditTransactions(customerId) {
        try {
          const transactions = await db.select().from(customerCreditTransactions).where(eq(customerCreditTransactions.customerId, customerId)).orderBy(desc(customerCreditTransactions.createdAt));
          return transactions;
        } catch (error) {
          console.error("Error getting customer credit transactions:", error);
          return [];
        }
      }
      async getAvailableCustomerVouchers() {
        try {
          const vouchers = await db.select().from(customerVouchers).where(
            and(
              eq(customerVouchers.status, "active"),
              isNull(customerVouchers.redeemedBy),
              gt(customerVouchers.expiryDate, /* @__PURE__ */ new Date())
            )
          ).orderBy(desc(customerVouchers.createdAt));
          return vouchers;
        } catch (error) {
          console.error("Error getting available customer vouchers:", error);
          return [];
        }
      }
      async getCustomerVoucherByCode(code) {
        try {
          const [voucher] = await db.select().from(customerVouchers).where(eq(customerVouchers.code, code));
          return voucher;
        } catch (error) {
          console.error("Error getting customer voucher by code:", error);
          return void 0;
        }
      }
      // Potential Customers operations
      async getAllPotentialCustomers() {
        try {
          return await db.select().from(potentialCustomers).orderBy(desc(potentialCustomers.createdAt));
        } catch (error) {
          console.error("Error getting all potential customers:", error);
          return [];
        }
      }
      async getPotentialCustomersByImportId(importId) {
        try {
          return await db.select().from(potentialCustomers).where(eq(potentialCustomers.importId, importId)).orderBy(desc(potentialCustomers.createdAt));
        } catch (error) {
          console.error("Error getting potential customers by import ID:", error);
          return [];
        }
      }
      async getPotentialCustomerImportGroups() {
        try {
          const groups = await db.select({
            importId: potentialCustomers.importId,
            importName: potentialCustomers.importName,
            count: sql`count(*)`,
            createdAt: sql`min(${potentialCustomers.createdAt})`,
            smsDeliveryStatus: sql`max(${potentialCustomers.smsDeliveryStatus})`
          }).from(potentialCustomers).groupBy(potentialCustomers.importId, potentialCustomers.importName).orderBy(desc(sql`min(${potentialCustomers.createdAt})`));
          return groups;
        } catch (error) {
          console.error("Error getting potential customer import groups:", error);
          return [];
        }
      }
      async importPotentialCustomers(file, importName) {
        try {
          const importId = `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const customers = [];
          if (!file) {
            const sampleCustomers = [
              {
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "+61412345678",
                state: "QLD",
                city: "Brisbane",
                address: "123 Main St, Brisbane QLD 4000",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                phone: "+61487654321",
                state: "NSW",
                city: "Sydney",
                address: "456 Park Ave, Sydney NSW 2000",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Michael Johnson",
                email: "michael.johnson@example.com",
                phone: "+61423456789",
                state: "VIC",
                city: "Melbourne",
                address: "789 Collins St, Melbourne VIC 3000",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Sarah Wilson",
                email: "sarah.wilson@example.com",
                phone: "+61434567890",
                state: "WA",
                city: "Perth",
                address: "321 Hay St, Perth WA 6000",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "David Brown",
                email: "david.brown@example.com",
                phone: "+61445678901",
                state: "SA",
                city: "Adelaide",
                address: "654 Rundle St, Adelaide SA 5000",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Lisa Davis",
                email: "lisa.davis@example.com",
                phone: "+61456789012",
                state: "QLD",
                city: "Gold Coast",
                address: "987 Surfers Paradise Blvd, Gold Coast QLD 4217",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Robert Taylor",
                email: "robert.taylor@example.com",
                phone: "+61467890123",
                state: "NSW",
                city: "Newcastle",
                address: "147 Hunter St, Newcastle NSW 2300",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Emma Anderson",
                email: "emma.anderson@example.com",
                phone: "+61478901234",
                state: "TAS",
                city: "Hobart",
                address: "258 Elizabeth St, Hobart TAS 7000",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "James Wilson",
                email: "james.wilson@example.com",
                phone: "+61489012345",
                state: "NT",
                city: "Darwin",
                address: "369 Mitchell St, Darwin NT 0800",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              },
              {
                name: "Amanda Lee",
                email: "amanda.lee@example.com",
                phone: "+61490123456",
                state: "ACT",
                city: "Canberra",
                address: "741 Northbourne Ave, Canberra ACT 2601",
                importId,
                importName,
                smsDeliveryStatus: "not_sent"
              }
            ];
            const result2 = await db.insert(potentialCustomers).values(sampleCustomers).returning();
            return { count: result2.length };
          }
          return new Promise(async (resolve, reject) => {
            const results = [];
            if (!file) {
              console.error("File object is invalid:", file);
              reject(new Error("Invalid file object"));
              return;
            }
            if (file.tempFilePath && file.tempFilePath !== "") {
              fs.createReadStream(file.tempFilePath).pipe(csv()).on("data", (data) => {
                if (!data.Name || !data.Email || !data.Phone || !data.State || !data.City || !data.Address) {
                  console.error("Missing required fields in CSV row:", data);
                  return;
                }
                const customer = {
                  name: data.Name.trim(),
                  email: data.Email.trim(),
                  phone: data.Phone.trim(),
                  state: data.State.trim(),
                  city: data.City.trim(),
                  address: data.Address.trim(),
                  importId,
                  importName,
                  smsDeliveryStatus: "not_sent"
                };
                results.push(customer);
              }).on("end", async () => {
                try {
                  if (results.length === 0) {
                    reject(new Error("No customers data provided"));
                    return;
                  }
                  const result2 = await db.insert(potentialCustomers).values(results).returning();
                  resolve({ count: result2.length });
                } catch (error) {
                  console.error("Error importing potential customers:", error);
                  reject(new Error("Failed to import potential customers"));
                }
              }).on("error", (error) => {
                console.error("Error parsing CSV file:", error);
                reject(new Error("Failed to parse CSV file"));
              });
            } else if (file.data) {
              const csvString = file.data.toString("utf8");
              const lines = csvString.split("\n");
              for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const values = line.split(",").map((val) => val.trim().replace(/^"|"$/g, ""));
                if (values.length < 6) {
                  console.error("Invalid CSV row:", line);
                  continue;
                }
                const [name, email, phone, state, city, address] = values;
                if (!name || !email || !phone || !state || !city || !address) {
                  console.error("Missing required fields in CSV row:", values);
                  continue;
                }
                const customer = {
                  name: name.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                  state: state.trim(),
                  city: city.trim(),
                  address: address.trim(),
                  importId,
                  importName,
                  smsDeliveryStatus: "not_sent"
                };
                results.push(customer);
              }
              if (results.length === 0) {
                reject(new Error("No customers data provided"));
                return;
              }
              try {
                const result2 = await db.insert(potentialCustomers).values(results).returning();
                resolve({ count: result2.length });
              } catch (error) {
                console.error("Error importing potential customers:", error);
                reject(new Error("Failed to import potential customers"));
              }
            } else {
              reject(new Error("No file data or temp file available"));
            }
          });
        } catch (error) {
          console.error("Error importing potential customers:", error);
          throw new Error("Failed to import potential customers");
        }
      }
      async updatePotentialCustomerSmsStatus(customerId, status) {
        try {
          const updateData = {};
          if (status === "1st_sent") {
            updateData.smsDeliveryStatus = "1st_sent";
            updateData.firstSmsSentAt = /* @__PURE__ */ new Date();
          } else if (status === "2nd_sent") {
            updateData.smsDeliveryStatus = "2nd_sent";
            updateData.secondSmsSentAt = /* @__PURE__ */ new Date();
          }
          await db.update(potentialCustomers).set(updateData).where(eq(potentialCustomers.id, customerId));
        } catch (error) {
          console.error("Error updating potential customer SMS status:", error);
          throw new Error("Failed to update SMS status");
        }
      }
      async updatePotentialCustomerCampaignStatus(customerId, status) {
        try {
          await db.update(potentialCustomers).set({
            campaignStatus: status,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(potentialCustomers.id, customerId));
          console.log(`Updated customer ${customerId} campaign status to ${status}`);
        } catch (error) {
          console.error("Error updating potential customer campaign status:", error);
          throw new Error("Failed to update campaign status");
        }
      }
      async sendSmsToPotentialCustomers(customerIds) {
        try {
          let successCount = 0;
          const details = [];
          for (const customerId of customerIds) {
            try {
              const [customer] = await db.select().from(potentialCustomers).where(eq(potentialCustomers.id, customerId));
              if (!customer) {
                console.warn(`[SMS][skip] Customer not found: id=${customerId}`);
                details.push({ customerId, name: "", phone: "", status: "skipped", sent: false, reason: "not_found" });
                continue;
              }
              if (customer.campaignStatus === "Unsubscribe") {
                console.warn(`[SMS][skip] Customer unsubscribed -> id=${customer.id} name=${customer.name}`);
                details.push({ customerId: customer.id, name: customer.name, phone: customer.phone, status: "skipped", sent: false, reason: "unsubscribed" });
                continue;
              }
              const normalizedPhone = (() => {
                const raw = (customer.phone || "").toString();
                const digits = raw.replace(/[^0-9+]/g, "");
                if (!digits) return null;
                if (digits.startsWith("+61")) return digits;
                if (digits.startsWith("61")) return `+${digits}`;
                if (digits.startsWith("0")) return `+61${digits.slice(1)}`;
                return null;
              })();
              if (!normalizedPhone) {
                console.warn(`[SMS][skip] Invalid phone format -> id=${customer.id} raw=${customer.phone}`);
                details.push({ customerId: customer.id, name: customer.name, phone: customer.phone, status: "skipped", sent: false, reason: "invalid_phone" });
                continue;
              }
              let smsStatus;
              if (customer.smsDeliveryStatus === "not_sent" || !customer.smsDeliveryStatus) {
                smsStatus = "1st_sent";
              } else if (customer.smsDeliveryStatus === "1st_sent") {
                smsStatus = "2nd_sent";
              } else {
                console.warn(`[SMS][skip] Already sent 2 SMS -> id=${customer.id}`);
                details.push({ customerId: customer.id, name: customer.name, phone: customer.phone, status: "skipped", sent: false, reason: "limit_reached" });
                continue;
              }
              const templateMessage = smsStatus === "1st_sent" ? `Hi ${customer.name}! \u{1F44B} 

ServicePanda here! We noticed you might be looking for reliable service providers in your area.

We have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?

Reply YES to get started, or visit our website for more info.

Best regards,
ServicePanda Team` : `Hi ${customer.name}! 

Just following up on our previous message about ServicePanda's verified service providers.

We're here to connect you with trusted professionals in your area. No obligation, just quality service connections.

Reply YES to learn more, or call us directly.

ServicePanda Team`;
              console.log(`[SMS] Sending -> id=${customer.id} status=${smsStatus} to=${normalizedPhone}`);
              const smsSent = await smsService.sendSms(normalizedPhone, templateMessage, { customerId: customer.id, smsType: smsStatus });
              if (smsSent) {
                await this.updatePotentialCustomerSmsStatus(customerId, smsStatus);
                successCount++;
                console.log(`SMS ${smsStatus} sent successfully to ${customer.name} at ${customer.phone}`);
                smsService.recordOutbound({
                  recipientType: "potential_customer",
                  recipientId: customer.id,
                  recipientPhone: normalizedPhone,
                  recipientName: customer.name,
                  message: templateMessage,
                  smsType: smsStatus,
                  sentBy: "admin",
                  status: "sent"
                });
                try {
                  await this.ensureSmsMessagesTable();
                  await db.insert(smsMessages).values({
                    recipientType: "potential_customer",
                    recipientId: customer.id,
                    recipientPhone: normalizedPhone,
                    recipientName: customer.name,
                    message: templateMessage,
                    direction: "outbound",
                    status: "sent",
                    smsType: smsStatus,
                    sentBy: "admin",
                    sentAt: /* @__PURE__ */ new Date(),
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date()
                  });
                } catch (e) {
                  console.warn("Failed to persist SMS to DB (non-fatal):", e);
                }
                details.push({ customerId: customer.id, name: customer.name, phone: normalizedPhone, status: smsStatus, sent: true });
              } else {
                console.error(`Failed to send SMS ${smsStatus} to ${customer.name} at ${customer.phone}`);
                details.push({ customerId: customer.id, name: customer.name, phone: normalizedPhone, status: smsStatus, sent: false, reason: "api_failed" });
                smsService.recordOutbound({
                  recipientType: "potential_customer",
                  recipientId: customer.id,
                  recipientPhone: normalizedPhone,
                  recipientName: customer.name,
                  message: templateMessage,
                  smsType: smsStatus,
                  sentBy: "admin",
                  status: "failed"
                });
                try {
                  await this.ensureSmsMessagesTable();
                  await db.insert(smsMessages).values({
                    recipientType: "potential_customer",
                    recipientId: customer.id,
                    recipientPhone: normalizedPhone,
                    recipientName: customer.name,
                    message: templateMessage,
                    direction: "outbound",
                    status: "failed",
                    smsType: smsStatus,
                    sentBy: "admin",
                    sentAt: /* @__PURE__ */ new Date(),
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date()
                  });
                } catch (e) {
                  console.warn("Failed to persist failed SMS to DB (non-fatal):", e);
                }
              }
            } catch (error) {
              console.error(`Error sending SMS to customer ${customerId}:`, error);
              details.push({ customerId, name: "", phone: "", status: "skipped", sent: false, reason: "exception" });
            }
          }
          return { count: successCount, details };
        } catch (error) {
          console.error("Error sending SMS to potential customers:", error);
          throw new Error("Failed to send SMS");
        }
      }
      async getProviderReports() {
        try {
          const startTime = Date.now();
          const providerStats = await db.select({
            total: sql`count(*)`,
            approved: sql`count(case when ${serviceProviders.status} = 'approved' then 1 end)`,
            pending: sql`count(case when ${serviceProviders.status} = 'pending' then 1 end)`,
            rejected: sql`count(case when ${serviceProviders.status} = 'rejected' then 1 end)`
          }).from(serviceProviders);
          const totalProviders = providerStats[0]?.total || 0;
          const approvedProviders = providerStats[0]?.approved || 0;
          const pendingProviders = providerStats[0]?.pending || 0;
          const rejectedProviders = providerStats[0]?.rejected || 0;
          const currentDate = /* @__PURE__ */ new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const newProvidersThisMonth = await db.select({ count: sql`count(*)` }).from(serviceProviders).where(
            and(
              gte(serviceProviders.createdAt, firstDayOfMonth),
              eq(serviceProviders.status, "approved")
            )
          );
          const monthlyData = await db.select({
            month: sql`to_char(${serviceProviders.createdAt}, 'YYYY-MM')`,
            status: serviceProviders.status,
            count: sql`cast(count(*) as integer)`
          }).from(serviceProviders).where(
            gte(serviceProviders.createdAt, sql`CURRENT_DATE - INTERVAL '4 years'`)
          ).groupBy(sql`to_char(${serviceProviders.createdAt}, 'YYYY-MM'), ${serviceProviders.status}`);
          const monthlyJoins = [];
          const monthMap = /* @__PURE__ */ new Map();
          const now = /* @__PURE__ */ new Date();
          const last4Years = [];
          for (let i = 47; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            last4Years.push(monthKey);
            monthMap.set(monthKey, {
              month: monthName,
              count: 0,
              approved: 0,
              pending: 0,
              rejected: 0
            });
          }
          monthlyData.forEach((row) => {
            const monthKey = row.month;
            const monthData = monthMap.get(monthKey);
            if (monthData) {
              const count = parseInt(row.count.toString()) || 0;
              monthData.count += count;
              if (row.status === "approved") monthData.approved = parseInt(row.count.toString()) || 0;
              if (row.status === "pending") monthData.pending = parseInt(row.count.toString()) || 0;
              if (row.status === "rejected") monthData.rejected = parseInt(row.count.toString()) || 0;
            }
          });
          last4Years.forEach((monthKey) => {
            const monthData = monthMap.get(monthKey);
            if (monthData) {
              monthlyJoins.push(monthData);
            }
          });
          const topServiceCategories = await db.select({
            category: serviceCategories.name,
            providerCount: sql`count(distinct ${providerServices.providerId})`
          }).from(providerServices).innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id)).groupBy(serviceCategories.name).orderBy(desc(sql`count(distinct ${providerServices.providerId})`)).limit(5);
          const approvalTimeData = await db.select({
            avgDays: sql`avg(
            case 
              when ${serviceProviders.status} = 'approved' 
              then extract(epoch from (${serviceProviders.updatedAt} - ${serviceProviders.createdAt})) / 86400
              else null 
            end
          )`
          }).from(serviceProviders).where(eq(serviceProviders.status, "approved"));
          const avgApprovalDays = approvalTimeData[0]?.avgDays || 3;
          const avgApprovalTime = `${Math.round(avgApprovalDays)} days`;
          const approvalRate = totalProviders > 0 ? Math.round(approvedProviders / totalProviders * 100) : 0;
          const avgRatingResult = await db.select({ avgRating: sql`avg(${providerRatings.rating})` }).from(providerRatings);
          const avgRating = avgRatingResult[0]?.avgRating || 4.8;
          const jobCompletionData = await db.select({
            totalRequests: sql`count(*)`,
            completedRequests: sql`count(case when ${serviceRequests.status} = 'completed' then 1 end)`
          }).from(serviceRequests).where(
            and(
              eq(serviceRequests.status, "completed"),
              gte(serviceRequests.createdAt, new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
            )
          );
          const totalRequests = jobCompletionData[0]?.totalRequests || 0;
          const completedRequests = jobCompletionData[0]?.completedRequests || 0;
          const jobCompletionRate = totalRequests > 0 ? Math.round(completedRequests / totalRequests * 100) : 92;
          const responseTimeData = await db.select({
            avgHours: sql`avg(
            case 
              when ${providerLeadInteractions.interactionType} = 'initial_response'
              then extract(epoch from (${providerLeadInteractions.createdAt} - ${leadAssignments.createdAt})) / 3600
              else null 
            end
          )`
          }).from(providerLeadInteractions).innerJoin(leadAssignments, eq(providerLeadInteractions.leadId, leadAssignments.id)).where(eq(providerLeadInteractions.interactionType, "initial_response"));
          const avgResponseHours = responseTimeData[0]?.avgHours || 24;
          const avgResponseTime = avgResponseHours < 24 ? `${Math.round(avgResponseHours)}h` : `${Math.round(avgResponseHours / 24)}d`;
          const result2 = {
            totalProviders,
            approvedProviders,
            pendingProviders,
            rejectedProviders,
            newProvidersThisMonth: newProvidersThisMonth[0]?.count || 0,
            topServiceCategories: topServiceCategories.map((cat) => ({
              category: cat.category,
              providerCount: cat.providerCount
            })),
            avgApprovalTime,
            approvalRate,
            avgRating: Math.round(avgRating * 10) / 10,
            // Round to 1 decimal place
            jobCompletionRate,
            avgResponseTime,
            monthlyJoins
          };
          const endTime = Date.now();
          return result2;
        } catch (error) {
          console.error("Error getting provider reports:", error);
          throw new Error("Failed to get provider reports");
        }
      }
      // Potential Providers methods
      async getAllPotentialProviders(adminUsername, isSuperAdmin = false) {
        try {
          console.log("=== DEBUG: Getting potential providers ===");
          console.log("Admin username filter:", adminUsername);
          console.log("Is super admin:", isSuperAdmin);
          console.log("Will apply filtering:", adminUsername && !isSuperAdmin);
          let query = db.select({
            id: potentialProviders.id,
            firstName: potentialProviders.firstName,
            lastName: potentialProviders.lastName,
            email: potentialProviders.email,
            phone: potentialProviders.phone,
            businessName: potentialProviders.businessName,
            businessAbn: potentialProviders.businessAbn,
            address: potentialProviders.address,
            state: potentialProviders.state,
            city: potentialProviders.city,
            postcode: potentialProviders.postcode,
            serviceCategories: potentialProviders.serviceCategories,
            source: potentialProviders.source,
            importId: potentialProviders.importId,
            importName: potentialProviders.importName,
            status: potentialProviders.status,
            priority: potentialProviders.priority,
            assignedTo: potentialProviders.assignedTo,
            assignedAdminName: sql`CONCAT(${adminUsers.firstName}, ' ', ${adminUsers.lastName})`.as("assignedAdminName"),
            taskTitle: sql`${potentialProviderTasks.title}`.as("taskTitle"),
            smsDeliveryStatus: potentialProviders.smsDeliveryStatus,
            firstSmsSentAt: potentialProviders.firstSmsSentAt,
            secondSmsSentAt: potentialProviders.secondSmsSentAt,
            notes: potentialProviders.notes,
            nextFollowUpDate: potentialProviders.nextFollowUpDate,
            lastContactDate: potentialProviders.lastContactDate,
            lastContactType: potentialProviders.lastContactType,
            createdAt: potentialProviders.createdAt,
            updatedAt: potentialProviders.updatedAt
          }).from(potentialProviders).leftJoin(potentialProviderTasks, eq(potentialProviders.id, potentialProviderTasks.potentialProviderId)).leftJoin(adminUsers, eq(potentialProviderTasks.assignedTo, adminUsers.username));
          if (adminUsername && !isSuperAdmin) {
            query = query.where(eq(potentialProviderTasks.assignedTo, adminUsername));
            console.log("Filtering by assigned admin:", adminUsername);
          } else if (isSuperAdmin) {
            console.log("Super admin - showing all tasks");
          }
          const providers = await query.orderBy(desc(potentialProviders.createdAt));
          console.log("=== DEBUG: Query result ===");
          console.log("Total providers found:", providers.length);
          if (providers.length > 0) {
            console.log("First provider:", {
              id: providers[0].id,
              name: `${providers[0].firstName} ${providers[0].lastName}`,
              status: providers[0].status,
              assignedTo: providers[0].assignedTo,
              assignedAdminName: providers[0].assignedAdminName,
              taskTitle: providers[0].taskTitle
            });
          }
          try {
            console.log("\n=== DEBUG: Checking potential_provider_tasks table ===");
            const potentialProviderTasksData = await db.select().from(potentialProviderTasks).limit(3);
            console.log("Potential provider tasks found:", potentialProviderTasksData.length);
            if (potentialProviderTasksData.length > 0) {
              console.log("First potential provider task:", {
                id: potentialProviderTasksData[0].id,
                potentialProviderId: potentialProviderTasksData[0].potentialProviderId,
                assignedTo: potentialProviderTasksData[0].assignedTo
              });
            }
          } catch (error) {
            console.log("Error checking potential_provider_tasks:", error.message);
          }
          return providers;
        } catch (error) {
          console.error("Error getting potential providers:", error);
          throw error;
        }
      }
      async createPotentialProvider(providerData) {
        try {
          const [provider] = await db.insert(potentialProviders).values({
            firstName: providerData.firstName,
            lastName: providerData.lastName,
            email: providerData.email,
            phone: providerData.phone,
            businessName: providerData.businessName || null,
            businessAbn: providerData.businessAbn || null,
            address: providerData.address,
            state: providerData.state,
            city: providerData.city,
            postcode: providerData.postcode,
            serviceCategories: providerData.serviceCategories || null,
            source: providerData.source || "manual",
            priority: providerData.priority || "medium",
            notes: providerData.notes || null,
            status: "new",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return provider;
        } catch (error) {
          console.error("Error creating potential provider:", error);
          throw error;
        }
      }
      async importPotentialProviders(csvData, importName) {
        try {
          const lines = csvData.trim().split("\n");
          const headers = lines[0].split(",").map((h) => h.trim());
          const data = lines.slice(1);
          const importId = `import_${Date.now()}`;
          const providers = [];
          for (const line of data) {
            const values = line.split(",").map((v) => v.trim());
            const provider = {
              firstName: values[0] || "",
              lastName: values[1] || "",
              email: values[2] || "",
              phone: values[3] || "",
              businessName: values[4] || null,
              businessAbn: values[5] || null,
              address: values[6] || "",
              city: values[7] || "",
              state: values[8] || "",
              postcode: values[9] || "",
              serviceCategories: values[10] || null,
              source: "import",
              importId,
              importName,
              priority: "medium",
              status: "new",
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            };
            providers.push(provider);
          }
          console.log(`Parsed ${providers.length} potential providers for confirmation`);
          return { count: providers.length, providers };
        } catch (error) {
          console.error("Error importing potential providers:", error);
          throw error;
        }
      }
      async confirmPotentialProvidersImport(providers) {
        try {
          console.log("Confirming import of potential providers");
          if (providers.length > 0) {
            await db.insert(potentialProviders).values(providers);
          }
          console.log(`Confirmed import of ${providers.length} potential providers`);
          return { count: providers.length };
        } catch (error) {
          console.error("Error confirming potential providers import:", error);
          throw error;
        }
      }
      async updatePotentialProvider(id, updates) {
        try {
          const [provider] = await db.update(potentialProviders).set({
            ...updates,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(potentialProviders.id, id)).returning();
          return provider;
        } catch (error) {
          console.error("Error updating potential provider:", error);
          throw error;
        }
      }
      async updatePotentialProviderSmsStatus(providerId, status) {
        try {
          const updateData = {};
          if (status === "1st_sent") {
            updateData.smsDeliveryStatus = "1st_sent";
            updateData.firstSmsSentAt = /* @__PURE__ */ new Date();
          } else if (status === "2nd_sent") {
            updateData.smsDeliveryStatus = "2nd_sent";
            updateData.secondSmsSentAt = /* @__PURE__ */ new Date();
          }
          console.log(`\u{1F504} Updating provider ${providerId} with data:`, updateData);
          const result2 = await db.update(potentialProviders).set({
            ...updateData,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(potentialProviders.id, providerId)).returning();
          console.log(`\u2705 Updated provider ${providerId} SMS status to ${status}. Result:`, result2);
        } catch (error) {
          console.error("\u274C Error updating potential provider SMS status:", error);
          throw new Error("Failed to update SMS status");
        }
      }
      async createPotentialProviderTask(taskData) {
        try {
          const [task] = await db.insert(potentialProviderTasks).values({
            potentialProviderId: taskData.potentialProviderId,
            taskType: taskData.taskType,
            title: taskData.title,
            description: taskData.description || null,
            scheduledDate: taskData.scheduledDate ? new Date(taskData.scheduledDate) : null,
            assignedTo: taskData.assignedTo || null,
            status: "pending",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          if (taskData.potentialProviderId) {
            await db.update(potentialProviders).set({
              status: "active",
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(potentialProviders.id, taskData.potentialProviderId));
            console.log(`\u2705 Updated provider ${taskData.potentialProviderId} status from 'new' to 'active' after task creation`);
          }
          return task;
        } catch (error) {
          console.error("Error creating potential provider task:", error);
          throw error;
        }
      }
      async sendEmailToPotentialProvider(providerId, subject, content) {
        try {
          const provider = await db.select().from(potentialProviders).where(eq(potentialProviders.id, providerId)).limit(1);
          if (provider.length === 0) {
            throw new Error("Potential provider not found");
          }
          const providerRow = provider[0];
          const sentAt = /* @__PURE__ */ new Date();
          await db.insert(emails).values({
            from: "admin@servicepanda.com.au",
            // Admin sender email
            to: providerRow.email,
            subject,
            body: content,
            bodyHtml: content,
            // Assuming content is HTML
            status: "sent",
            folder: "sent",
            userType: "admin",
            userId: null,
            // Admin users are not in the users table - this prevents filtering issues
            providerId: null,
            // This is a potential provider, not a confirmed provider
            sentAt,
            createdAt: sentAt,
            updatedAt: sentAt
          });
          await db.insert(potentialProviderCommunications).values({
            potentialProviderId: providerId,
            communicationType: "email",
            direction: "outbound",
            subject,
            content,
            sentBy: "admin",
            // TODO: Get actual admin username
            status: "sent",
            sentAt,
            createdAt: sentAt
          });
          await db.update(potentialProviders).set({
            status: "email",
            lastContactDate: sentAt,
            lastContactType: "email",
            updatedAt: sentAt
          }).where(eq(potentialProviders.id, providerId));
          return { success: true, message: "Email sent successfully" };
        } catch (error) {
          console.error("Error sending email to potential provider:", error);
          throw error;
        }
      }
      async sendSmsToPotentialProvider(providerId, content) {
        try {
          const provider = await db.select({
            id: potentialProviders.id,
            firstName: potentialProviders.firstName,
            lastName: potentialProviders.lastName,
            phone: potentialProviders.phone,
            smsDeliveryStatus: potentialProviders.smsDeliveryStatus,
            firstSmsSentAt: potentialProviders.firstSmsSentAt,
            secondSmsSentAt: potentialProviders.secondSmsSentAt
          }).from(potentialProviders).where(eq(potentialProviders.id, providerId)).limit(1);
          if (provider.length === 0) {
            throw new Error("Potential provider not found");
          }
          const providerRow = provider[0];
          try {
            await smsService.sendSms(providerRow.phone, content);
          } catch (e) {
            console.warn("Non-fatal: failed to send SMS via provider flow", e);
          }
          await db.insert(potentialProviderCommunications).values({
            potentialProviderId: providerId,
            communicationType: "sms",
            direction: "outbound",
            content,
            sentBy: "admin",
            // TODO: Get actual admin username
            status: "sent",
            sentAt: /* @__PURE__ */ new Date(),
            createdAt: /* @__PURE__ */ new Date()
          });
          smsService.recordOutbound({
            recipientType: "potential_provider",
            recipientId: providerId,
            recipientPhone: providerRow.phone,
            recipientName: providerRow.firstName + " " + providerRow.lastName,
            message: content,
            smsType: "custom",
            sentBy: "admin",
            status: "sent"
          });
          const currentSmsStatus = providerRow.smsDeliveryStatus || "not_sent";
          console.log(`\u{1F4F1} Provider ${providerId} current SMS status: ${currentSmsStatus}`);
          let newSmsStatus;
          if (currentSmsStatus === "not_sent") {
            newSmsStatus = "1st_sent";
          } else if (currentSmsStatus === "1st_sent") {
            newSmsStatus = "2nd_sent";
          } else {
            newSmsStatus = "2nd_sent";
          }
          console.log(`\u{1F4F1} Updating provider ${providerId} SMS status to: ${newSmsStatus}`);
          await this.updatePotentialProviderSmsStatus(providerId, newSmsStatus);
          await db.update(potentialProviders).set({
            lastContactDate: /* @__PURE__ */ new Date(),
            lastContactType: "sms",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(potentialProviders.id, providerId));
          return { success: true, message: "SMS sent successfully" };
        } catch (error) {
          console.error("Error sending SMS to potential provider:", error);
          throw error;
        }
      }
      async convertPotentialProviderToProvider(potentialProviderId) {
        try {
          const potentialProvider = await db.select().from(potentialProviders).where(eq(potentialProviders.id, potentialProviderId)).limit(1);
          if (potentialProvider.length === 0) {
            throw new Error("Potential provider not found");
          }
          const provider = potentialProvider[0];
          const [newProvider] = await db.insert(serviceProviders).values({
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            password: "temp_password_" + Math.random().toString(36).substring(7),
            // Temporary password
            mobileNumber: provider.phone,
            address: provider.address,
            businessName: provider.businessName || null,
            businessAbn: provider.businessAbn || null,
            status: "pending",
            providerStatus: "deactivated",
            documentsUploaded: false,
            termsAccepted: false,
            creditCardAdded: false,
            freeLeadsRemaining: 3,
            creditBalance: "0.00",
            leadsPurchasedCount: 0,
            firstLeadsFreeUsed: 0,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          await db.delete(potentialProviders).where(eq(potentialProviders.id, potentialProviderId));
          await this.logProviderActivity({
            providerId: newProvider.id,
            activityType: "converted_from_potential",
            actorType: "admin",
            actorId: "admin",
            actorName: "Admin",
            description: `Converted from potential provider (ID: ${potentialProviderId})`,
            oldValue: JSON.stringify(provider),
            newValue: JSON.stringify(newProvider),
            timestamp: /* @__PURE__ */ new Date()
          });
          return {
            success: true,
            message: "Provider converted successfully",
            providerId: newProvider.id
          };
        } catch (error) {
          console.error("Error converting potential provider:", error);
          throw error;
        }
      }
      // Email Management Methods
      async getEmails(filters) {
        try {
          let query = db.select().from(emails);
          const conditions = [];
          if (filters.userId === "admin") {
            conditions.push(eq(emails.userType, "admin"));
          } else if (filters.userId && filters.userId !== "all") {
            if (filters.userId === "2") {
              conditions.push(eq(emails.userType, "admin"));
            } else {
              conditions.push(eq(emails.userId, filters.userId));
            }
          }
          if (filters.tab === "unread") {
            conditions.push(eq(emails.isRead, false));
          } else if (filters.tab === "sent") {
            conditions.push(eq(emails.folder, "sent"));
          } else if (filters.tab === "inbox") {
            conditions.push(eq(emails.folder, "inbox"));
          } else if (filters.tab === "draft") {
            conditions.push(eq(emails.folder, "draft"));
          } else if (filters.tab === "spam") {
            conditions.push(eq(emails.folder, "spam"));
          } else if (filters.tab === "trash") {
            conditions.push(eq(emails.folder, "trash"));
          } else if (filters.tab === "archive") {
            conditions.push(eq(emails.folder, "archive"));
          }
          if (filters.search) {
            conditions.push(
              or(
                like(emails.subject, `%${filters.search}%`),
                like(emails.body, `%${filters.search}%`),
                like(emails.from, `%${filters.search}%`),
                like(emails.to, `%${filters.search}%`)
              )
            );
          }
          if (filters.fromDate) {
            conditions.push(gte(emails.createdAt, new Date(filters.fromDate)));
          }
          if (filters.toDate) {
            conditions.push(lte(emails.createdAt, new Date(filters.toDate)));
          }
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
          query = query.orderBy(desc(emails.createdAt));
          const result2 = await query;
          return result2;
        } catch (error) {
          console.error("Error fetching emails:", error);
          throw error;
        }
      }
      async createEmail(emailData) {
        try {
          const [email] = await db.insert(emails).values({
            from: emailData.from || "",
            to: emailData.to || "",
            cc: emailData.cc || null,
            bcc: emailData.bcc || null,
            subject: emailData.subject || "",
            body: emailData.body || "",
            bodyHtml: emailData.bodyHtml || null,
            status: emailData.status || "inbox",
            isRead: emailData.isRead || false,
            isStarred: emailData.isStarred || false,
            hasAttachments: emailData.hasAttachments || false,
            priority: emailData.priority || "normal",
            folder: emailData.folder || "inbox",
            userId: emailData.userId || null,
            userType: emailData.userType || null,
            providerId: emailData.providerId || null,
            threadId: emailData.threadId || null,
            parentEmailId: emailData.parentEmailId || null,
            sentAt: emailData.sentAt || null,
            readAt: emailData.readAt || null,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return email;
        } catch (error) {
          console.error("Error creating email:", error);
          throw error;
        }
      }
      async getEmailByMessageId(messageId) {
        try {
          if (!messageId || !messageId.trim()) return void 0;
          const trimmedMessageId = messageId.trim();
          const [email] = await db.select().from(emails).where(
            or(
              eq(emails.threadId, trimmedMessageId),
              sql`${emails.threadId} = ${trimmedMessageId}`,
              sql`${emails.threadId} LIKE ${"%" + trimmedMessageId + "%"}`
            )
          ).limit(1);
          return email;
        } catch (error) {
          console.error("Error getting email by messageId:", error);
          return void 0;
        }
      }
      async getEmailByUniqueFields(from, to, subject, sentAt, userId) {
        try {
          const normalizedFrom = from.trim().toLowerCase();
          const normalizedTo = to.trim().toLowerCase();
          const normalizedSubject = subject.trim();
          const extractEmail = (addr) => {
            const match = addr.match(/<([^>]+)>/);
            return match ? match[1].toLowerCase().trim() : addr.toLowerCase().trim();
          };
          const fromEmail = extractEmail(normalizedFrom);
          const toEmail = extractEmail(normalizedTo);
          const sentAtStart = new Date(sentAt.getTime() - 10 * 60 * 1e3);
          const sentAtEnd = new Date(sentAt.getTime() + 10 * 60 * 1e3);
          let [email] = await db.select().from(emails).where(
            and(
              or(
                sql`LOWER(TRIM(${emails.from})) = ${normalizedFrom}`,
                sql`LOWER(TRIM(${emails.from})) LIKE ${"%" + fromEmail + "%"}`
              ),
              or(
                sql`LOWER(TRIM(${emails.to})) = ${normalizedTo}`,
                sql`LOWER(TRIM(${emails.to})) LIKE ${"%" + toEmail + "%"}`
              ),
              eq(emails.subject, normalizedSubject),
              eq(emails.userId, userId),
              gte(emails.sentAt, sentAtStart),
              lte(emails.sentAt, sentAtEnd)
            )
          ).limit(1);
          if (!email) {
            const dayStart = new Date(sentAt);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(sentAt);
            dayEnd.setHours(23, 59, 59, 999);
            [email] = await db.select().from(emails).where(
              and(
                eq(emails.subject, normalizedSubject),
                eq(emails.userId, userId),
                gte(emails.sentAt, dayStart),
                lte(emails.sentAt, dayEnd)
              )
            ).limit(1);
          }
          return email;
        } catch (error) {
          console.error("Error getting email by unique fields:", error);
          return void 0;
        }
      }
      async getEmailByContentHash(contentHash, userId) {
        try {
          return void 0;
        } catch (error) {
          console.error("Error getting email by content hash:", error);
          return void 0;
        }
      }
      async getEmailByContentSimilarity(from, to, subject, bodyStart, userId) {
        try {
          if (!bodyStart || bodyStart.length < 20) return void 0;
          const extractEmail = (addr) => {
            const match = addr.match(/<([^>]+)>/);
            return match ? match[1].toLowerCase().trim() : addr.toLowerCase().trim();
          };
          const fromEmail = extractEmail(from);
          const toEmail = extractEmail(to);
          const bodyPattern = bodyStart.substring(0, 100).trim();
          const [email] = await db.select().from(emails).where(
            and(
              eq(emails.subject, subject),
              eq(emails.userId, userId),
              sql`SUBSTRING(${emails.body}, 1, 100) = ${bodyPattern}`
            )
          ).limit(1);
          return email;
        } catch (error) {
          console.error("Error getting email by content similarity:", error);
          return void 0;
        }
      }
      async getEmailBySubjectAndUser(subject, userId) {
        try {
          const [email] = await db.select().from(emails).where(
            and(
              eq(emails.subject, subject.trim()),
              eq(emails.userId, userId)
            )
          ).orderBy(desc(emails.sentAt)).limit(1);
          return email;
        } catch (error) {
          console.error("Error getting email by subject and user:", error);
          return void 0;
        }
      }
      async updateEmailStatus(emailId, status) {
        try {
          const [email] = await db.update(emails).set({
            status,
            folder: status,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(emails.id, emailId)).returning();
          if (!email) {
            throw new Error("Email not found");
          }
          return email;
        } catch (error) {
          console.error("Error updating email status:", error);
          throw error;
        }
      }
      async bulkUpdateEmailStatus(emailIds, status) {
        try {
          if (!Array.isArray(emailIds) || emailIds.length === 0) return 0;
          const updated = await db.update(emails).set({ status, folder: status, updatedAt: /* @__PURE__ */ new Date() }).where(inArray(emails.id, emailIds)).returning({ id: emails.id });
          return updated?.length ?? 0;
        } catch (error) {
          console.error("Error bulk updating email status:", error);
          throw error;
        }
      }
      async deleteEmails(emailIds) {
        try {
          const result2 = await db.delete(emails).where(inArray(emails.id, emailIds));
          return Array.isArray(emailIds) ? emailIds.length : 0;
        } catch (error) {
          console.error("Error deleting emails:", error);
          throw error;
        }
      }
      async getEmail(emailId) {
        try {
          const [email] = await db.select().from(emails).where(eq(emails.id, emailId)).limit(1);
          return email || null;
        } catch (error) {
          console.error("Error fetching email:", error);
          throw error;
        }
      }
      async markEmailAsRead(emailId) {
        try {
          const [email] = await db.update(emails).set({
            isRead: true,
            readAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(emails.id, emailId)).returning();
          if (!email) {
            throw new Error("Email not found");
          }
          return email;
        } catch (error) {
          console.error("Error marking email as read:", error);
          throw error;
        }
      }
      async toggleEmailStar(emailId) {
        try {
          const email = await this.getEmail(emailId);
          if (!email) {
            throw new Error("Email not found");
          }
          const [updatedEmail] = await db.update(emails).set({
            isStarred: !email.isStarred,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(emails.id, emailId)).returning();
          return updatedEmail;
        } catch (error) {
          console.error("Error toggling email star:", error);
          throw error;
        }
      }
      async setEmailReadState(emailId, read) {
        try {
          const [email] = await db.update(emails).set({
            isRead: read,
            readAt: read ? /* @__PURE__ */ new Date() : null,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(emails.id, emailId)).returning();
          if (!email) {
            throw new Error("Email not found");
          }
          return email;
        } catch (error) {
          console.error("Error setting email read state:", error);
          throw error;
        }
      }
      // Execute database migration
      async executeMigration(sql3) {
        try {
          console.log("Executing migration SQL...");
          await db.execute(sql3);
          console.log("Migration executed successfully");
        } catch (error) {
          console.error("Error executing migration:", error);
          throw error;
        }
      }
      // ============================================================================
      // TEAM TASK MANAGEMENT METHODS
      // ============================================================================
      async createTeamTask(task) {
        try {
          console.log("Creating team task in database:", task);
          const [newTask] = await db.insert(teamTasks).values(task).returning();
          console.log("Team task created successfully:", newTask);
          return newTask;
        } catch (error) {
          console.error("Error creating team task:", error);
          throw error;
        }
      }
      async getTeamTasks(filters) {
        try {
          let query = db.select().from(teamTasks);
          if (filters) {
            const conditions = [];
            if (filters.status) {
              conditions.push(eq(teamTasks.status, filters.status));
            }
            if (filters.priority) {
              conditions.push(eq(teamTasks.priority, filters.priority));
            }
            if (filters.assignedTo) {
              conditions.push(eq(teamTasks.assignedTo, filters.assignedTo));
            }
            if (filters.adminId) {
              conditions.push(eq(teamTasks.adminId, filters.adminId));
            }
            if (filters.customerType) {
              switch (filters.customerType) {
                case "potential_provider":
                  conditions.push(isNotNull(teamTasks.potentialProviderId));
                  break;
                case "provider":
                  conditions.push(isNotNull(teamTasks.providerId));
                  break;
                case "customer":
                  conditions.push(isNotNull(teamTasks.customerId));
                  break;
              }
            }
            if (conditions.length > 0) {
              query = query.where(and(...conditions));
            }
          }
          return await query.orderBy(desc(teamTasks.dueDate));
        } catch (error) {
          console.error("Error fetching team tasks:", error);
          throw error;
        }
      }
      async getTeamTask(id) {
        try {
          const [task] = await db.select().from(teamTasks).where(eq(teamTasks.id, id));
          return task;
        } catch (error) {
          console.error("Error fetching team task:", error);
          throw error;
        }
      }
      async updateTeamTask(id, updates) {
        try {
          const [updatedTask] = await db.update(teamTasks).set({
            ...updates,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(teamTasks.id, id)).returning();
          if (!updatedTask) {
            throw new Error("Team task not found");
          }
          return updatedTask;
        } catch (error) {
          console.error("Error updating team task:", error);
          throw error;
        }
      }
      async deleteTeamTask(id) {
        try {
          await db.delete(teamTasks).where(eq(teamTasks.id, id));
        } catch (error) {
          console.error("Error deleting team task:", error);
          throw error;
        }
      }
      async getTeamTasksForKanban(filterBy) {
        try {
          const now = /* @__PURE__ */ new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dayAfterTomorrow = new Date(tomorrow);
          dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const dayBeforeYesterday = new Date(yesterday);
          dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);
          let whereConditions = [
            ne(teamTasks.status, "completed"),
            ne(teamTasks.status, "cancelled")
          ];
          if (filterBy) {
            if (filterBy.startsWith("assignedTo:")) {
              const assignedToUser = filterBy.replace("assignedTo:", "");
              whereConditions.push(eq(teamTasks.assignedTo, assignedToUser));
            } else {
              whereConditions.push(eq(teamTasks.adminId, filterBy));
            }
          }
          const allTasks = await db.select().from(teamTasks).where(and(...whereConditions)).orderBy(asc(teamTasks.dueDate));
          const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
          const overdue24h = allTasks.filter(
            (task) => task.createdAt < twentyFourHoursAgo
          );
          const overdue = allTasks.filter(
            (task) => task.createdAt >= twentyFourHoursAgo && task.createdAt < today
          );
          const todayTasks = allTasks.filter(
            (task) => task.createdAt >= today && task.createdAt < tomorrow
          );
          const tomorrowTasks = allTasks.filter(
            (task) => task.createdAt >= tomorrow && task.createdAt < dayAfterTomorrow
          );
          const upcoming = allTasks.filter(
            (task) => task.createdAt >= dayAfterTomorrow
          );
          return {
            overdue24h,
            overdue,
            today: todayTasks,
            tomorrow: tomorrowTasks,
            upcoming
          };
        } catch (error) {
          console.error("Error fetching team tasks for kanban:", error);
          throw error;
        }
      }
      // SMS Campaign methods
      async getSmsCampaigns() {
        try {
          const campaigns = await db.select().from(smsCampaigns).orderBy(desc(smsCampaigns.createdAt));
          return campaigns;
        } catch (error) {
          console.error("Error fetching SMS campaigns:", error);
          throw error;
        }
      }
      async createSmsCampaign(campaignData) {
        try {
          const selectedStates = Array.isArray(campaignData.selectedStates) ? campaignData.selectedStates : [];
          const selectedStatuses = Array.isArray(campaignData.selectedStatuses) ? campaignData.selectedStatuses : [];
          const selectedRegions = campaignData.selectedRegions && Array.isArray(campaignData.selectedRegions) ? campaignData.selectedRegions : null;
          let scheduledAt = null;
          if (campaignData.scheduledAt) {
            try {
              scheduledAt = new Date(campaignData.scheduledAt);
              if (isNaN(scheduledAt.getTime())) {
                console.warn("[Storage] Invalid scheduledAt date, setting to null");
                scheduledAt = null;
              }
            } catch (e) {
              console.warn("[Storage] Error parsing scheduledAt, setting to null:", e);
              scheduledAt = null;
            }
          }
          console.log("[Storage] Creating campaign with:", {
            name: campaignData.name,
            selectedStates,
            selectedStatuses,
            selectedRegions,
            voucherAmount: campaignData.voucherAmount,
            scheduledAt
          });
          const [campaign] = await db.insert(smsCampaigns).values({
            name: campaignData.name,
            message: campaignData.message,
            voucherCode: campaignData.voucherCode || null,
            voucherAmount: campaignData.voucherAmount || null,
            selectedStates,
            selectedRegions,
            selectedStatuses,
            scheduledAt,
            status: campaignData.status || "draft",
            totalSent: 0
          }).returning();
          console.log("[Storage] Campaign created successfully:", campaign.id);
          return campaign;
        } catch (error) {
          console.error("[Storage] Error creating SMS campaign:", error);
          console.error("[Storage] Error message:", error.message);
          console.error("[Storage] Error code:", error.code);
          if (error.detail) {
            console.error("[Storage] Error detail:", error.detail);
          }
          throw error;
        }
      }
      async updateSmsCampaign(campaignId, campaignData) {
        try {
          let scheduledAt = null;
          if (campaignData.scheduledAt) {
            try {
              scheduledAt = new Date(campaignData.scheduledAt);
              if (isNaN(scheduledAt.getTime())) {
                scheduledAt = null;
              }
            } catch (e) {
              scheduledAt = null;
            }
          }
          const [campaign] = await db.update(smsCampaigns).set({
            name: campaignData.name,
            message: campaignData.message,
            voucherCode: campaignData.voucherCode || null,
            voucherAmount: campaignData.voucherAmount || null,
            selectedStates: campaignData.selectedStates,
            selectedRegions: campaignData.selectedRegions || null,
            selectedStatuses: campaignData.selectedStatuses,
            scheduledAt,
            status: campaignData.status || "draft",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(smsCampaigns.id, campaignId)).returning();
          return campaign;
        } catch (error) {
          console.error("Error updating SMS campaign:", error);
          throw error;
        }
      }
      async deleteSmsCampaign(campaignId) {
        try {
          await db.delete(smsCampaigns).where(eq(smsCampaigns.id, campaignId));
        } catch (error) {
          console.error("Error deleting SMS campaign:", error);
          throw error;
        }
      }
      async sendSmsCampaign(campaignId, customerIds, adminName) {
        try {
          const [campaign] = await db.select().from(smsCampaigns).where(eq(smsCampaigns.id, campaignId));
          if (!campaign) {
            throw new Error("Campaign not found");
          }
          const customers = await db.select().from(potentialCustomers).where(inArray(potentialCustomers.id, customerIds));
          let successCount = 0;
          let failCount = 0;
          const results = [];
          console.log(`[Campaign][start] Processing ${customers.length} customers for campaign ${campaignId}`);
          for (const customer of customers) {
            try {
              console.log(`[Campaign][processing] Customer ${customer.id} - ${customer.name} (${customer.phone})`);
              let smsType;
              if (customer.smsDeliveryStatus === "not_sent" || !customer.smsDeliveryStatus) {
                smsType = "1st_sent";
              } else if (customer.smsDeliveryStatus === "1st_sent") {
                smsType = "2nd_sent";
              } else {
                console.warn(`[Campaign][skip] Customer ${customer.id} already sent 2 SMS`);
                continue;
              }
              console.log(`[Campaign][sms_type] Customer ${customer.id} will receive ${smsType}`);
              let voucherCode = "";
              let finalMessage = campaign.message;
              if (campaign.voucherAmount && campaign.voucherAmount > 0) {
                console.log(`[Campaign][voucher] Creating unique voucher for ${customer.name} - Amount: $${campaign.voucherAmount}`);
                const voucherResult = await smsService.sendSmsWithVoucher(
                  customer.phone,
                  customer.name,
                  campaign.message,
                  Number(campaign.voucherAmount),
                  {
                    customerId: customer.id,
                    adminName: adminName || "admin",
                    smsType: "campaign"
                  }
                );
                if (voucherResult.success) {
                  voucherCode = voucherResult.voucherCode || "";
                  finalMessage = voucherResult.message || finalMessage;
                  await this.updateCustomerSmsStatus(customer.id, smsType);
                  console.log(`[Campaign][storage] Attempting to store SMS message for ${customer.name}`);
                  try {
                    await smsService.recordOutbound({
                      recipientType: "potential_customer",
                      recipientId: customer.id,
                      recipientPhone: customer.phone,
                      recipientName: customer.name,
                      message: finalMessage,
                      status: "sent",
                      smsType,
                      sentBy: adminName
                    });
                    console.log(`[Campaign][SMS Storage] Successfully recorded SMS message for ${customer.name}`);
                  } catch (storageError) {
                    console.error(`[Campaign][SMS Storage] Failed to record SMS message for ${customer.name}:`, storageError);
                  }
                  successCount++;
                  results.push({
                    customerId: customer.id,
                    customerName: customer.name,
                    phone: customer.phone,
                    status: "sent",
                    smsType,
                    voucherCode
                  });
                  console.log(`[Campaign][success] SMS sent to ${customer.name} (${customer.phone}) with voucher ${voucherCode} - ${smsType}`);
                } else {
                  failCount++;
                  results.push({
                    customerId: customer.id,
                    customerName: customer.name,
                    phone: customer.phone,
                    status: "failed",
                    smsType,
                    error: voucherResult.message
                  });
                  console.log(`[Campaign][failed] SMS with voucher failed for ${customer.name}: ${voucherResult.message}`);
                }
              } else {
                finalMessage = campaign.message.replace(/\{customerName\}/g, customer.name).replace(/\{voucherCode\}/g, "").replace(/\{voucherAmount\}/g, "");
                console.log(`[Campaign][sending] Sending SMS without voucher to ${customer.name} (${customer.phone})`);
                const success = await smsService.sendSms(customer.phone, finalMessage, {
                  adminName,
                  customerId: customer.id,
                  smsType
                });
                console.log(`[Campaign][sms_result] SMS result for ${customer.name}: ${success ? "SUCCESS" : "FAILED"}`);
                if (success) {
                  await this.updateCustomerSmsStatus(customer.id, smsType);
                  try {
                    await smsService.recordOutbound({
                      recipientType: "potential_customer",
                      recipientId: customer.id,
                      recipientPhone: customer.phone,
                      recipientName: customer.name,
                      message: finalMessage,
                      status: "sent",
                      smsType,
                      sentBy: adminName
                    });
                  } catch (storageError) {
                    console.error(`[Campaign][SMS Storage] Failed to record SMS message for ${customer.name}:`, storageError);
                  }
                  successCount++;
                  results.push({
                    customerId: customer.id,
                    customerName: customer.name,
                    phone: customer.phone,
                    status: "sent",
                    smsType
                  });
                  console.log(`[Campaign][success] SMS sent to ${customer.name} (${customer.phone}) - ${smsType}`);
                } else {
                  await smsService.recordOutbound({
                    recipientType: "potential_customer",
                    recipientId: customer.id,
                    recipientPhone: customer.phone,
                    recipientName: customer.name,
                    message: finalMessage,
                    status: "failed",
                    smsType,
                    sentBy: adminName
                  });
                  console.log(`[Campaign][SMS Storage] Successfully recorded FAILED SMS message for ${customer.name}`);
                  failCount++;
                  results.push({
                    customerId: customer.id,
                    customerName: customer.name,
                    phone: customer.phone,
                    status: "failed",
                    smsType
                  });
                  console.error(`[Campaign][failed] SMS failed to ${customer.name} (${customer.phone}) - ${smsType}`);
                }
              }
            } catch (error) {
              console.error(`[Campaign][error] Error sending SMS to customer ${customer.id}:`, error);
              failCount++;
              results.push({
                customerId: customer.id,
                customerName: customer.name,
                phone: customer.phone,
                status: "error",
                error: error.message
              });
            }
          }
          const campaignStatus = failCount === 0 ? "sent" : successCount > 0 ? "sent" : "failed";
          const [updatedCampaign] = await db.update(smsCampaigns).set({
            status: campaignStatus,
            totalSent: successCount,
            sentAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(smsCampaigns.id, campaignId)).returning();
          console.log(`[Campaign][complete] Campaign ${campaignId} - Success: ${successCount}, Failed: ${failCount}`);
          return {
            campaign: updatedCampaign,
            successCount,
            failCount,
            totalCustomers: customers.length,
            results
          };
        } catch (error) {
          console.error("Error sending SMS campaign:", error);
          throw error;
        }
      }
      async updateCustomerSmsStatus(customerId, smsType) {
        try {
          const updateData = {
            smsDeliveryStatus: smsType,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (smsType === "1st_sent") {
            updateData.firstSmsSentAt = /* @__PURE__ */ new Date();
          } else if (smsType === "2nd_sent") {
            updateData.secondSmsSentAt = /* @__PURE__ */ new Date();
          }
          await db.update(potentialCustomers).set(updateData).where(eq(potentialCustomers.id, customerId));
          console.log(`[SMS Status] Updated customer ${customerId} to ${smsType}`);
        } catch (error) {
          console.error(`[SMS Status] Error updating customer ${customerId}:`, error);
          throw error;
        }
      }
      // SMS Messages methods for chat functionality
      async getSmsMessages() {
        try {
          const messages = await db.select().from(smsMessages).orderBy(desc(smsMessages.id));
          return messages;
        } catch (error) {
          console.error("Error fetching SMS messages:", error);
          throw error;
        }
      }
      async sendIndividualSms(customerId, message) {
        try {
          console.log(`[SMS Chat] Starting SMS send process for customer ${customerId}: "${message}"`);
          console.log(`[SMS Chat] Fetching customer details...`);
          const [customer] = await db.select().from(potentialCustomers).where(eq(potentialCustomers.id, customerId)).limit(1);
          if (!customer) {
            console.error(`[SMS Chat] Customer not found: ${customerId}`);
            throw new Error("Customer not found");
          }
          console.log(`[SMS Chat] Found customer: ${customer.name} (${customer.phone})`);
          console.log(`[SMS Chat] Calling SMS service...`);
          let success = false;
          try {
            success = await smsService.sendSms(customer.phone, message, {
              customerId: customer.id,
              adminName: "Admin"
            });
            console.log(`[SMS Chat] SMS service result: ${success}`);
          } catch (smsError) {
            console.error(`[SMS Chat] SMS service error:`, smsError);
            success = false;
          }
          console.log(`[SMS Chat] Storing message in database...`);
          let smsMessage;
          try {
            [smsMessage] = await db.insert(smsMessages).values({
              recipientType: "potential_customer",
              recipientId: customer.id,
              recipientPhone: customer.phone,
              recipientName: customer.name,
              message,
              direction: "outbound",
              status: success ? "sent" : "failed",
              smsType: "custom"
            }).returning();
            console.log(`[SMS Chat] Message stored successfully:`, smsMessage);
          } catch (dbError) {
            console.error(`[SMS Chat] Database error:`, dbError);
            throw new Error("Failed to store message in database");
          }
          console.log(`[SMS Chat] SMS process completed successfully`);
          return {
            success,
            message: smsMessage,
            customer: {
              id: customer.id,
              name: customer.name,
              phone: customer.phone
            }
          };
        } catch (error) {
          console.error("[SMS Chat] Fatal error in sendIndividualSms:", error);
          console.error("[SMS Chat] Error stack:", error.stack);
          throw error;
        }
      }
      async findPotentialCustomerByPhone(phone) {
        try {
          const normalizedPhone = phone.replace(/[\s\-\(\)\+]/g, "");
          console.log(`[Storage] Finding customer by phone: ${phone} (normalized: ${normalizedPhone})`);
          let [customer] = await db.select().from(potentialCustomers).where(eq(potentialCustomers.phone, phone)).limit(1);
          if (!customer) {
            const allCustomers = await db.select().from(potentialCustomers);
            customer = allCustomers.find((c) => {
              const customerNormalized = c.phone.replace(/[\s\-\(\)\+]/g, "");
              const searchDigits = normalizedPhone.replace(/^(61|0)/, "");
              const customerDigits = customerNormalized.replace(/^(61|0)/, "");
              return searchDigits === customerDigits;
            });
            if (customer) {
              console.log(`[Storage] Found customer by normalized phone: ${customer.name} (${customer.phone})`);
            }
          } else {
            console.log(`[Storage] Found customer by exact match: ${customer.name}`);
          }
          return customer || null;
        } catch (error) {
          console.error("Error finding customer by phone:", error);
          return null;
        }
      }
      async updatePotentialCustomerStatus(customerId, status) {
        try {
          await db.update(potentialCustomers).set({
            campaignStatus: status,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(potentialCustomers.id, customerId));
          console.log(`[Storage] Updated customer ${customerId} status to ${status}`);
        } catch (error) {
          console.error("Error updating customer status:", error);
          throw error;
        }
      }
      async storeIncomingSms(from, to, body, messageId, isStopRequest = false) {
        try {
          const customer = await this.findPotentialCustomerByPhone(from);
          if (!customer) {
            console.log(`[SMS Webhook] Customer not found for phone: ${from}`);
            return;
          }
          await db.insert(smsMessages).values({
            recipientType: "potential_customer",
            recipientId: customer.id,
            recipientPhone: customer.phone,
            recipientName: customer.name,
            message: body,
            direction: "inbound",
            status: "received",
            smsType: isStopRequest ? "unsubscribe" : "reply"
          });
          console.log(`[SMS Webhook] Stored incoming message from ${customer.name} (${from})` + (isStopRequest ? " - STOP request" : ""));
        } catch (error) {
          console.error("Error storing incoming SMS:", error);
          throw error;
        }
      }
      // Role and Permission Management Methods
      async getRoles() {
        try {
          const allRoles = await db.select().from(roles);
          const rolesWithPermissions = await Promise.all(
            allRoles.map(async (role) => {
              const rolePermissionsData = await db.select({ permissionId: rolePermissions.permissionId }).from(rolePermissions).where(eq(rolePermissions.roleId, role.id));
              const userCount = await db.select({ count: sql`count(*)` }).from(adminUsers).where(eq(adminUsers.role, role.name));
              return {
                ...role,
                permissions: rolePermissionsData.map((rp) => rp.permissionId),
                userCount: userCount[0]?.count || 0
              };
            })
          );
          return rolesWithPermissions;
        } catch (error) {
          console.error("Error fetching roles:", error);
          throw error;
        }
      }
      async getPermissions() {
        try {
          return await db.select().from(permissions);
        } catch (error) {
          console.error("Error fetching permissions:", error);
          throw error;
        }
      }
      async getRolePermissions(roleId) {
        try {
          const result2 = await db.select({ permissionId: rolePermissions.permissionId }).from(rolePermissions).where(eq(rolePermissions.roleId, roleId));
          return result2.map((rp) => rp.permissionId);
        } catch (error) {
          console.error("Error fetching role permissions:", error);
          throw error;
        }
      }
      async createRole({ name, description, permissions: permissions2 }) {
        try {
          const [newRole] = await db.insert(roles).values({
            name,
            description,
            isDefault: false
          }).returning();
          if (permissions2.length > 0) {
            await db.insert(rolePermissions).values(
              permissions2.map((permissionId) => ({
                roleId: newRole.id,
                permissionId
              }))
            );
          }
          return newRole;
        } catch (error) {
          console.error("Error creating role:", error);
          throw error;
        }
      }
      async updateRole(roleId, { name, description, permissions: permissions2 }) {
        try {
          const [updatedRole] = await db.update(roles).set({ name, description, updatedAt: /* @__PURE__ */ new Date() }).where(eq(roles.id, roleId)).returning();
          await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
          if (permissions2.length > 0) {
            await db.insert(rolePermissions).values(
              permissions2.map((permissionId) => ({
                roleId,
                permissionId
              }))
            );
          }
          return updatedRole;
        } catch (error) {
          console.error("Error updating role:", error);
          throw error;
        }
      }
      async deleteRole(roleId) {
        try {
          const role = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
          if (role[0]?.isDefault) {
            throw new Error("Cannot delete default role");
          }
          const usersWithRole = await db.select({ count: sql`count(*)` }).from(adminUsers).where(eq(adminUsers.role, role[0]?.name || ""));
          if (usersWithRole[0]?.count > 0) {
            throw new Error("Cannot delete role that is assigned to users");
          }
          await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
          await db.delete(roles).where(eq(roles.id, roleId));
        } catch (error) {
          console.error("Error deleting role:", error);
          throw error;
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/emailService.ts
var emailService_exports = {};
__export(emailService_exports, {
  sendCustomerFeedbackEmail: () => sendCustomerFeedbackEmail,
  sendEmail: () => sendEmail,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendProviderApplicationSubmittedEmail: () => sendProviderApplicationSubmittedEmail,
  sendProviderApprovalEmail: () => sendProviderApprovalEmail,
  sendProviderWelcomeEmail: () => sendProviderWelcomeEmail
});
async function sendEmail(options) {
  try {
    console.log("sendEmail called with options:", options);
    const mailgunKeys = await storage.getDecryptedMailgunKeys();
    if (!mailgunKeys) {
      console.error("Mailgun not configured - missing API keys");
      return false;
    }
    const { apiKey, domain, domainSendingKey } = mailgunKeys;
    console.log("Mailgun keys retrieved - domain:", domain, "apiKey present:", !!apiKey);
    const formData = new URLSearchParams();
    const fromEmail = options.fromEmail && options.fromEmail.endsWith("@servicepanda.com.au") ? options.fromEmail : "team@servicepanda.com.au";
    const fromName = options.fromName || "ServicePanda";
    formData.append("from", `${fromName} <${fromEmail}>`);
    formData.append("to", options.to);
    if (options.cc) {
      formData.append("cc", options.cc);
    }
    if (options.bcc) {
      formData.append("bcc", options.bcc);
    }
    formData.append("subject", options.subject);
    formData.append("text", options.text);
    formData.append("html", options.html);
    console.log("Form data prepared:", formData.toString());
    console.log("Making request to Mailgun API...");
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mailgun API error:", response.status, errorText);
      return false;
    }
    const result2 = await response.json();
    console.log("Email sent successfully:", result2.id);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
async function sendProviderWelcomeEmail(email, firstName) {
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "https://staging.servicepanda.com.au";
  const loginUrl = `${baseUrl}/provider-login`;
  const textContent = `Welcome to ServicePanda!

Hi ${firstName},

Your provider account has been created. Visit ${loginUrl} to complete your application.

ServicePanda Team`;
  const htmlContent = `<p>Welcome to ServicePanda!</p><p>Hi ${firstName},</p><p>Your provider account has been created. <a href="${loginUrl}">Complete your application</a>.</p><p>ServicePanda Team</p>`;
  return await sendEmail({
    to: email,
    subject: "Welcome to ServicePanda",
    text: textContent,
    html: htmlContent
  });
}
async function sendProviderApplicationSubmittedEmail(email, firstName) {
  const textContent = `
    Application Submitted Successfully!

    Hi ${firstName},

    Thank you for completing and submitting your ServicePanda application!

    What happens next:
    - Our team will review your application within the next 24 hours
    - We'll verify your documents and service area details
    - Once approved, you'll receive a confirmation email
    - You'll then be able to access your first 3 leads for FREE!

    We appreciate your patience during the review process. We'll be in touch soon with an update on your application status.

    Thank you for choosing ServicePanda!
    ServicePanda Team
  `;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Application Submitted - ServicePanda</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .container {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .status-badge {
          background-color: #3b82f6;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          display: inline-block;
          margin-bottom: 20px;
        }
        .review-process {
          background-color: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .timeline {
          margin: 20px 0;
        }
        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8fafc;
          border-radius: 6px;
        }
        .timeline-icon {
          width: 24px;
          height: 24px;
          background-color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 12px;
          color: white;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">\u{1F43C} ServicePanda</div>
          <p style="margin: 0; color: #6b7280;">Australian Service Marketplace</p>
          <div class="status-badge">Application Submitted</div>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 10px;">Hi ${firstName}!</h2>
        
        <p>Thank you for completing and submitting your ServicePanda application!</p>
        
        <div class="review-process">
          <h3 style="margin-top: 0; color: #1f2937;">\u23F1\uFE0F Review Process (24 Hours)</h3>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-icon">\u2713</div>
              <div>
                <strong>Application Received</strong><br>
                <small>Your application is now in our review queue</small>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">\u{1F50D}</div>
              <div>
                <strong>Document Verification</strong><br>
                <small>We'll verify your license, insurance, and police check</small>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">\u{1F4CD}</div>
              <div>
                <strong>Service Area Review</strong><br>
                <small>Confirming your coverage areas and service categories</small>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">\u{1F389}</div>
              <div>
                <strong>Approval Notification</strong><br>
                <small>You'll receive confirmation and can start earning immediately!</small>
              </div>
            </div>
          </div>
        </div>
        
        <p style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; border-radius: 4px;">
          <strong>\u{1F381} Get Ready:</strong> Once approved, you'll receive your first 3 leads absolutely FREE to help you get started!
        </p>
        
        <p>We appreciate your patience during the review process. We'll be in touch soon with an update on your application status.</p>
        
        <div class="footer">
          <p>Thank you for choosing ServicePanda!<br><strong>ServicePanda Team</strong></p>
          <p style="margin-top: 20px;">
            Questions about your application? Contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail({
    to: email,
    subject: "\u2705 Application Submitted - Under Review (24hrs) - ServicePanda",
    text: textContent.trim(),
    html: htmlContent
  });
}
async function sendProviderApprovalEmail(email, firstName) {
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "https://staging.servicepanda.com.au";
  const dashboardUrl = `${baseUrl}/provider-dashboard`;
  const textContent = `
    Congratulations! You're All Set!

    Hi ${firstName},

    GREAT NEWS! Your ServicePanda application has been approved!

    You're now an official ServicePanda partner and ready to start earning. Here's what you can do right now:

    \u2705 Access Your Dashboard: ${dashboardUrl}
    \u2705 Your First 3 Leads are FREE
    \u2705 Start Receiving Customer Requests
    \u2705 Manage Your Services and Areas
    \u2705 Track Your Earnings

    Next Steps:
    1. Log into your provider dashboard
    2. Review your profile and make any updates
    3. Start browsing available leads in your area
    4. Purchase leads that match your services
    5. Contact customers and grow your business!

    Remember: Your first 3 leads are completely FREE to help you get started.

    Welcome to the ServicePanda family! We're excited to help you grow your business.

    ServicePanda Team
  `;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Approved! Welcome to ServicePanda</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .container {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .approval-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .benefits {
          background-color: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 25px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .benefit-item:before {
          content: "\u2705";
          margin-right: 10px;
          font-size: 14px;
        }
        .next-steps {
          background-color: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .step {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        .step:before {
          content: counter(step-counter);
          counter-increment: step-counter;
          position: absolute;
          left: 0;
          top: 2px;
          background-color: #3b82f6;
          color: white;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .next-steps {
          counter-reset: step-counter;
        }
        .dashboard-button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .free-leads {
          background-color: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">\u{1F43C} ServicePanda</div>
          <p style="margin: 0; color: #6b7280;">Australian Service Marketplace</p>
          <div class="approval-badge">\u{1F389} APPROVED! You're All Set!</div>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 10px;">Congratulations ${firstName}!</h2>
        
        <p><strong>GREAT NEWS!</strong> Your ServicePanda application has been approved!</p>
        
        <p>You're now an official ServicePanda partner and ready to start earning.</p>
        
        <div class="benefits">
          <h3 style="margin-top: 0; color: #1f2937;">What You Can Do Right Now:</h3>
          <div class="benefit-item">Access Your Professional Dashboard</div>
          <div class="benefit-item">Your First 3 Leads are FREE</div>
          <div class="benefit-item">Start Receiving Customer Requests</div>
          <div class="benefit-item">Manage Your Services and Coverage Areas</div>
          <div class="benefit-item">Track Your Earnings and Performance</div>
        </div>

        <div style="text-align: center;">
          <a href="${dashboardUrl}" class="dashboard-button">Access Your Dashboard Now</a>
        </div>
        
        <div class="next-steps">
          <h3 style="margin-top: 0; color: #1f2937;">Your Next Steps:</h3>
          <div class="step">Log into your provider dashboard</div>
          <div class="step">Review your profile and make any updates needed</div>
          <div class="step">Start browsing available leads in your area</div>
          <div class="step">Purchase leads that match your services</div>
          <div class="step">Contact customers and grow your business!</div>
        </div>
        
        <div class="free-leads">
          <h3 style="margin-top: 0; color: #92400e;">\u{1F381} Special Welcome Offer</h3>
          <p style="margin-bottom: 0; font-weight: 500;">Your first 3 leads are completely FREE to help you get started!</p>
        </div>
        
        <p>Welcome to the ServicePanda family! We're excited to help you grow your business and connect with customers across Australia.</p>
        
        <div class="footer">
          <p>Ready to start earning?<br><strong>ServicePanda Team</strong></p>
          <p style="margin-top: 20px;">
            Need help getting started? Contact our support team anytime.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail({
    to: email,
    subject: "\u{1F389} Congratulations! Your ServicePanda Application is Approved",
    text: textContent.trim(),
    html: htmlContent
  });
}
async function sendPasswordResetEmail(email, resetToken) {
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "https://staging.servicepanda.com.au";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const textContent = `
    Password Reset Request

    You have requested a password reset for your ServicePanda account.

    Click the following link to reset your password:
    ${resetUrl}

    This link will expire in 1 hour for security reasons.

    If you didn't request this password reset, please ignore this email.

    Best regards,
    ServicePanda Team
  `;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Password Reset - ServicePanda</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .container {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .reset-button {
          display: inline-block;
          padding: 14px 28px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
          text-align: center;
        }
        .reset-button:hover {
          background-color: #2563eb;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">\u{1F43C} ServicePanda</div>
          <p style="margin: 0; color: #6b7280;">Australian Service Marketplace</p>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
        
        <p>You have requested a password reset for your ServicePanda account.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="reset-button">Reset My Password</a>
        </div>
        
        <div class="warning">
          <strong>\u23F0 Security Notice:</strong> This link will expire in 1 hour for security reasons.
        </div>
        
        <p>If you're having trouble clicking the button, copy and paste this URL into your web browser:</p>
        <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">
          ${resetUrl}
        </p>
        
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        
        <div class="footer">
          <p>Best regards,<br>ServicePanda Team</p>
          <p style="margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail({
    to: email,
    subject: "Password Reset - ServicePanda",
    text: textContent.trim(),
    html: htmlContent
  });
}
async function sendCustomerFeedbackEmail(customerEmail, customerName, providerName, serviceType, suburb, reviewToken) {
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "https://staging.servicepanda.com.au";
  const reviewUrl = `${baseUrl}/review-submission?token=${reviewToken}`;
  const textContent = `How was your service?

Hi ${customerName},

Please share feedback for ${providerName} (${serviceType}) in ${suburb}.
${reviewUrl}

Thank you,
ServicePanda Team`;
  const htmlContent = `<p><strong>How was your service?</strong></p><p>Hi ${customerName},</p><p>Please share feedback for <strong>${providerName}</strong> (${serviceType}) in ${suburb}.</p><p><a href="${reviewUrl}">Share your experience</a></p><p>Thank you,<br/>ServicePanda Team</p>`;
  return await sendEmail({
    to: customerEmail,
    subject: `How was your ${serviceType} service? - ServicePanda`,
    text: textContent,
    html: htmlContent
  });
}
var init_emailService = __esm({
  "server/emailService.ts"() {
    "use strict";
    init_storage();
  }
});

// server/imapService.ts
var imapService_exports = {};
__export(imapService_exports, {
  fetchAndStoreEmails: () => fetchAndStoreEmails,
  fetchEmailsFromImap: () => fetchEmailsFromImap
});
import Imap from "imap";
import { simpleParser } from "mailparser";
import { createHash } from "crypto";
function calculateStringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1;
  let matches = 0;
  const minLength = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLength; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  return matches / longer.length;
}
async function fetchEmailsFromImap(options) {
  const {
    email,
    password,
    markSeen = true,
    fetchAll = true,
    folder = "INBOX"
  } = options;
  return new Promise((resolve, reject) => {
    const config = {
      user: email,
      password,
      host: "mail.servicepanda.com.au",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
        // Allow self-signed certificates
      }
    };
    const imap = new Imap(config);
    const fetchedEmails = [];
    imap.once("ready", () => {
      console.log(`IMAP connection ready for ${email}`);
      imap.openBox(folder, false, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }
        console.log(`Opened ${folder} box. Total messages: ${box.messages.total}`);
        const searchCriteria = fetchAll ? ["ALL"] : ["UNSEEN"];
        imap.search(searchCriteria, (err2, results) => {
          if (err2) {
            imap.end();
            return reject(err2);
          }
          if (!results || results.length === 0) {
            console.log(`No emails found for ${email}`);
            imap.end();
            return resolve([]);
          }
          console.log(`Found ${results.length} emails to fetch`);
          const fetch2 = imap.fetch(results, {
            bodies: "",
            struct: true
          });
          fetch2.on("message", (msg, seqno) => {
            console.log(`Fetching message ${seqno}...`);
            msg.on("body", (stream, info) => {
              let buffer = "";
              stream.on("data", (chunk) => {
                buffer += chunk.toString("utf8");
              });
              stream.once("end", () => {
                simpleParser(buffer, (err3, parsed) => {
                  if (err3) {
                    console.error(`Error parsing email ${seqno}:`, err3);
                    return;
                  }
                  const getEmailAddress = (addr) => {
                    if (!addr) return "";
                    if (typeof addr === "string") return addr;
                    if (Array.isArray(addr)) {
                      return addr.map((a) => a.address || a.text || "").filter(Boolean).join(", ");
                    }
                    return addr.address || addr.text || "";
                  };
                  const emailData = {
                    from: getEmailAddress(parsed.from) || "",
                    to: getEmailAddress(parsed.to) || "",
                    cc: parsed.cc ? getEmailAddress(parsed.cc) : null,
                    bcc: parsed.bcc ? getEmailAddress(parsed.bcc) : null,
                    subject: parsed.subject || "",
                    body: parsed.text || "",
                    bodyHtml: parsed.html || null,
                    date: parsed.date || /* @__PURE__ */ new Date(),
                    messageId: parsed.messageId || null,
                    inReplyTo: parsed.inReplyTo || null,
                    references: Array.isArray(parsed.references) ? parsed.references.join(" ") : parsed.references || null,
                    attachments: parsed.attachments?.map((att) => ({
                      filename: att.filename,
                      contentType: att.contentType,
                      size: att.size
                    })) || []
                  };
                  fetchedEmails.push(emailData);
                  console.log(`Parsed email ${seqno}: ${emailData.subject}`);
                });
              });
            });
            msg.once("attributes", (attrs) => {
              if (markSeen && attrs.uid) {
                imap.addFlags(attrs.uid, "\\Seen", (err3) => {
                  if (err3) {
                    console.error(`Error marking email ${attrs.uid} as seen:`, err3);
                  }
                });
              }
            });
          });
          fetch2.once("error", (err3) => {
            console.error("Fetch error:", err3);
            imap.end();
            reject(err3);
          });
          fetch2.once("end", () => {
            console.log(`Finished fetching ${fetchedEmails.length} emails`);
            imap.end();
            resolve(fetchedEmails);
          });
        });
      });
    });
    imap.once("error", (err) => {
      console.error("IMAP error:", err);
      reject(err);
    });
    imap.once("end", () => {
      console.log("IMAP connection ended");
    });
    imap.connect();
  });
}
async function fetchAndStoreEmails(email, password, userId, fetchAll = true) {
  const lockKey = `${email}-${userId}`;
  if (fetchLocks.get(lockKey)) {
    console.log(`\u26A0\uFE0F Fetch already in progress for ${email}, skipping...`);
    return {
      success: false,
      count: 0,
      error: "A fetch operation is already in progress for this email account. Please wait."
    };
  }
  fetchLocks.set(lockKey, true);
  console.log(`\u{1F512} Acquired fetch lock for ${email}`);
  try {
    console.log(`Fetching emails from IMAP for ${email}...`);
    const fetchedEmails = await fetchEmailsFromImap({
      email,
      password,
      markSeen: true,
      fetchAll,
      folder: "INBOX"
    });
    console.log(`Fetched ${fetchedEmails.length} emails from ${email}`);
    let storedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    for (const emailData of fetchedEmails) {
      try {
        let existingEmail = null;
        const normalizedFrom = emailData.from.trim().toLowerCase();
        const normalizedTo = emailData.to.trim().toLowerCase();
        const normalizedSubject = emailData.subject.trim();
        const contentHash = createHash("md5").update(`${normalizedFrom}|${normalizedTo}|${normalizedSubject}|${emailData.body.substring(0, 100)}|${userId}`).digest("hex");
        if (emailData.messageId && emailData.messageId.trim()) {
          existingEmail = await storage.getEmailByMessageId(emailData.messageId.trim());
          if (existingEmail) {
            skippedCount++;
            console.log(`\u2298 Skipped duplicate (by messageId): ${normalizedSubject.substring(0, 50)}`);
            continue;
          }
        }
        existingEmail = await storage.getEmailByUniqueFields(
          normalizedFrom,
          normalizedTo,
          normalizedSubject,
          emailData.date,
          userId
        );
        if (existingEmail) {
          skippedCount++;
          console.log(`\u2298 Skipped duplicate (by unique fields): ${normalizedSubject.substring(0, 50)}`);
          continue;
        }
        const existingBySubject = await storage.getEmailBySubjectAndUser(normalizedSubject, userId);
        if (existingBySubject) {
          const existingBodyStart = existingBySubject.body?.substring(0, 100).trim() || "";
          const currentBodyStart = emailData.body.substring(0, 100).trim();
          if (existingBodyStart.length >= 20 && currentBodyStart.length >= 20) {
            const similarity = calculateStringSimilarity(existingBodyStart, currentBodyStart);
            if (similarity > 0.8) {
              skippedCount++;
              console.log(`\u2298 Skipped duplicate (by subject + body similarity ${Math.round(similarity * 100)}%): ${normalizedSubject.substring(0, 50)}`);
              continue;
            }
          }
        }
        const bodyStart = emailData.body.substring(0, 100).trim();
        if (bodyStart.length >= 20) {
          existingEmail = await storage.getEmailByContentSimilarity(
            normalizedFrom,
            normalizedTo,
            normalizedSubject,
            bodyStart,
            userId
          );
          if (existingEmail) {
            skippedCount++;
            console.log(`\u2298 Skipped duplicate (by content similarity): ${normalizedSubject.substring(0, 50)}`);
            continue;
          }
        }
        if (emailData.messageId && emailData.messageId.trim()) {
          const finalCheck = await storage.getEmailByMessageId(emailData.messageId.trim());
          if (finalCheck) {
            skippedCount++;
            console.log(`\u2298 Skipped duplicate (final messageId check): ${normalizedSubject.substring(0, 50)}`);
            continue;
          }
        }
        const finalUniqueCheck = await storage.getEmailByUniqueFields(
          normalizedFrom,
          normalizedTo,
          normalizedSubject,
          emailData.date,
          userId
        );
        if (finalUniqueCheck) {
          skippedCount++;
          console.log(`\u2298 Skipped duplicate (final unique fields check): ${normalizedSubject.substring(0, 50)}`);
          continue;
        }
        try {
          await storage.createEmail({
            from: emailData.from.trim(),
            to: emailData.to.trim(),
            cc: emailData.cc?.trim() || null,
            bcc: emailData.bcc?.trim() || null,
            subject: emailData.subject.trim(),
            body: emailData.body,
            bodyHtml: emailData.bodyHtml,
            status: "inbox",
            folder: "inbox",
            isRead: true,
            // Already marked as seen
            userId,
            userType: "admin",
            sentAt: emailData.date,
            threadId: emailData.messageId || emailData.inReplyTo || null
          });
          storedCount++;
          console.log(`\u2713 Stored new email: ${normalizedSubject.substring(0, 50)} [hash: ${contentHash.substring(0, 8)}]`);
        } catch (insertError) {
          if (insertError?.message?.includes("duplicate") || insertError?.code === "23505") {
            skippedCount++;
            console.log(`\u2298 Skipped duplicate (caught during insert): ${normalizedSubject.substring(0, 50)}`);
          } else {
            throw insertError;
          }
        }
      } catch (error) {
        errorCount++;
        console.error(`\u2717 Error storing email:`, error?.message || error);
      }
    }
    console.log(`
\u{1F4E7} Email storage summary for ${email}:`);
    console.log(`   \u2713 New emails stored: ${storedCount}`);
    console.log(`   \u2298 Duplicates skipped: ${skippedCount}`);
    console.log(`   \u2717 Errors: ${errorCount}`);
    console.log(`   Total processed: ${fetchedEmails.length}
`);
    console.log(`Stored ${storedCount} new emails from ${email}`);
    return { success: true, count: storedCount };
  } catch (error) {
    console.error(`Error fetching emails from IMAP:`, error);
    return {
      success: false,
      count: 0,
      error: error.message || "Failed to fetch emails from IMAP"
    };
  } finally {
    fetchLocks.delete(lockKey);
    console.log(`\u{1F513} Released fetch lock for ${email}`);
  }
}
var fetchLocks;
var init_imapService = __esm({
  "server/imapService.ts"() {
    "use strict";
    init_storage();
    fetchLocks = /* @__PURE__ */ new Map();
  }
});

// server/emailCronService.ts
var emailCronService_exports = {};
__export(emailCronService_exports, {
  fetchAllEmails: () => fetchAllEmails,
  initializeEmailCron: () => initializeEmailCron
});
async function fetchAllEmails() {
  const startTime = Date.now();
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  console.log(`
\u{1F4E7} [Email Cron] ========================================`);
  console.log(`\u{1F4E7} [Email Cron] Starting scheduled email fetch...`);
  console.log(`\u{1F4E7} [Email Cron] Timestamp: ${timestamp2}`);
  console.log(`\u{1F4E7} [Email Cron] Accounts to process: ${EMAIL_ACCOUNTS.filter((a) => a.enabled).length}`);
  console.log(`\u{1F4E7} [Email Cron] ========================================
`);
  const results = await Promise.allSettled(
    EMAIL_ACCOUNTS.filter((account) => account.enabled).map(async (account, index2) => {
      const accountStartTime = Date.now();
      console.log(`
\u{1F4EC} [Email Cron] [${index2 + 1}/${EMAIL_ACCOUNTS.filter((a) => a.enabled).length}] Processing: ${account.email}`);
      console.log(`\u{1F4EC} [Email Cron] \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
      try {
        let userId = "2";
        console.log(`\u{1F50D} [Email Cron] Looking up admin user for: ${account.email}...`);
        const allAdminUsers = await storage.getAllAdminUsers();
        const adminUser = allAdminUsers.find(
          (u) => u.email?.toLowerCase() === account.email.toLowerCase() || account.username && u.username?.toLowerCase() === account.username.toLowerCase()
        );
        if (adminUser) {
          userId = adminUser.id.toString();
          console.log(`\u2705 [Email Cron] Found admin user: ID=${userId}, Username=${adminUser.username || "N/A"}, Email=${adminUser.email || "N/A"}`);
        } else {
          console.warn(`\u26A0\uFE0F [Email Cron] Admin user not found for ${account.email}, using default userId: ${userId}`);
        }
        console.log(`\u{1F4E5} [Email Cron] Connecting to IMAP server for ${account.email}...`);
        const result2 = await fetchAndStoreEmails(
          account.email,
          account.password,
          userId,
          true
          // fetchAll = true
        );
        const accountDuration = Date.now() - accountStartTime;
        if (result2.success) {
          console.log(`\u2705 [Email Cron] Successfully fetched ${result2.count} emails from ${account.email}`);
          console.log(`\u23F1\uFE0F  [Email Cron] Account processing time: ${accountDuration}ms`);
          console.log(`\u{1F4EC} [Email Cron] \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
          return { email: account.email, success: true, count: result2.count, duration: accountDuration };
        } else {
          console.error(`\u274C [Email Cron] Failed to fetch emails from ${account.email}: ${result2.error}`);
          console.log(`\u23F1\uFE0F  [Email Cron] Account processing time: ${accountDuration}ms`);
          console.log(`\u{1F4EC} [Email Cron] \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
          return { email: account.email, success: false, error: result2.error, duration: accountDuration };
        }
      } catch (error) {
        const accountDuration = Date.now() - accountStartTime;
        console.error(`\u274C [Email Cron] Error fetching emails from ${account.email}:`, error?.message || error);
        console.log(`\u23F1\uFE0F  [Email Cron] Account processing time: ${accountDuration}ms`);
        console.log(`\u{1F4EC} [Email Cron] \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
        return { email: account.email, success: false, error: error?.message || "Unknown error", duration: accountDuration };
      }
    })
  );
  const duration = Date.now() - startTime;
  const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.filter((r) => r.status === "rejected" || r.status === "fulfilled" && !r.value.success).length;
  let totalEmails = 0;
  let totalDuration = 0;
  results.forEach((r) => {
    if (r.status === "fulfilled") {
      if (r.value.success && r.value.count) {
        totalEmails += r.value.count;
      }
      if (r.value.duration) {
        totalDuration += r.value.duration;
      }
    }
  });
  console.log(`
\u{1F4CA} [Email Cron] ========================================`);
  console.log(`\u{1F4CA} [Email Cron] FETCH SUMMARY`);
  console.log(`\u{1F4CA} [Email Cron] ========================================`);
  console.log(`   \u2705 Successful: ${successful}/${EMAIL_ACCOUNTS.filter((a) => a.enabled).length}`);
  console.log(`   \u274C Failed: ${failed}`);
  console.log(`   \u{1F4E7} Total emails fetched: ${totalEmails}`);
  console.log(`   \u23F1\uFE0F  Total duration: ${duration}ms (${(duration / 1e3).toFixed(2)}s)`);
  console.log(`   \u23F1\uFE0F  Average per account: ${totalDuration > 0 ? Math.round(totalDuration / EMAIL_ACCOUNTS.filter((a) => a.enabled).length) : 0}ms`);
  console.log(`\u{1F4CA} [Email Cron] ========================================`);
  results.forEach((result2, index2) => {
    if (result2.status === "fulfilled") {
      const value = result2.value;
      if (value.success) {
        console.log(`   \u2705 [${index2 + 1}] ${value.email}: ${value.count || 0} emails (${value.duration || 0}ms)`);
      } else {
        console.log(`   \u274C [${index2 + 1}] ${value.email}: Failed - ${value.error || "Unknown error"} (${value.duration || 0}ms)`);
      }
    } else {
      console.log(`   \u274C [${index2 + 1}] Account ${index2 + 1}: Rejected - ${result2.reason}`);
    }
  });
  console.log(`\u{1F4E7} [Email Cron] Scheduled email fetch completed`);
  console.log(`\u{1F4E7} [Email Cron] ========================================
`);
}
function initializeEmailCron(intervalMinutes = 15) {
  const intervalMs = intervalMinutes * 60 * 1e3;
  const intervalSeconds = Math.round(intervalMs / 1e3);
  console.log(`
\u{1F550} [Email Cron] ========================================`);
  console.log(`\u{1F550} [Email Cron] Initializing email fetch cron job...`);
  console.log(`\u{1F550} [Email Cron] ========================================`);
  console.log(`   \u23F1\uFE0F  Interval: Every ${intervalSeconds} seconds (${intervalMinutes} minutes)`);
  console.log(`   \u{1F4E7} Accounts: ${EMAIL_ACCOUNTS.filter((a) => a.enabled).length} enabled`);
  EMAIL_ACCOUNTS.filter((a) => a.enabled).forEach((account, index2) => {
    console.log(`   ${index2 + 1}. ${account.email} ${account.username ? `(${account.username})` : ""}`);
  });
  console.log(`\u{1F550} [Email Cron] ========================================
`);
  console.log(`\u{1F680} [Email Cron] Running initial fetch on startup...`);
  fetchAllEmails().catch((error) => {
    console.error("\u274C [Email Cron] Error in initial email fetch:", error);
  });
  console.log(`\u23F0 [Email Cron] Scheduling periodic fetches every ${intervalSeconds} seconds...`);
  setInterval(async () => {
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    console.log(`
\u23F0 [Email Cron] ========================================`);
    console.log(`\u23F0 [Email Cron] Scheduled fetch triggered at ${timestamp2}`);
    console.log(`\u23F0 [Email Cron] ========================================`);
    try {
      await fetchAllEmails();
    } catch (error) {
      console.error("\u274C [Email Cron] Error in scheduled email fetch:", error);
    }
  }, intervalMs);
  console.log(`\u2705 [Email Cron] Email cron job initialized and running
`);
}
var EMAIL_ACCOUNTS;
var init_emailCronService = __esm({
  "server/emailCronService.ts"() {
    "use strict";
    init_imapService();
    init_storage();
    EMAIL_ACCOUNTS = [
      {
        email: "rohan@servicepanda.com.au",
        password: "v*Ev1}IjAKVM",
        username: "Rohan Kanaujia",
        // Admin username - will be used to find user ID
        enabled: true
      },
      {
        email: "shubham@servicepanda.com.au",
        password: "v*Ev1}IjAKVM",
        username: "Shubham Chauhan",
        // Admin username - will be used to find user ID
        enabled: true
      }
    ];
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
init_storage();
import express from "express";
import { createServer } from "http";

// server/auth.ts
init_storage();
init_emailService();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  if (stored.startsWith("$2")) {
    const bcrypt3 = await import("bcrypt");
    return await bcrypt3.compare(supplied, stored);
  }
  if (stored.includes(".")) {
    try {
      const [hashed, salt] = stored.split(".");
      if (!hashed || !salt) {
        return false;
      }
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = await scryptAsync(supplied, salt, 64);
      if (hashedBuf.length !== suppliedBuf.length) {
        return false;
      }
      return timingSafeEqual(hashedBuf, suppliedBuf);
    } catch (error) {
      console.error("Error comparing scrypt password:", error);
      return false;
    }
  }
  return false;
}
function setupAuth(app2) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  let sessionStore;
  try {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions"
    });
    console.log("\u2705 Using PostgreSQL session store");
  } catch (error) {
    console.warn("\u26A0\uFE0F  PostgreSQL session store failed, using memory store for development");
    console.warn("   Database connection error:", error.message);
    sessionStore = new session.MemoryStore();
  }
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "servicepanda-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          console.log("Passport strategy - checking user:", email);
          const user = await storage.getUserByEmail(email);
          console.log("User found:", !!user);
          if (!user) {
            console.log("No user found with email:", email);
            return done(null, false, { message: "Invalid email or password" });
          }
          if (!user.password) {
            console.log("User has no password");
            return done(null, false, { message: "Invalid email or password" });
          }
          console.log("Comparing passwords...");
          const passwordMatch = await comparePasswords(password, user.password);
          console.log("Password match:", passwordMatch);
          if (!passwordMatch) {
            console.log("Password does not match");
            return done(null, false, { message: "Invalid email or password" });
          }
          await storage.updateUserLastLogin(user.id);
          console.log("User authenticated successfully in passport strategy:", user.id);
          return done(null, user);
        } catch (error) {
          console.log("Passport strategy error:", error);
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration attempt:", req.body);
      const { email, password, firstName, lastName, phoneNumber } = req.body;
      if (!email || !password || !firstName || !lastName || !phoneNumber) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
      }
      console.log("Hashing password...");
      const hashedPassword = await hashPassword(password);
      console.log("Password hashed successfully");
      console.log("Checking for existing user...");
      const existingUser = await storage.getUserByEmail(email);
      let user;
      if (existingUser) {
        console.log("Updating existing user...");
        user = await storage.updateUser(existingUser.id, {
          firstName,
          lastName,
          phoneNumber,
          password: hashedPassword
        });
        console.log("User updated:", user.id);
      } else {
        console.log("Creating new user...");
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("Generated user ID:", userId);
        const userData = {
          id: userId,
          email,
          firstName,
          lastName,
          phoneNumber,
          password: hashedPassword
        };
        console.log("User data to insert:", userData);
        user = await storage.upsertUser(userData);
        console.log("User created:", user.id);
      }
      req.login(user, async (err) => {
        if (err) {
          console.log("Login error during registration:", err);
          return next(err);
        }
        await storage.updateUserLastLogin(user.id);
        console.log("Registration successful for user:", user.id);
        res.status(201).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    console.log("Login attempt:", { email: req.body.email });
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log("Login authentication error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      if (!user) {
        console.log("Login failed - no user found or invalid credentials");
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      console.log("User authenticated successfully:", user.id);
      req.login(user, (err2) => {
        if (err2) {
          console.log("Login session error:", err2);
          return res.status(500).json({ message: "Login failed" });
        }
        console.log("Login successful for user:", user.id);
        res.status(200).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        });
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl
    });
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ message: "If an account with that email exists, you will receive a password reset link." });
      }
      const resetToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 36e5);
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt
      });
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      if (!emailSent) {
        console.error(`Failed to send password reset email to ${email}`);
      } else {
        console.log(`Password reset email sent successfully to ${email}`);
      }
      res.json({ message: "If an account with that email exists, you will receive a password reset link." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      if (/* @__PURE__ */ new Date() > resetToken.expiresAt) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      if (resetToken.usedAt) {
        return res.status(400).json({ message: "Reset token has already been used" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      await storage.markTokenAsUsed(token);
      res.json({ message: "Password has been successfully reset" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
}
function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// server/providerAuth.ts
init_storage();
init_emailService();
import bcrypt from "bcrypt";
import { randomBytes as randomBytes2 } from "crypto";
import path3 from "path";
async function hashPassword2(password) {
  return await bcrypt.hash(password, 10);
}
async function comparePasswords2(supplied, stored) {
  if (stored.startsWith("$2")) {
    return await bcrypt.compare(supplied, stored);
  }
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false;
    }
    const { scrypt: scrypt3 } = await import("crypto");
    const { promisify: promisify3 } = await import("util");
    const scryptAsync3 = promisify3(scrypt3);
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync3(supplied, salt, 64);
    if (hashedBuf.length !== suppliedBuf.length) {
      return false;
    }
    const { timingSafeEqual: timingSafeEqual3 } = await import("crypto");
    return timingSafeEqual3(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing scrypt password:", error);
    return false;
  }
}
function setupProviderAuth(app2) {
  app2.post("/api/provider/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, mobileNumber, address, businessName, businessAbn } = req.body;
      if (!email || !password || !firstName || !lastName || !mobileNumber || !address) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }
      const existingProvider = await storage.getServiceProviderByEmail(email);
      if (existingProvider) {
        return res.status(400).json({ message: "An account with this email already exists. Please use a different email or try logging in." });
      }
      const hashedPassword = await hashPassword2(password);
      const provider = await storage.createServiceProvider({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        mobileNumber,
        address,
        businessName: businessName || null,
        businessAbn: businessAbn || null
      });
      try {
        await sendProviderWelcomeEmail(email, firstName);
        console.log(`Welcome email sent to provider: ${email}`);
      } catch (emailError) {
        console.error(`Failed to send welcome email to ${email}:`, emailError);
      }
      res.status(201).json({
        id: provider.id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName
      });
    } catch (error) {
      console.error("Provider registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/provider/login", async (req, res) => {
    console.log("=== PROVIDER LOGIN REQUEST ===");
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("User-Agent:", req.get("User-Agent"));
    console.log("===============================");
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const provider = await storage.getServiceProviderByEmail(email);
      if (!provider || !provider.password || !await comparePasswords2(password, provider.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({
        id: provider.id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName,
        status: provider.status,
        documentsUploaded: provider.documentsUploaded,
        termsAccepted: provider.termsAccepted,
        providerStatus: provider.providerStatus
      });
    } catch (error) {
      console.error("Provider login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/provider/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
  app2.post("/api/provider/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }
      const provider = await storage.getServiceProviderByEmail(email);
      if (provider) {
        const token = randomBytes2(32).toString("hex");
        const expiresAt = /* @__PURE__ */ new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await storage.createProviderPasswordResetToken({
          providerId: provider.id,
          token,
          expiresAt
        });
        const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "https://staging.servicepanda.com.au";
        const resetUrl = `${baseUrl}/provider-reset-password?token=${token}`;
        const emailSent = await sendEmail({
          to: email,
          subject: "ServicePanda Partners - Reset Your Password",
          text: "Reset your password",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset Your Password</h2>
              <p>Hi ${provider.firstName},</p>
              <p>You requested a password reset for your ServicePanda Partners account. Click the link below to reset your password:</p>
              <p><a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <p>Thanks,<br>ServicePanda Team</p>
            </div>
          `
        });
        if (!emailSent) {
          console.error("Failed to send password reset email for provider:", email);
          return res.status(500).json({ message: "Failed to send reset email" });
        }
      }
      res.json({ message: "If an account with that email exists, we've sent a password reset link." });
    } catch (error) {
      console.error("Provider forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });
  app2.post("/api/provider/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      const resetToken = await storage.getProviderPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      if (/* @__PURE__ */ new Date() > resetToken.expiresAt) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      if (resetToken.usedAt) {
        return res.status(400).json({ message: "Reset token has already been used" });
      }
      const hashedPassword = await hashPassword2(password);
      await storage.updateProviderPassword(resetToken.providerId, hashedPassword);
      await storage.markProviderTokenAsUsed(token);
      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Provider reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
  app2.get("/api/provider/profile", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider.id;
      const provider = await storage.getServiceProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const ratingData = await storage.getProviderRating(providerId);
      const { password, ...providerProfile } = provider;
      console.log("\u{1F50D} Provider profile data:", {
        id: provider.id,
        firstName: provider.firstName,
        lastName: provider.lastName,
        firstLeadsFreeUsed: provider.firstLeadsFreeUsed,
        leadsPurchasedCount: provider.leadsPurchasedCount
      });
      res.json({
        ...providerProfile,
        rating: ratingData?.rating || "5.0",
        totalReviews: ratingData?.totalReviews || 0
      });
    } catch (error) {
      console.error("Error fetching provider profile:", error);
      res.status(500).json({ message: "Failed to fetch provider profile" });
    }
  });
  app2.put("/api/provider/:id/profile", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { firstName, lastName, mobileNumber, address, businessName, businessAbn } = req.body;
      if (providerId !== req.provider.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!firstName || !lastName || !mobileNumber || !address) {
        return res.status(400).json({ message: "Required fields: firstName, lastName, mobileNumber, address" });
      }
      const updatedProvider = await storage.updateServiceProvider(providerId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber.trim(),
        address: address.trim(),
        businessName: businessName ? businessName.trim() : null,
        businessAbn: businessAbn ? businessAbn.trim() : null
      });
      const { password, ...profileData } = updatedProvider;
      res.json(profileData);
    } catch (error) {
      console.error("Error updating provider profile:", error);
      res.status(500).json({ message: "Failed to update provider profile" });
    }
  });
  app2.get("/api/provider/services", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider.id;
      const services = await storage.getProviderServices(providerId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching provider services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  app2.get("/api/provider/:id/service-areas", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      if (providerId !== req.provider.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      const areas = await storage.getProviderServiceAreas(providerId);
      res.json(areas);
    } catch (error) {
      console.error("Error fetching provider service areas:", error);
      res.status(500).json({ message: "Failed to fetch service areas" });
    }
  });
  app2.get("/api/provider/documents/view/:filename/:providerId", async (req, res) => {
    try {
      const filename = req.params.filename;
      const providerId = parseInt(req.params.providerId);
      console.log(`Document view request: ${filename} for provider ${providerId}`);
      const provider = await storage.getServiceProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const documents = await storage.getProviderDocuments(providerId);
      console.log("Available documents:", documents.map((doc) => ({ fileName: doc.fileName, filePath: doc.filePath })));
      const document = documents.find(
        (doc) => doc.fileName === filename || doc.filePath.includes(filename) || doc.filePath.endsWith(filename)
      );
      if (!document) {
        console.log(`Document not found: ${filename} for provider ${providerId}`);
        return res.status(404).json({ message: "Document not found or access denied" });
      }
      console.log(`Serving document: ${document.fileName}, MIME: ${document.mimeType}`);
      await storage.logProviderActivity({
        providerId,
        activityType: "document_access",
        actorType: "admin",
        actorId: "admin",
        actorName: "Administrator",
        description: `Viewed document: ${document.fileName} (${document.documentType})`,
        oldValue: null,
        newValue: `${document.documentType}: ${document.fileName}`
      });
      const mimeType = document.mimeType || "application/pdf";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path3.resolve(document.filePath));
    } catch (error) {
      console.error("Error serving document:", error);
      res.status(500).json({ message: "Failed to serve document" });
    }
  });
}
async function isProviderAuthenticated(req, res, next) {
  const providerId = req.headers["x-provider-id"];
  if (!providerId) {
    return res.status(401).json({ message: "Provider authentication required. Please log in again." });
  }
  try {
    const provider = await storage.getServiceProviderById(parseInt(providerId));
    if (!provider) {
      return res.status(401).json({ message: "Invalid provider credentials" });
    }
    req.provider = provider;
    next();
  } catch (error) {
    console.error("Provider authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}

// server/adminAuth.ts
init_storage();
import { scrypt as scrypt2, randomBytes as randomBytes3, timingSafeEqual as timingSafeEqual2 } from "crypto";
import { promisify as promisify2 } from "util";
import jwt from "jsonwebtoken";
import bcrypt2 from "bcrypt";
var scryptAsync2 = promisify2(scrypt2);
var JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key";
async function hashPassword3(password) {
  const salt = randomBytes3(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords3(supplied, stored) {
  try {
    if (!stored.includes(".")) {
      return supplied === stored;
    }
    if (stored.startsWith("$2")) {
      return await bcrypt2.compare(supplied, stored);
    }
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync2(supplied, salt, 64);
    return timingSafeEqual2(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
function generateAdminToken(username, role) {
  return jwt.sign(
    { username, role, type: "admin" },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}
function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
function setupAdminAuth(app2) {
  app2.post("/api/setup/admin-user", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const existingAdmin = await storage2.getAdminUserByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin user already exists" });
      }
      const hashedPassword = await hashPassword3(password);
      const adminUser = await storage2.createAdminUser({
        username,
        password: hashedPassword,
        role: "admin",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      res.json({
        message: "Admin user created successfully",
        user: {
          username: adminUser.username,
          role: adminUser.role
        }
      });
    } catch (error) {
      console.error("Admin user setup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Admin login attempt for username:", username);
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const adminUser = await storage.getAdminUserByUsername(username);
      console.log("Admin user lookup result:", adminUser ? "Found" : "Not found");
      if (!adminUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordValid = await comparePasswords3(password, adminUser.password);
      console.log("Password validation result:", isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateAdminToken(username, adminUser.role);
      console.log("Admin login successful for:", username, "with role:", adminUser.role);
      res.json({
        message: "Login successful",
        token,
        user: {
          username,
          role: "admin"
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
}
var isAdminAuthenticated = (req, res, next) => {
  try {
    let token = req.headers["x-admin-token"];
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    console.log("Admin auth check - token:", token ? `Present (${token.substring(0, 20)}...)` : "Missing");
    if (!token) {
      console.log("Admin auth failed - no token");
      return res.status(401).json({ message: "Admin authentication required" });
    }
    const decoded = verifyAdminToken(token);
    console.log("Decoded token:", decoded);
    if (!decoded || !decoded.username || !decoded.role) {
      console.log("Admin auth failed - invalid token or missing required fields:", decoded);
      return res.status(401).json({ message: "Invalid admin token" });
    }
    req.admin = decoded;
    console.log("Admin auth successful for user:", decoded.username, "with role:", decoded.role);
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: "Admin authentication failed" });
  }
};

// server/routes.ts
init_schema();
init_db();
init_emailService();
import jwt2 from "jsonwebtoken";
import { eq as eq2, and as and2, or as or2, desc as desc2, sql as sql2 } from "drizzle-orm";
import multer from "multer";
import path4 from "path";
import fs2 from "fs";

// server/contactMail.ts
init_emailService();
async function sendContactFormEmail(formData) {
  try {
    console.log("sendContactFormEmail called with:", formData);
    const { name, email, phone, message } = formData;
    const supportEmail = "support@servicepanda.com.au";
    const subject = `New Contact Form Submission from ${name}`;
    const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

---
This message was sent from the ServicePanda contact form.
    `.trim();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Contact Form Submission</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f7f7;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
          }
          .field-label {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value {
            color: #4b5563;
            font-size: 16px;
          }
          .message-box {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            padding: 20px;
            border-radius: 6px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">\u{1F43C} ServicePanda</div>
            <p style="margin: 0; color: #6b7280;">New Contact Form Submission</p>
          </div>

          <div class="field">
            <div class="field-label">Name</div>
            <div class="field-value">${name}</div>
          </div>

          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value">
              <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
            </div>
          </div>

          <div class="field">
            <div class="field-label">Phone</div>
            <div class="field-value">
              <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
            </div>
          </div>

          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>

          <div class="footer">
            <p>This message was sent from the ServicePanda contact form.</p>
            <p>Please respond to the customer at: <a href="mailto:${email}">${email}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
    return await sendEmail({
      to: supportEmail,
      subject,
      text: textContent,
      html: htmlContent
    });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return false;
  }
}
async function sendContactConfirmationEmail(formData) {
  try {
    const { name, email, message } = formData;
    const confirmationText = `
Thank you for contacting ServicePanda!

Hi ${name},

We've received your message and our support team will get back to you within 24 hours.

Your message:
${message}

If you have any urgent inquiries, please call us at 07 5606 0808.

Best regards,
ServicePanda Support Team
    `.trim();
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Thank You for Contacting Us</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f7f7;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .success-badge {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
            margin-bottom: 20px;
          }
          .message-box {
            background-color: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">\u{1F43C} ServicePanda</div>
            <div class="success-badge">Message Received \u2713</div>
          </div>

          <h2 style="color: #1f2937;">Thank you for contacting us, ${name}!</h2>
          
          <p>We've received your message and our support team will get back to you within 24 hours.</p>
          
          <div class="message-box">
            <strong>Your message:</strong>
            <p style="margin-top: 10px;">${message.replace(/\n/g, "<br>")}</p>
          </div>

          <p>If you have any urgent inquiries, please call us at <strong>07 5606 0808</strong>.</p>
          
          <div class="footer">
            <p>Best regards,<br><strong>ServicePanda Support Team</strong></p>
            <p style="margin-top: 20px;">
              Email: <a href="mailto:support@servicepanda.com.au">support@servicepanda.com.au</a><br>
              Phone: 07 5606 0808<br>
              Working Hours: Monday-Friday 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    return await sendEmail({
      to: email,
      subject: "Thank you for contacting ServicePanda",
      text: confirmationText,
      html: confirmationHtml
    });
  } catch (error) {
    console.error("Error sending contact confirmation email:", error);
    return false;
  }
}
async function processContactForm(formData) {
  try {
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return {
        success: false,
        message: "All fields are required"
      };
    }
    if (formData.name.trim().length > 50) {
      return {
        success: false,
        message: "Name must be 50 characters or less"
      };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Invalid email format"
      };
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length > 12) {
      return {
        success: false,
        message: "Phone number must be 12 digits or less"
      };
    }
    if (formData.message.trim().length > 300) {
      return {
        success: false,
        message: "Message must be 300 characters or less"
      };
    }
    console.log("Attempting to send email to support team...");
    const emailSent = await sendContactFormEmail(formData);
    console.log("Email sent result:", emailSent);
    if (emailSent) {
      console.log("Sending confirmation email to user...");
      await sendContactConfirmationEmail(formData);
      console.log("Confirmation email sent");
      return {
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon!"
      };
    } else {
      console.warn("Mailgun not configured - contact form submission received but email not sent");
      console.log("Contact form submission:", formData);
      return {
        success: true,
        message: "Your message has been received. We'll get back to you soon!",
        note: "Email service not configured - message logged for manual review"
      };
    }
  } catch (error) {
    console.error("Error processing contact form:", error);
    console.error("Error stack:", error.stack);
    return {
      success: false,
      message: error.message || "Failed to send message. Please try again later."
    };
  }
}

// server/routes.ts
init_smsService();
init_notificationBridge();

// server/emailSignatures.ts
var emailSignatures = {
  "Rohan": {
    name: "Rohan Kannojia",
    role: "ServicePanda Support Team",
    directNumber: "0485 873 908",
    intlNumber: "+61 7 5606 0808",
    email: "rohan@servicepanda.com.au",
    website: "www.servicepanda.com.au"
  },
  "Rohan Kanaujia": {
    name: "Rohan Kannojia",
    role: "ServicePanda Support Team",
    directNumber: "0485 873 908",
    intlNumber: "+61 7 5606 0808",
    email: "rohan@servicepanda.com.au",
    website: "www.servicepanda.com.au"
  },
  "rohan@servicepanda.com.au": {
    name: "Rohan Kannojia",
    role: "ServicePanda Support Team",
    directNumber: "0485 873 908",
    intlNumber: "+61 7 5606 0808",
    email: "rohan@servicepanda.com.au",
    website: "www.servicepanda.com.au"
  },
  "Shubham": {
    name: "Shubham Chauhan",
    role: "ServicePanda Support Team",
    intlNumber: "+61 7 5606 0808",
    email: "shubham@servicepanda.com.au",
    website: "www.servicepanda.com.au"
  },
  "Shubham Chauhan": {
    name: "Shubham Chauhan",
    role: "ServicePanda Support Team",
    intlNumber: "+61 7 5606 0808",
    email: "shubham@servicepanda.com.au",
    website: "www.servicepanda.com.au"
  },
  "shubham@servicepanda.com.au": {
    name: "Shubham Chauhan",
    role: "ServicePanda Support Team",
    intlNumber: "+61 7 5606 0808",
    email: "shubham@servicepanda.com.au",
    website: "www.servicepanda.com.au"
  }
};
function getEmailSignature(identifier) {
  if (!identifier) return null;
  const signature = emailSignatures[identifier];
  if (signature) return signature;
  const lowerIdentifier = identifier.toLowerCase();
  for (const [key, sig] of Object.entries(emailSignatures)) {
    if (key.toLowerCase() === lowerIdentifier) {
      return sig;
    }
  }
  return null;
}
function formatSignatureText(signature) {
  let text2 = `${signature.name} | ${signature.role}
`;
  if (signature.directNumber) {
    text2 += `Direct Number: ${signature.directNumber} | Intl Number: ${signature.intlNumber}
`;
  } else {
    text2 += `Intl Number: ${signature.intlNumber}
`;
  }
  text2 += `Email: ${signature.email}
`;
  text2 += `Website: ${signature.website}`;
  return text2;
}
function formatSignatureHtml(signature) {
  let html = `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #4b5563; font-size: 14px; line-height: 1.6;">`;
  html += `<div style="font-weight: 500; color: #1f2937;">${signature.name} | ${signature.role}</div>`;
  if (signature.directNumber) {
    html += `<div>Direct Number: ${signature.directNumber} | Intl Number: ${signature.intlNumber}</div>`;
  } else {
    html += `<div>Intl Number: ${signature.intlNumber}</div>`;
  }
  html += `<div>Email: <a href="mailto:${signature.email}" style="color: #3b82f6; text-decoration: none;">${signature.email}</a></div>`;
  html += `<div>Website: <a href="https://${signature.website}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none;">${signature.website}</a></div>`;
  html += `</div>`;
  return html;
}
function appendSignatureToBody(body, signature, isHtml = false) {
  if (isHtml) {
    return body + "\n" + formatSignatureHtml(signature);
  } else {
    return body + "\n\n" + formatSignatureText(signature);
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  setupProviderAuth(app2);
  setupAdminAuth(app2);
  const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 },
    // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const extname = allowedTypes.test(path4.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error("Only .png, .jpg, .jpeg and .pdf files are allowed"));
      }
    }
  });
  const csvUpload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 },
    // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /csv|xlsx|xls/;
      const extname = allowedTypes.test(path4.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (mimetype || extname) {
        return cb(null, true);
      } else {
        cb(new Error("Only .csv, .xlsx and .xls files are allowed"));
      }
    }
  });
  app2.use("/uploads", express.static("uploads"));
  app2.use("/api", (req, res, next) => {
    console.log(`[API REQUEST] ${req.method} ${req.path} - ${(/* @__PURE__ */ new Date()).toISOString()}`);
    next();
  });
  app2.get("/api/service-categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });
  app2.get("/api/service-categories/trending", async (req, res) => {
    try {
      const trendingCategories = await storage.getTrendingServiceCategories();
      res.json(trendingCategories);
    } catch (error) {
      console.error("Error fetching trending service categories:", error);
      res.status(500).json({ message: "Failed to fetch trending service categories" });
    }
  });
  app2.get("/api/admin/service-categories", async (req, res) => {
    try {
      console.log("Admin service categories endpoint called");
      const adminToken = req.headers["x-admin-token"];
      console.log("Admin token provided:", !!adminToken);
      if (!adminToken) {
        console.log("No admin token provided");
        return res.status(401).json({ message: "Admin authentication required" });
      }
      console.log("Fetching all service categories...");
      const categories = await storage.getAllServiceCategories();
      console.log("Found categories:", categories.length);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching all service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });
  console.log("[ROUTE REGISTRATION] Registering POST /api/contact route...");
  app2.post("/api/contact", async (req, res) => {
    console.log("[ROUTE HIT] POST /api/contact endpoint was called!");
    try {
      console.log("=== Contact form endpoint called ===");
      console.log("Request method:", req.method);
      console.log("Request path:", req.path);
      console.log("Request body:", req.body);
      console.log("Request headers:", req.headers);
      const { name, email, phone, message } = req.body;
      if (!name || !email || !phone || !message) {
        console.log("Missing required fields");
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }
      console.log("Processing contact form...");
      const result2 = await processContactForm({ name, email, phone, message });
      console.log("Contact form result:", result2);
      if (result2.success) {
        return res.json(result2);
      } else {
        return res.status(400).json(result2);
      }
    } catch (error) {
      console.error("Error processing contact form:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to send message. Please try again later."
      });
    }
  });
  app2.get("/api/contact/test", (req, res) => {
    res.json({ message: "Contact API endpoint is accessible", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/service-providers", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const providerData = insertServiceProviderSchema.parse({
        ...req.body,
        userId
      });
      const provider = await storage.createServiceProvider(providerData);
      await storage.logUserActivity({
        userId,
        userType: "provider",
        action: "signup_started",
        details: { providerId: provider.id },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || ""
      });
      res.json(provider);
    } catch (error) {
      console.error("Error creating service provider:", error);
      res.status(500).json({ message: "Failed to create service provider" });
    }
  });
  app2.get("/api/service-providers", async (req, res) => {
    try {
      const providers = await storage.getServiceProvidersByStatus("approved");
      res.json(providers);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });
  app2.get("/api/service-providers/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const provider = await storage.getServiceProviderByEmail(req.user.email);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching service provider:", error);
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });
  app2.put("/api/service-providers/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const provider = await storage.getServiceProvider(id);
      if (!provider || provider.email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      const updatedProvider = await storage.updateServiceProvider(id, req.body);
      res.json(updatedProvider);
    } catch (error) {
      console.error("Error updating service provider:", error);
      res.status(500).json({ message: "Failed to update service provider" });
    }
  });
  app2.post("/api/service-providers/:id/services", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { categoryIds } = req.body;
      const uniqueCategoryIds = Array.from(new Set(categoryIds));
      console.log(`Replacing services for provider ${providerId}:`);
      console.log(`Original categoryIds:`, categoryIds);
      console.log(`Deduplicated categoryIds:`, uniqueCategoryIds);
      if (!Array.isArray(categoryIds) || uniqueCategoryIds.length === 0) {
        return res.status(400).json({ message: "Category IDs are required" });
      }
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const currentServices = await storage.getProviderServices(providerId);
      const currentServiceNames = currentServices.map((s) => s.name).sort().join(", ");
      const allCategories = await storage.getServiceCategories();
      const newServiceNames = allCategories.filter((cat) => uniqueCategoryIds.includes(cat.id)).map((cat) => cat.name).sort().join(", ");
      await storage.replaceProviderServices(providerId, uniqueCategoryIds);
      if (currentServiceNames !== newServiceNames) {
        await storage.logProviderActivity({
          providerId,
          activityType: "services_update",
          actorType: "provider",
          actorId: providerId.toString(),
          actorName: `${provider.firstName} ${provider.lastName}`,
          description: "Service categories updated",
          oldValue: currentServiceNames || "No services selected",
          newValue: newServiceNames
        });
      }
      res.json({ message: "Services updated successfully" });
    } catch (error) {
      console.error("Error updating provider services:", error);
      res.status(500).json({ message: "Failed to update provider services" });
    }
  });
  app2.get("/api/australian-states", async (req, res) => {
    try {
      const states = await storage.getAustralianStates();
      res.json(states);
    } catch (error) {
      console.error("Error fetching Australian states:", error);
      res.status(500).json({ message: "Failed to fetch Australian states" });
    }
  });
  app2.get("/api/suburbs/:postcode", async (req, res) => {
    try {
      const { postcode } = req.params;
      const suburbs = await storage.getSuburbsByPostcode(postcode);
      res.json(suburbs);
    } catch (error) {
      console.error("Error fetching suburbs:", error);
      res.status(500).json({ message: "Failed to fetch suburbs" });
    }
  });
  app2.get("/api/config/google-maps", (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY || "" });
  });
  app2.post("/api/provider/:id/location-service-areas", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { centerAddress, centerLat, centerLng, radiusKm, areaName } = req.body;
      console.log("Adding location-based service area for provider:", providerId, "address:", centerAddress, "radius:", radiusKm);
      const serviceArea = await storage.addProviderLocationServiceArea({
        providerId,
        centerAddress,
        centerLat,
        centerLng,
        radiusKm,
        areaName
      });
      await storage.calculateServiceAreaCoverage(serviceArea.id);
      res.status(201).json(serviceArea);
    } catch (error) {
      console.error("Error adding location-based service area:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/provider/:id/location-service-areas", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const serviceAreas = await storage.getProviderLocationServiceAreas(providerId);
      res.json(serviceAreas);
    } catch (error) {
      console.error("Error fetching location-based service areas:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/provider/:id/location-service-areas/:areaId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const areaId = parseInt(req.params.areaId);
      await storage.deleteProviderLocationServiceArea(providerId, areaId);
      res.json({ message: "Service area deleted successfully" });
    } catch (error) {
      console.error("Error deleting location-based service area:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/service-providers/:id/service-areas", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const userId = req.user.id;
      const { suburbIds } = req.body;
      const provider = await storage.getServiceProvider(providerId);
      if (!provider || provider.email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      for (const suburbId of suburbIds) {
        await storage.addProviderServiceArea({
          providerId,
          centerAddress: "Legacy suburb-based area",
          // Temporary workaround
          radiusKm: 10
          // Default radius for legacy areas
        });
      }
      res.json({ message: "Service areas added successfully" });
    } catch (error) {
      console.error("Error adding provider service areas:", error);
      res.status(500).json({ message: "Failed to add provider service areas" });
    }
  });
  app2.post("/api/provider/:id/registration-documents", upload.fields([
    { name: "license", maxCount: 1 },
    { name: "policeCheck", maxCount: 1 },
    { name: "insuranceCertificate", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const files = req.files;
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const uploadedDocs = [];
      if (files.license && files.license[0]) {
        const file = files.license[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: "license",
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        uploadedDocs.push(doc);
      }
      if (files.policeCheck && files.policeCheck[0]) {
        const file = files.policeCheck[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: "police_check",
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        uploadedDocs.push(doc);
      }
      if (files.insuranceCertificate && files.insuranceCertificate[0]) {
        const file = files.insuranceCertificate[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: "insurance",
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        uploadedDocs.push(doc);
      }
      await storage.updateServiceProvider(providerId, { documentsUploaded: true });
      try {
        await sendProviderApplicationSubmittedEmail(provider.email, provider.firstName);
        console.log(`Application submitted email sent to provider: ${provider.email}`);
      } catch (emailError) {
        console.error(`Failed to send application submitted email to ${provider.email}:`, emailError);
      }
      res.json({
        message: "Documents uploaded successfully",
        documents: uploadedDocs
      });
    } catch (error) {
      console.error("Error uploading registration documents:", error);
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });
  app2.post(
    "/api/service-providers/:id/documents",
    /* isProviderAuthenticated, */
    upload.fields([
      { name: "license", maxCount: 1 },
      { name: "policeCheck", maxCount: 1 },
      { name: "insuranceCertificate", maxCount: 1 }
    ]),
    async (req, res) => {
      try {
        const providerId = parseInt(req.params.id);
        const files = req.files;
        const provider = await storage.getServiceProvider(providerId);
        if (!provider) {
          return res.status(404).json({ message: "Provider not found" });
        }
        const uploadedDocs = [];
        if (files.license && files.license[0]) {
          const file = files.license[0];
          const doc = await storage.uploadProviderDocument({
            providerId,
            documentType: "license",
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype
          });
          uploadedDocs.push(doc);
        }
        if (files.policeCheck && files.policeCheck[0]) {
          const file = files.policeCheck[0];
          const doc = await storage.uploadProviderDocument({
            providerId,
            documentType: "police_check",
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype
          });
          uploadedDocs.push(doc);
        }
        if (files.insuranceCertificate && files.insuranceCertificate[0]) {
          const file = files.insuranceCertificate[0];
          const doc = await storage.uploadProviderDocument({
            providerId,
            documentType: "insurance",
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype
          });
          uploadedDocs.push(doc);
        }
        await storage.updateServiceProvider(providerId, { documentsUploaded: true });
        try {
          await sendProviderApplicationSubmittedEmail(provider.email, provider.firstName);
          console.log(`Application submitted email sent to provider: ${provider.email}`);
        } catch (emailError) {
          console.error(`Failed to send application submitted email to ${provider.email}:`, emailError);
        }
        res.json({
          message: "Documents uploaded successfully",
          documents: uploadedDocs
        });
      } catch (error) {
        console.error("Error uploading documents:", error);
        res.status(500).json({ message: "Failed to upload documents" });
      }
    }
  );
  app2.post("/api/provider/:id/registration-documents", upload.fields([
    { name: "license", maxCount: 1 },
    { name: "policeCheck", maxCount: 1 },
    { name: "insuranceCertificate", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const files = req.files;
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const uploadedDocs = [];
      if (files.license && files.license[0]) {
        const file = files.license[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: "license",
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        uploadedDocs.push(doc);
      }
      if (files.policeCheck && files.policeCheck[0]) {
        const file = files.policeCheck[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: "police_check",
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        uploadedDocs.push(doc);
      }
      if (files.insuranceCertificate && files.insuranceCertificate[0]) {
        const file = files.insuranceCertificate[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: "insurance",
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        uploadedDocs.push(doc);
      }
      await storage.updateServiceProvider(providerId, { documentsUploaded: true });
      try {
        await sendProviderApplicationSubmittedEmail(provider.email, provider.firstName);
        console.log(`Application submitted email sent to provider: ${provider.email}`);
      } catch (emailError) {
        console.error(`Failed to send application submitted email to ${provider.email}:`, emailError);
      }
      res.json({
        message: "Registration documents uploaded successfully",
        documents: uploadedDocs
      });
    } catch (error) {
      console.error("Error uploading registration documents:", error);
      res.status(500).json({ message: "Failed to upload registration documents" });
    }
  });
  app2.get("/api/service-providers/:id/documents", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const documents = await storage.getProviderDocuments(providerId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching provider documents:", error);
      res.status(500).json({ message: "Failed to fetch provider documents" });
    }
  });
  app2.get("/api/address/autocomplete", async (req, res) => {
    try {
      const { input, types = "address", components = "country:AU" } = req.query;
      if (!input || typeof input !== "string") {
        return res.status(400).json({ error: "Input parameter is required" });
      }
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key not configured in environment variables");
        return res.status(500).json({
          error: "Google Maps API key not configured",
          details: "Please set GOOGLE_MAPS_API_KEY in your environment variables"
        });
      }
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.append("input", input);
      url.searchParams.append("types", types);
      url.searchParams.append("components", components);
      url.searchParams.append("key", apiKey);
      console.log("Fetching address autocomplete for input:", input);
      let response;
      try {
        response = await fetch(url.toString());
      } catch (fetchError) {
        console.error("Network error fetching from Google Places API:", fetchError);
        return res.status(500).json({
          error: "Network error",
          details: fetchError.message || "Failed to connect to Google Places API"
        });
      }
      if (!response.ok) {
        console.error("Google Places API HTTP error:", response.status, response.statusText);
        return res.status(500).json({
          error: "Google Places API request failed",
          details: `HTTP ${response.status}: ${response.statusText}`
        });
      }
      const data = await response.json();
      console.log("Google Places API response status:", data.status);
      if (data.status === "OK") {
        res.json(data);
      } else if (data.status === "ZERO_RESULTS") {
        res.json({ ...data, predictions: [] });
      } else if (data.status === "REQUEST_DENIED") {
        console.error("Google Places API: Request denied. Error message:", data.error_message);
        res.status(500).json({
          error: "Google Places API request denied",
          details: data.error_message || "API key may be invalid or missing required permissions"
        });
      } else if (data.status === "INVALID_REQUEST") {
        console.error("Google Places API: Invalid request. Error message:", data.error_message);
        res.status(400).json({
          error: "Invalid request to Google Places API",
          details: data.error_message || "Request parameters are invalid"
        });
      } else if (data.status === "OVER_QUERY_LIMIT") {
        console.error("Google Places API: Over query limit");
        res.status(429).json({
          error: "API quota exceeded",
          details: "Google Places API quota has been exceeded. Please try again later."
        });
      } else {
        console.error("Google Places API error:", data);
        res.status(500).json({
          error: "Failed to fetch address suggestions",
          details: data.error_message || `Google API returned status: ${data.status}`
        });
      }
    } catch (error) {
      console.error("Address autocomplete error:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error.message || "An unexpected error occurred"
      });
    }
  });
  app2.get("/api/address/details", async (req, res) => {
    try {
      const { place_id } = req.query;
      if (!place_id || typeof place_id !== "string") {
        return res.status(400).json({ error: "place_id parameter is required" });
      }
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Google Maps API key not configured" });
      }
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.append("place_id", place_id);
      url.searchParams.append("fields", "formatted_address,address_components,geometry");
      url.searchParams.append("key", apiKey);
      console.log("Fetching place details for:", place_id);
      const response = await fetch(url.toString());
      const data = await response.json();
      console.log("Google Places Details API response:", JSON.stringify(data, null, 2));
      if (data.status === "OK") {
        res.json(data);
      } else {
        console.error("Google Places Details API error:", data.status, data.error_message);
        res.status(500).json({ error: "Failed to fetch address details", details: data.error_message });
      }
    } catch (error) {
      console.error("Address details error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/service-requests", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const requestData = insertServiceRequestSchema.parse({
        ...req.body,
        customerId: userId
      });
      const request = await storage.createServiceRequest(requestData);
      try {
        const customer = await storage.getUser(userId);
        if (customer && customer.phoneNumber) {
          console.log(`[Won Status] Checking if customer ${customer.email} is in potential customers...`);
          const potentialCustomer = await storage.findPotentialCustomerByPhone(customer.phoneNumber);
          if (potentialCustomer && potentialCustomer.campaignStatus !== "Won") {
            console.log(`[Won Status] Customer found! Updating ${potentialCustomer.name} (ID: ${potentialCustomer.id}) to Won`);
            await storage.updatePotentialCustomerStatus(potentialCustomer.id, "Won");
            console.log(`\u2705 [Won Status] Customer ${potentialCustomer.name} marked as Won!`);
          } else if (potentialCustomer) {
            console.log(`[Won Status] Customer ${potentialCustomer.name} already has status: ${potentialCustomer.campaignStatus}`);
          } else {
            console.log(`[Won Status] Customer not found in potential customers`);
          }
        }
      } catch (wonError) {
        console.error("[Won Status] Error updating potential customer to Won:", wonError);
      }
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "service_request_created",
        details: {
          requestId: request.id,
          postcode: request.postcode,
          categoryId: request.categoryId
        },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || ""
      });
      res.json({
        request,
        message: "Service request created successfully! We'll be in touch soon."
      });
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Failed to create service request" });
    }
  });
  app2.get("/api/service-requests/my-requests", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const requests = await storage.getCustomerServiceRequestsWithOffers(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });
  app2.get("/api/service-requests/:id/details", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.id;
      const request = await storage.getServiceRequest(requestId);
      if (!request || request.customerId !== userId) {
        return res.status(404).json({ message: "Service request not found" });
      }
      const details = await storage.getServiceRequestDetails(requestId);
      res.json(details);
    } catch (error) {
      console.error("Error fetching service request details:", error);
      res.status(500).json({ message: "Failed to fetch service request details" });
    }
  });
  app2.get("/api/service-requests/:id/professionals", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.id;
      const request = await storage.getServiceRequest(requestId);
      if (!request || request.customerId !== userId) {
        return res.status(404).json({ message: "Service request not found" });
      }
      const professionals = await storage.getServiceRequestProfessionals(requestId);
      res.json(professionals);
    } catch (error) {
      console.error("Error fetching service request professionals:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });
  app2.get("/api/service-requests/:id/accepted-professionals", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.id;
      const request = await storage.getServiceRequest(requestId);
      if (!request || request.customerId !== userId) {
        return res.status(404).json({ message: "Service request not found" });
      }
      const acceptedProfessionals = await storage.getServiceRequestAcceptedProfessionals(requestId);
      res.json(acceptedProfessionals);
    } catch (error) {
      console.error("Error fetching accepted professionals:", error);
      res.status(500).json({ message: "Failed to fetch accepted professionals" });
    }
  });
  app2.get("/api/leads/new", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const provider = await storage.getServiceProviderByEmail(req.user.email);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      const leads = await storage.getProviderLeads(provider.id, "pending");
      res.json(leads);
    } catch (error) {
      console.error("Error fetching new leads:", error);
      res.status(500).json({ message: "Failed to fetch new leads" });
    }
  });
  app2.post("/api/leads/:id/accept", isAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const userId = req.user.id;
      const provider = await storage.getServiceProviderByEmail(req.user.email);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      await storage.updateLeadStatus(leadId, "accepted");
      await storage.logUserActivity({
        userId,
        userType: "provider",
        action: "lead_accepted",
        details: { leadId },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || ""
      });
      res.json({ message: "Lead accepted successfully" });
    } catch (error) {
      console.error("Error accepting lead:", error);
      res.status(500).json({ message: "Failed to accept lead" });
    }
  });
  app2.put("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phoneNumber } = req.body;
      if (!firstName || !lastName) {
        return res.status(400).json({ message: "First name and last name are required" });
      }
      const updatedUser = await storage.updateUser(userId, { firstName, lastName, phoneNumber });
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "profile_updated",
        details: { firstName, lastName, phoneNumber },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || ""
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  app2.post("/api/change-password", isAuthenticated, async (req, res) => {
    try {
      console.log("\u{1F510} Password change request received:", { userId: req.user.id, email: req.user.email });
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        console.log("\u274C Missing password fields");
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      if (newPassword.length < 6) {
        console.log("\u274C New password too short");
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      if (currentPassword === newPassword) {
        console.log("\u274C Same password provided");
        return res.status(400).json({ message: "New password must be different from current password" });
      }
      console.log("\u{1F4DD} Getting user from database...");
      const user = await storage.getUser(userId);
      if (!user) {
        console.log("\u274C User not found in database");
        return res.status(404).json({ message: "User not found" });
      }
      console.log("\u2705 User found:", { id: user.id, email: user.email });
      console.log("\u{1F50D} Verifying current password...");
      const bcrypt3 = await import("bcrypt");
      const isCurrentPasswordValid = await bcrypt3.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        console.log("\u274C Current password is incorrect");
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      console.log("\u2705 Current password verified");
      console.log("\u{1F510} Hashing new password...");
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt3.hash(newPassword, saltRounds);
      console.log("\u2705 New password hashed");
      console.log("\u{1F4BE} Updating password in database...");
      await storage.updateUserPassword(userId, hashedNewPassword);
      console.log("\u2705 Password updated in database");
      console.log("\u{1F4DD} Logging user activity...");
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "password_changed",
        details: { passwordChanged: true },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || ""
      });
      console.log("\u2705 Activity logged");
      console.log("\u{1F389} Password change successful");
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("\u{1F4A5} Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.post("/api/user-activity", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { action, details, userType } = req.body;
      await storage.logUserActivity({
        userId,
        userType,
        action,
        details,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || ""
      });
      res.json({ message: "Activity logged successfully" });
    } catch (error) {
      console.error("Error logging user activity:", error);
      res.status(500).json({ message: "Failed to log user activity" });
    }
  });
  app2.get("/api/regions", async (req, res) => {
    try {
      const regions = await storage.getAllRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });
  app2.get("/api/regions/state/:stateId", async (req, res) => {
    try {
      const { stateId } = req.params;
      const regions = await storage.getRegionsByStateId(parseInt(stateId));
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions by state:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });
  app2.get("/api/regions/:regionId/suburbs", async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      const suburbs = await storage.getSuburbsByRegion(regionId);
      res.json(suburbs);
    } catch (error) {
      console.error("Error fetching region suburbs:", error);
      res.status(500).json({ error: "Failed to fetch region suburbs" });
    }
  });
  app2.get("/api/admin/stats", isAdminAuthenticated, async (req, res) => {
    try {
      const totalProviders = await storage.getServiceProviderCount();
      const activeProviders = await storage.getServiceProviderCount("approved");
      const pendingApprovals = await storage.getServiceProviderCount("pending");
      const totalCustomers = await storage.getUserCount();
      const totalRequests = await storage.getServiceRequestCount();
      const activeRequests = await storage.getActiveServiceRequestCount();
      const completedJobs = await storage.getServiceRequestCount("completed");
      const monthlyRevenue = await storage.getMonthlyRevenue();
      res.json({
        totalProviders,
        activeProviders,
        pendingApprovals,
        totalCustomers,
        totalRequests,
        activeRequests,
        monthlyRevenue,
        completedJobs
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/admin/providers", isAdminAuthenticated, async (req, res) => {
    try {
      const status = req.query.status;
      const providers = await storage.getServiceProvidersForAdmin(status);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });
  app2.get("/api/admin/providers/report", isAdminAuthenticated, async (req, res) => {
    console.log("\u{1F680} API route /api/admin/providers/report called");
    try {
      const status = req.query.status;
      const rating = req.query.rating;
      console.log("\u{1F4CA} Calling getServiceProvidersForReport with:", { status, rating });
      const providers = await storage.getServiceProvidersForReport(status, rating);
      console.log("\u2705 Got providers:", providers.length);
      res.json(providers);
    } catch (error) {
      console.error("\u274C Error fetching provider report data:", error);
      res.status(500).json({ message: "Failed to fetch provider report data" });
    }
  });
  app2.post("/api/admin/providers/:id/approve", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const currentProvider = await storage.getServiceProviderById(providerId);
      const oldStatus = currentProvider?.status || "pending";
      const oldProviderStatus = currentProvider?.providerStatus || "deactivated";
      await storage.updateServiceProviderStatus(providerId, "approved");
      if (oldStatus === "pending" && oldProviderStatus === "deactivated") {
        await storage.updateProviderStatus(providerId, "activated");
        await storage.logProviderActivity({
          providerId,
          activityType: "status_change",
          actorType: "admin",
          actorId: "admin",
          actorName: "Administrator",
          description: "Provider automatically activated upon approval",
          oldValue: "deactivated",
          newValue: "activated"
        });
      }
      await storage.logProviderActivity({
        providerId,
        activityType: "status_change",
        actorType: "admin",
        actorId: "admin",
        actorName: "Administrator",
        description: "Provider application approved",
        oldValue: oldStatus,
        newValue: "approved"
      });
      try {
        await sendProviderApprovalEmail(currentProvider.email, currentProvider.firstName);
        console.log(`Approval congratulations email sent to provider: ${currentProvider.email}`);
      } catch (emailError) {
        console.error(`Failed to send approval email to ${currentProvider.email}:`, emailError);
      }
      res.json({ message: "Provider approved successfully" });
    } catch (error) {
      console.error("Error approving provider:", error);
      res.status(500).json({ message: "Failed to approve provider" });
    }
  });
  app2.post("/api/admin/providers/:id/reject", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const currentProvider = await storage.getServiceProviderById(providerId);
      const oldStatus = currentProvider?.status || "pending";
      await storage.updateServiceProviderStatus(providerId, "rejected");
      await storage.logProviderActivity({
        providerId,
        activityType: "status_change",
        actorType: "admin",
        actorId: "admin",
        actorName: "Administrator",
        description: "Provider application rejected",
        oldValue: oldStatus,
        newValue: "rejected"
      });
      res.json({ message: "Provider rejected successfully" });
    } catch (error) {
      console.error("Error rejecting provider:", error);
      res.status(500).json({ message: "Failed to reject provider" });
    }
  });
  app2.get("/api/admin/providers/:id/details", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const providerDetails = await storage.getProviderDetailsForAdmin(providerId);
      res.json(providerDetails);
    } catch (error) {
      console.error("Error fetching provider details:", error);
      res.status(500).json({ message: "Failed to fetch provider details" });
    }
  });
  app2.post("/api/admin/providers/:id/service-areas", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { centerAddress, radiusKm } = req.body;
      const serviceArea = await storage.addProviderLocationServiceArea({
        providerId,
        centerAddress,
        radiusKm,
        areaName: void 0
        // Let admin optionally specify this later
      });
      await storage.calculateServiceAreaCoverage(serviceArea.id);
      await storage.logProviderActivity({
        providerId,
        activityType: "service_area_update",
        actorType: "admin",
        actorId: "admin",
        actorName: "Administrator",
        description: `Service area added: ${centerAddress} (${radiusKm}km radius)`,
        oldValue: null,
        newValue: `${centerAddress} - ${radiusKm}km radius`
      });
      res.json(serviceArea);
    } catch (error) {
      console.error("Error adding service area:", error);
      res.status(500).json({ message: "Failed to add service area" });
    }
  });
  app2.delete("/api/admin/service-areas/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const areaId = parseInt(req.params.id);
      const serviceAreaDetails = await storage.getServiceAreaById(areaId);
      await storage.removeProviderServiceArea(areaId);
      if (serviceAreaDetails) {
        await storage.logProviderActivity({
          providerId: serviceAreaDetails.providerId,
          activityType: "service_area_update",
          actorType: "admin",
          actorId: "admin",
          actorName: "Administrator",
          description: `Service area removed: ${serviceAreaDetails.centerAddress} (${serviceAreaDetails.radiusKm}km radius)`,
          oldValue: `${serviceAreaDetails.centerAddress} - ${serviceAreaDetails.radiusKm}km radius`,
          newValue: null
        });
      }
      res.json({ message: "Service area removed successfully" });
    } catch (error) {
      console.error("Error removing service area:", error);
      res.status(500).json({ message: "Failed to remove service area" });
    }
  });
  app2.put("/api/admin/providers/:id/notes", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { adminNotes, insuranceExpiryDate } = req.body;
      const currentProvider = await storage.getServiceProviderById(providerId);
      const oldNotes = currentProvider?.adminNotes || "";
      const oldInsuranceDate = currentProvider?.insuranceExpiryDate;
      await storage.updateProviderAdminFields(providerId, {
        adminNotes,
        insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null
      });
      if (adminNotes !== oldNotes) {
        await storage.logProviderActivity({
          providerId,
          activityType: "details_update",
          actorType: "admin",
          actorId: "admin",
          actorName: "Administrator",
          description: `Admin notes ${adminNotes ? "updated" : "cleared"}`,
          oldValue: oldNotes,
          newValue: adminNotes
        });
      }
      const newInsuranceDate = insuranceExpiryDate ? new Date(insuranceExpiryDate) : null;
      const oldDateString = oldInsuranceDate ? new Date(oldInsuranceDate).toISOString().split("T")[0] : null;
      const newDateString = newInsuranceDate ? newInsuranceDate.toISOString().split("T")[0] : null;
      if (oldDateString !== newDateString) {
        await storage.logProviderActivity({
          providerId,
          activityType: "details_update",
          actorType: "admin",
          actorId: "admin",
          actorName: "Administrator",
          description: `Insurance expiry date ${newInsuranceDate ? "updated to " + newInsuranceDate.toLocaleDateString("en-AU") : "cleared"}`,
          oldValue: oldDateString,
          newValue: newDateString
        });
      }
      res.json({ message: "Provider admin fields updated successfully" });
    } catch (error) {
      console.error("Error updating provider admin fields:", error);
      res.status(500).json({ message: "Failed to update provider admin fields" });
    }
  });
  app2.put("/api/admin/providers/:providerId/documents/:documentId/status", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const documentId = parseInt(req.params.documentId);
      const { status } = req.body;
      if (!["pending", "approved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be pending or approved." });
      }
      const currentDocument = await storage.getProviderDocument(documentId);
      if (!currentDocument || currentDocument.providerId !== providerId) {
        return res.status(404).json({ message: "Document not found" });
      }
      await storage.updateDocumentStatus(documentId, status);
      await storage.logProviderActivity({
        providerId,
        activityType: "document_update",
        actorType: "admin",
        actorId: "admin",
        actorName: "Administrator",
        description: `${currentDocument.documentType.replace("_", " ")} document ${status === "approved" ? "approved" : "marked as pending"}`,
        oldValue: currentDocument.status,
        newValue: status
      });
      res.json({ message: "Document status updated successfully" });
    } catch (error) {
      console.error("Error updating document status:", error);
      res.status(500).json({ message: "Failed to update document status" });
    }
  });
  app2.get("/api/admin/service-requests", isAdminAuthenticated, async (req, res) => {
    try {
      const serviceRequests2 = await storage.getAllServiceRequestsForAdmin();
      const requestsWithDetails = await Promise.all(
        serviceRequests2.map(async (request) => {
          const customer = await storage.getUser(request.customerId);
          const category = await storage.getServiceCategory(request.categoryId);
          return {
            id: request.id,
            customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer",
            customerEmail: customer?.email || "No email",
            serviceCategory: category?.name || "Unknown Category",
            location: request.suburb || request.postcode || "Unknown Location",
            status: request.status,
            createdAt: request.createdAt,
            budget: request.budget,
            description: request.description
          };
        })
      );
      res.json(requestsWithDetails);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });
  app2.post("/api/admin/providers/:id/services", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { categoryIds } = req.body;
      const uniqueCategoryIds = Array.from(new Set(categoryIds));
      if (!Array.isArray(categoryIds) || uniqueCategoryIds.length === 0) {
        return res.status(400).json({ message: "Category IDs are required" });
      }
      const provider = await storage.getServiceProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const currentServices = await storage.getProviderServices(providerId);
      const currentServiceNames = Array.from(new Set(currentServices.map((s) => s.name))).sort().join(", ");
      const allCategories = await storage.getServiceCategories();
      const newServiceNames = Array.from(new Set(
        allCategories.filter((cat) => uniqueCategoryIds.includes(cat.id)).map((cat) => cat.name)
      )).sort().join(", ");
      await storage.replaceProviderServices(providerId, uniqueCategoryIds);
      if (currentServiceNames !== newServiceNames) {
        await storage.logProviderActivity({
          providerId,
          activityType: "services_update",
          actorType: "admin",
          actorId: "admin",
          actorName: "Administrator",
          description: "Service categories updated by admin",
          oldValue: currentServiceNames || "No services selected",
          newValue: newServiceNames
        });
      }
      res.json({ message: "Services updated successfully" });
    } catch (error) {
      console.error("Error updating provider services:", error);
      res.status(500).json({ message: "Failed to update provider services" });
    }
  });
  app2.put("/api/admin/providers/:id/provider-status", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { providerStatus } = req.body;
      if (!providerStatus || !["activated", "deactivated"].includes(providerStatus)) {
        return res.status(400).json({ message: "Valid provider status is required (activated or deactivated)" });
      }
      const currentProvider = await storage.getServiceProviderById(providerId);
      if (!currentProvider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const oldStatus = currentProvider.providerStatus || "deactivated";
      await storage.updateProviderStatus(providerId, providerStatus);
      await storage.logProviderActivity({
        providerId,
        activityType: "status_change",
        actorType: "admin",
        actorId: "admin",
        actorName: "Administrator",
        description: `Provider status changed from ${oldStatus} to ${providerStatus}`,
        oldValue: oldStatus,
        newValue: providerStatus
      });
      res.json({ message: "Provider status updated successfully" });
    } catch (error) {
      console.error("Error updating provider status:", error);
      res.status(500).json({ message: "Failed to update provider status" });
    }
  });
  app2.get("/api/admin/providers/:id/activity", isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const actorType = req.query.actorType;
      const activities = await storage.getProviderActivityLogs(providerId, actorType);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching provider activities:", error);
      res.status(500).json({ message: "Failed to fetch provider activities" });
    }
  });
  app2.get("/api/admin/customer-users", isAdminAuthenticated, async (req, res) => {
    try {
      const users2 = await storage.getUsersWithStats();
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/leads", isAdminAuthenticated, async (req, res) => {
    try {
      const leads = await storage.getLeadsWithMetrics();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });
  app2.post("/api/admin/leads/:id/notes", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { note } = req.body;
      if (!note || !note.trim()) {
        return res.status(400).json({ message: "Note content is required" });
      }
      const newNote = await storage.addLeadNote(leadId, note.trim(), "admin");
      res.json(newNote);
    } catch (error) {
      console.error("Error adding lead note:", error);
      res.status(500).json({ message: "Failed to add lead note" });
    }
  });
  app2.get("/api/admin/leads/:id/interactions", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const interactions = await storage.getProviderLeadInteractions(leadId);
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching lead interactions:", error);
      res.status(500).json({ message: "Failed to fetch lead interactions" });
    }
  });
  app2.get("/api/admin/lead-settings", isAdminAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getLeadSettings();
      const categoryPricing = await storage.getCategoryLeadPricing();
      res.json({
        ...settings,
        categoryPricing
      });
    } catch (error) {
      console.error("Error fetching lead settings:", error);
      res.status(500).json({ message: "Failed to fetch lead settings" });
    }
  });
  app2.put("/api/admin/lead-settings", isAdminAuthenticated, async (req, res) => {
    try {
      const settings = await storage.upsertLeadSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error updating lead settings:", error);
      res.status(500).json({ message: "Failed to update lead settings" });
    }
  });
  app2.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      res.status(500).json({ message: "Failed to fetch admin settings" });
    }
  });
  app2.get("/api/config/stripe", async (req, res) => {
    try {
      const stripeKeys = await storage.getDecryptedStripeKeys();
      if (stripeKeys && stripeKeys.publicKey) {
        res.json({
          publicKey: stripeKeys.publicKey,
          configured: true
        });
      } else {
        res.json({
          publicKey: null,
          configured: false
        });
      }
    } catch (error) {
      console.error("Error fetching Stripe config:", error);
      res.status(500).json({ message: "Failed to fetch Stripe config" });
    }
  });
  app2.get("/api/admin/stripe-settings", isAdminAuthenticated, async (req, res) => {
    try {
      const stripeKeys = await storage.getDecryptedStripeKeys();
      if (stripeKeys) {
        res.json({
          secretKey: "****" + stripeKeys.secretKey.slice(-4),
          publicKey: stripeKeys.publicKey,
          isConfigured: true
        });
      } else {
        res.json({
          secretKey: "",
          publicKey: "",
          isConfigured: false
        });
      }
    } catch (error) {
      console.error("Error fetching Stripe settings:", error);
      res.status(500).json({ message: "Failed to fetch Stripe settings" });
    }
  });
  app2.get("/api/admin/mailgun-settings", isAdminAuthenticated, async (req, res) => {
    try {
      const mailgunKeys = await storage.getDecryptedMailgunKeys();
      if (mailgunKeys) {
        res.json({
          apiKey: "****" + mailgunKeys.apiKey.slice(-4),
          domain: mailgunKeys.domain,
          domainSendingKey: "****" + mailgunKeys.domainSendingKey.slice(-4),
          isConfigured: true
        });
      } else {
        res.json({
          apiKey: "",
          domain: "",
          domainSendingKey: "",
          isConfigured: false
        });
      }
    } catch (error) {
      console.error("Error fetching Mailgun settings:", error);
      res.status(500).json({ message: "Failed to fetch Mailgun settings" });
    }
  });
  app2.post("/api/setup/stripe-settings", async (req, res) => {
    try {
      const { publicKey, secretKey } = req.body;
      if (!publicKey || !secretKey) {
        return res.status(400).json({ message: "Both public key and secret key are required" });
      }
      if (!secretKey.startsWith("sk_")) {
        return res.status(400).json({ message: "Invalid Stripe Secret Key format" });
      }
      if (!publicKey.startsWith("pk_")) {
        return res.status(400).json({ message: "Invalid Stripe Public Key format" });
      }
      await storage.updateAdminSetting("stripe_secret_key", secretKey);
      await storage.updateAdminSetting("stripe_public_key", publicKey);
      console.log("Stripe keys saved successfully via setup route - Secret key starts with:", secretKey.substring(0, 10) + "...");
      res.json({
        message: "Stripe settings configured successfully",
        isConfigured: true
      });
    } catch (error) {
      console.error("Error configuring Stripe settings:", error);
      res.status(500).json({ message: "Failed to configure Stripe settings" });
    }
  });
  app2.post("/api/admin/stripe-settings", isAdminAuthenticated, async (req, res) => {
    try {
      const { publicKey, secretKey } = req.body;
      if (!publicKey || !secretKey) {
        return res.status(400).json({ message: "Both public key and secret key are required" });
      }
      if (!secretKey.startsWith("sk_")) {
        return res.status(400).json({ message: "Invalid Stripe Secret Key format" });
      }
      if (!publicKey.startsWith("pk_")) {
        return res.status(400).json({ message: "Invalid Stripe Public Key format" });
      }
      await storage.updateAdminSetting("stripe_secret_key", secretKey);
      await storage.updateAdminSetting("stripe_public_key", publicKey);
      console.log("Stripe keys saved successfully - Secret key starts with:", secretKey.substring(0, 10) + "...");
      res.json({
        message: "Settings updated successfully",
        isConfigured: true
      });
    } catch (error) {
      console.error("Error updating Stripe settings:", error);
      res.status(500).json({ message: "Failed to update Stripe settings" });
    }
  });
  app2.post("/api/setup/mailgun-settings", async (req, res) => {
    try {
      const { apiKey, domain, domainSendingKey } = req.body;
      if (!apiKey || !domain || !domainSendingKey) {
        return res.status(400).json({ message: "API key, domain, and domain sending key are all required" });
      }
      await storage.updateAdminSetting("mailgun_api_key", apiKey);
      await storage.updateAdminSetting("mailgun_domain", domain);
      await storage.updateAdminSetting("mailgun_domain_sending_key", domainSendingKey);
      console.log("Mailgun keys saved successfully via setup route - API key starts with:", apiKey.substring(0, 10) + "...", "Domain:", domain);
      res.json({
        message: "Mailgun configuration updated successfully",
        isConfigured: true
      });
    } catch (error) {
      console.error("Error configuring Mailgun settings:", error);
      res.status(500).json({ message: "Failed to configure Mailgun settings" });
    }
  });
  app2.post("/api/setup/run-migration", async (req, res) => {
    try {
      const { sql: sql3 } = req.body;
      if (!sql3) {
        return res.status(400).json({ message: "SQL migration is required" });
      }
      await storage.executeMigration(sql3);
      res.json({ message: "Migration executed successfully" });
    } catch (error) {
      console.error("Error running migration:", error);
      res.status(500).json({ message: "Failed to execute migration", error: error.message });
    }
  });
  app2.post("/api/admin/mailgun-settings", isAdminAuthenticated, async (req, res) => {
    try {
      const { apiKey, domain, domainSendingKey } = req.body;
      if (!apiKey || !domain || !domainSendingKey) {
        return res.status(400).json({ message: "API key, domain, and domain sending key are all required" });
      }
      await storage.updateAdminSetting("mailgun_api_key", apiKey);
      await storage.updateAdminSetting("mailgun_domain", domain);
      await storage.updateAdminSetting("mailgun_domain_sending_key", domainSendingKey);
      console.log("Mailgun keys saved successfully - API key starts with:", apiKey.substring(0, 10) + "...", "Domain:", domain);
      res.json({
        message: "Mailgun configuration updated successfully",
        isConfigured: true
      });
    } catch (error) {
      console.error("Error updating Mailgun settings:", error);
      res.status(500).json({ message: "Failed to update Mailgun settings" });
    }
  });
  app2.post("/api/admin/test-email", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email address required" });
      }
      const mailgunKeys = await storage.getDecryptedMailgunKeys();
      if (!mailgunKeys) {
        return res.status(400).json({ message: "Mailgun not configured" });
      }
      const { apiKey, domain, domainSendingKey } = mailgunKeys;
      const testResponse = await fetch(`https://api.mailgun.net/v3/${domain}`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`
        }
      });
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        return res.status(400).json({
          message: "Mailgun API connection failed",
          error: errorText,
          domain
        });
      }
      const formData = new FormData();
      formData.append("from", `ServicePanda Test <noreply@${domain}>`);
      formData.append("to", email);
      formData.append("subject", "ServicePanda Email Test");
      formData.append("text", "This is a test email from ServicePanda. If you received this, email integration is working correctly.");
      formData.append("html", "<p>This is a test email from ServicePanda. If you received this, email integration is working correctly.</p>");
      const sendResponse = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`
        },
        body: formData
      });
      if (!sendResponse.ok) {
        const errorText = await sendResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        if (errorData.message && errorData.message.includes("Sandbox subdomains are for test purposes only")) {
          return res.json({
            success: false,
            message: "Mailgun API connection successful, but sandbox domain requires authorized recipients",
            details: "Add your email to authorized recipients in Mailgun dashboard, or configure a custom domain",
            domain,
            isConfigured: true,
            needsAuthorizedRecipients: true
          });
        }
        return res.status(400).json({
          message: "Email send failed",
          error: errorData,
          domain
        });
      }
      const result2 = await sendResponse.json();
      res.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result2.id,
        domain
      });
    } catch (error) {
      console.error("Email test error:", error);
      res.status(500).json({ message: error.message || "Email test failed" });
    }
  });
  app2.get("/api/provider/:id/payment-methods", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const paymentMethods = await storage.getProviderPaymentMethods(providerId);
      res.json(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });
  app2.post("/api/provider/:id/stripe-payment-methods", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const stripeKeys = await storage.getDecryptedStripeKeys();
      if (!stripeKeys) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      const stripe = new (await import("stripe")).default(stripeKeys.secretKey);
      const { paymentMethodId } = req.body;
      if (!paymentMethodId) {
        return res.status(400).json({ message: "Payment method ID is required" });
      }
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      let stripeCustomerId = provider.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: provider.email,
          name: `${provider.firstName} ${provider.lastName}`,
          metadata: {
            providerId: providerId.toString()
          }
        });
        stripeCustomerId = customer.id;
        await storage.updateProviderStripeCustomerId(providerId, stripeCustomerId);
      }
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId
      });
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      const existingMethods = await storage.getProviderPaymentMethods(providerId);
      const isFirstCard = existingMethods.length === 0;
      const paymentMethodData = {
        providerId,
        stripeCustomerId,
        stripePaymentMethodId: paymentMethod.id,
        cardBrand: paymentMethod.card?.brand || "unknown",
        cardLastFour: paymentMethod.card?.last4 || "0000",
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isPrimary: isFirstCard,
        // First card is automatically primary
        isActive: true
      };
      const newPaymentMethod = await storage.addProviderPaymentMethod(paymentMethodData);
      if (isFirstCard) {
        await storage.updateProviderPaymentMethodPrimary(providerId, newPaymentMethod.id);
      }
      res.json(newPaymentMethod);
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ message: error.message || "Failed to add payment method" });
    }
  });
  app2.post("/api/provider/:id/payment-methods", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const stripeKeys = await storage.getDecryptedStripeKeys();
      if (!stripeKeys) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      const stripe = new (await import("stripe")).default(stripeKeys.secretKey);
      const {
        cardNumber,
        cardholderName,
        expiryMonth,
        expiryYear,
        cvv,
        isPrimary = false
      } = req.body;
      if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
        return res.status(400).json({ message: "Missing required card information" });
      }
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      let stripeCustomerId = provider.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: provider.email,
          name: `${provider.firstName} ${provider.lastName}`,
          metadata: {
            providerId: providerId.toString()
          }
        });
        stripeCustomerId = customer.id;
        await storage.updateProviderStripeCustomerId(providerId, stripeCustomerId);
      }
      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number: cardNumber.replace(/\s/g, ""),
          exp_month: parseInt(expiryMonth),
          exp_year: parseInt(expiryYear),
          cvc: cvv
        },
        billing_details: {
          name: cardholderName
        }
      });
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: stripeCustomerId
      });
      const existingMethods = await storage.getProviderPaymentMethods(providerId);
      const isFirstCard = existingMethods.length === 0;
      const paymentMethodData = {
        providerId,
        stripeCustomerId,
        stripePaymentMethodId: paymentMethod.id,
        cardBrand: paymentMethod.card?.brand || "unknown",
        cardLastFour: paymentMethod.card?.last4 || "0000",
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isPrimary: isFirstCard || isPrimary,
        // First card is automatically primary
        isActive: true
      };
      const newPaymentMethod = await storage.addProviderPaymentMethod(paymentMethodData);
      if (isFirstCard || isPrimary) {
        await storage.updateProviderPaymentMethodPrimary(providerId, newPaymentMethod.id);
      }
      res.json(newPaymentMethod);
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ message: error.message || "Failed to add payment method" });
    }
  });
  app2.put("/api/provider/:id/payment-methods/:paymentMethodId/primary", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const paymentMethodId = parseInt(req.params.paymentMethodId);
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.updateProviderPaymentMethodPrimary(providerId, paymentMethodId);
      res.json({ message: "Primary payment method updated successfully" });
    } catch (error) {
      console.error("Error updating primary payment method:", error);
      res.status(500).json({ message: "Failed to update primary payment method" });
    }
  });
  app2.delete("/api/provider/:id/payment-methods/:paymentMethodId", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const paymentMethodId = parseInt(req.params.paymentMethodId);
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deleteProviderPaymentMethod(paymentMethodId);
      res.json({ message: "Payment method removed successfully" });
    } catch (error) {
      console.error("Error removing payment method:", error);
      res.status(500).json({ message: "Failed to remove payment method" });
    }
  });
  app2.post("/api/service-requests", async (req, res) => {
    try {
      const serviceRequestData = insertServiceRequestSchema.parse(req.body);
      const newRequest = await storage.createServiceRequest(serviceRequestData);
      await storage.initializeLeadDistribution(newRequest.id);
      res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: error.message || "Failed to create service request" });
    }
  });
  app2.get("/api/admin/leads/:requestId/offer-details", isAdminAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const offerDetails = await storage.getLeadOfferDetails(requestId);
      res.json(offerDetails);
    } catch (error) {
      console.error("Error fetching lead offer details:", error);
      res.status(500).json({ message: error.message || "Failed to fetch lead offer details" });
    }
  });
  app2.post("/api/admin/leads/:requestId/initialize", isAdminAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      await storage.initializeLeadDistribution(requestId);
      res.json({ success: true, message: "Lead distribution initialized" });
    } catch (error) {
      console.error("Error initializing lead distribution:", error);
      res.status(500).json({ message: error.message || "Failed to initialize lead distribution" });
    }
  });
  app2.get("/api/provider/leads", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const activeLeads = await storage.getProviderActiveLeads(providerId);
      res.json(activeLeads);
    } catch (error) {
      console.error("Error fetching provider leads:", error);
      res.status(500).json({ message: error.message || "Failed to fetch provider leads" });
    }
  });
  app2.get("/api/provider/leads/closed", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const closedLeads = await storage.getProviderClosedLeads(providerId);
      res.json(closedLeads);
    } catch (error) {
      console.error("Error fetching provider closed leads:", error);
      res.status(500).json({ message: error.message || "Failed to fetch provider closed leads" });
    }
  });
  app2.get("/api/provider/activity", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const activities = await storage.getProviderActivityHistory(providerId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching provider activity:", error);
      res.status(500).json({ message: error.message || "Failed to fetch activity history" });
    }
  });
  app2.get("/api/provider/notifications/poll", notificationRoutes.poll);
  app2.get("/api/provider/notifications/long-poll", notificationRoutes.longPoll);
  app2.get("/api/provider/notifications/stats", notificationRoutes.stats);
  app2.post("/api/provider/leads/:requestId/purchase", isProviderAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const [activeOffer] = await db.select().from(leadOffers).where(
        and2(
          eq2(leadOffers.requestId, requestId),
          eq2(leadOffers.providerId, providerId),
          eq2(leadOffers.status, "pending"),
          or2(
            eq2(leadOffers.isCurrentOffer, true),
            eq2(leadOffers.offerType, "shared")
          )
        )
      ).limit(1);
      if (!activeOffer) {
        return res.status(400).json({ success: false, message: "No active offer found for this provider" });
      }
      const result2 = await storage.purchaseLeadWithCredit(providerId, activeOffer.id);
      if (result2.success) {
        res.json(result2);
      } else {
        res.status(400).json(result2);
      }
    } catch (error) {
      console.error("Error purchasing lead:", error);
      res.status(500).json({ message: error.message || "Failed to purchase lead" });
    }
  });
  app2.get("/api/provider/credit/balance", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const balance = await storage.getProviderCreditBalance(providerId);
      res.json({ balance });
    } catch (error) {
      console.error("Error getting credit balance:", error);
      res.status(500).json({ message: "Failed to get credit balance" });
    }
  });
  app2.get("/api/provider/credit/transactions", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const transactions = await storage.getProviderCreditTransactions(providerId);
      res.json(transactions);
    } catch (error) {
      console.error("Error getting credit transactions:", error);
      res.status(500).json({ message: "Failed to get credit transactions" });
    }
  });
  app2.post("/api/provider/leads/:leadId/interaction", isProviderAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const providerId = req.provider?.id;
      const { interactionType } = req.body;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      if (!["call", "sms", "email"].includes(interactionType)) {
        return res.status(400).json({ message: "Invalid interaction type" });
      }
      await storage.logProviderLeadInteraction({
        providerId,
        leadId,
        interactionType
      });
      res.json({ success: true, message: "Interaction logged successfully" });
    } catch (error) {
      console.error("Error logging provider interaction:", error);
      res.status(500).json({ message: "Failed to log interaction" });
    }
  });
  app2.get("/api/provider/leads/:leadId/status", isProviderAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const status = await storage.getProviderLeadStatus(providerId, leadId);
      res.json(status || { status: "new", wasJobBooked: null });
    } catch (error) {
      console.error("Error getting provider lead status:", error);
      res.status(500).json({ message: "Failed to get lead status" });
    }
  });
  app2.put("/api/provider/leads/:leadId/status", isProviderAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const providerId = req.provider?.id;
      const { status, wasJobBooked } = req.body;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      if (!["new", "open", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be new, open, or closed" });
      }
      if (status === "closed" && typeof wasJobBooked !== "boolean") {
        return res.status(400).json({ message: "wasJobBooked must be true or false when closing a lead" });
      }
      const updatedStatus = await storage.upsertProviderLeadStatus({
        providerId,
        leadId,
        status,
        wasJobBooked: status === "closed" ? wasJobBooked : void 0
      });
      if (status === "closed" && wasJobBooked === true) {
        try {
          const { sendCustomerFeedbackEmail: sendCustomerFeedbackEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
          const leadDetails = await storage.getServiceRequest(leadId);
          const providerDetails = await storage.getServiceProvider(providerId);
          const categoryDetails = await storage.getServiceCategory(leadDetails?.categoryId);
          if (leadDetails && providerDetails && categoryDetails) {
            const customerDetails = await storage.getUser(leadDetails.customerId);
            if (customerDetails) {
              const customerName = `${customerDetails.firstName || ""} ${customerDetails.lastName || ""}`.trim();
              const providerName = `${providerDetails.firstName || ""} ${providerDetails.lastName || ""}`.trim();
              const reviewToken = await storage.createReviewToken(
                leadDetails.customerId,
                providerId,
                leadId
              );
              await sendCustomerFeedbackEmail2(
                customerDetails.email,
                customerName,
                providerName,
                categoryDetails.name,
                leadDetails.suburb,
                reviewToken
              );
              console.log(`Feedback email sent to ${customerDetails.email} for completed ${categoryDetails.name} job`);
            } else {
              console.error(`Customer not found for customerId: ${leadDetails.customerId}`);
            }
          }
        } catch (emailError) {
          console.error("Error sending customer feedback email:", emailError);
        }
      }
      res.json(updatedStatus);
    } catch (error) {
      console.error("Error updating provider lead status:", error);
      res.status(500).json({ message: "Failed to update lead status" });
    }
  });
  app2.get("/api/provider/lead-statuses", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const statuses = await storage.getProviderLeadStatuses(providerId);
      res.json(statuses);
    } catch (error) {
      console.error("Error getting provider lead statuses:", error);
      res.status(500).json({ message: "Failed to get lead statuses" });
    }
  });
  app2.post("/api/provider/credit/redeem-voucher", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const { voucherCode } = req.body;
      if (!voucherCode) {
        return res.status(400).json({ message: "Voucher code is required" });
      }
      const result2 = await storage.redeemVoucher(providerId, voucherCode);
      res.json(result2);
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      res.status(500).json({ message: "Failed to redeem voucher" });
    }
  });
  app2.get("/api/provider/vouchers/available", isProviderAuthenticated, async (req, res) => {
    try {
      const vouchers = await storage.getAvailableVouchers();
      res.json(vouchers);
    } catch (error) {
      console.error("Error getting available vouchers:", error);
      res.status(500).json({ message: "Failed to get available vouchers" });
    }
  });
  app2.get("/api/provider/billing", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const billingData = await storage.getProviderBillingData(providerId);
      res.json(billingData);
    } catch (error) {
      console.error("Error getting provider billing data:", error);
      res.status(500).json({ message: "Failed to get billing data" });
    }
  });
  app2.get("/api/provider/billing", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const billingData = await storage.getProviderBillingData(providerId);
      res.json(billingData);
    } catch (error) {
      console.error("Error getting provider billing data:", error);
      res.status(500).json({ message: "Failed to get billing data" });
    }
  });
  app2.get("/api/admin/vouchers", isAdminAuthenticated, async (req, res) => {
    try {
      const vouchers = await storage.getAllVouchersAdmin();
      res.json(vouchers);
    } catch (error) {
      console.error("Error getting vouchers for admin:", error);
      res.status(500).json({ message: "Failed to get vouchers" });
    }
  });
  app2.post("/api/admin/vouchers/bulk", isAdminAuthenticated, async (req, res) => {
    try {
      const { vouchers } = req.body;
      if (!vouchers || !Array.isArray(vouchers) || vouchers.length === 0) {
        return res.status(400).json({ message: "Vouchers array is required" });
      }
      for (const voucher of vouchers) {
        if (!voucher.code || !voucher.value || !voucher.description) {
          return res.status(400).json({ message: "Each voucher must have code, value, and description" });
        }
      }
      const vouchersWithDefaults = vouchers.map((voucher) => {
        const now = /* @__PURE__ */ new Date();
        const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
        return {
          ...voucher,
          code: voucher.code.toUpperCase(),
          value: voucher.value.toString(),
          status: "active",
          createdBy: "admin",
          expiryDate
        };
      });
      const result2 = await storage.createBulkVouchersAdmin(vouchersWithDefaults);
      res.status(201).json(result2);
    } catch (error) {
      console.error("Error creating bulk vouchers:", error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "One or more voucher codes already exist" });
      }
      res.status(500).json({ message: "Failed to create vouchers" });
    }
  });
  app2.post("/api/admin/vouchers", isAdminAuthenticated, async (req, res) => {
    try {
      const { code, value, description } = req.body;
      if (!code || !value || !description) {
        return res.status(400).json({ message: "Code, value, and description are required" });
      }
      const now = /* @__PURE__ */ new Date();
      const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
      const voucher = await storage.createVoucherAdmin({
        code: code.toUpperCase(),
        value: value.toString(),
        description,
        status: "active",
        createdBy: "admin",
        expiryDate
      });
      res.status(201).json(voucher);
    } catch (error) {
      console.error("Error creating voucher:", error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "Voucher code already exists" });
      }
      res.status(500).json({ message: "Failed to create voucher" });
    }
  });
  app2.put("/api/admin/vouchers/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { code, value, description, usageLimit, expiresAt, isActive } = req.body;
      const updates = {};
      if (code !== void 0) updates.code = code.toUpperCase();
      if (value !== void 0) updates.value = value.toString();
      if (description !== void 0) updates.description = description;
      if (usageLimit !== void 0) updates.usageLimit = usageLimit;
      if (expiresAt !== void 0) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
      if (isActive !== void 0) updates.isActive = isActive;
      const updatedVoucher = await storage.updateVoucherAdmin(parseInt(id), updates);
      if (!updatedVoucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      res.json(updatedVoucher);
    } catch (error) {
      console.error("Error updating voucher:", error);
      if (error.code === "23505") {
        return res.status(400).json({ message: "Voucher code already exists" });
      }
      res.status(500).json({ message: "Failed to update voucher" });
    }
  });
  app2.put("/api/admin/vouchers/:id/reset", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const resetVoucher = await storage.resetVoucherAdmin(parseInt(id));
      if (!resetVoucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      res.json(resetVoucher);
    } catch (error) {
      console.error("Error resetting voucher:", error);
      res.status(500).json({ message: "Failed to reset voucher" });
    }
  });
  app2.delete("/api/admin/vouchers/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteVoucherAdmin(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      res.json({ message: "Voucher deleted successfully" });
    } catch (error) {
      console.error("Error deleting voucher:", error);
      res.status(500).json({ message: "Failed to delete voucher" });
    }
  });
  app2.post("/api/admin/test-lead-processing", async (req, res) => {
    try {
      const token = req.headers["x-admin-token"];
      if (!token) {
        return res.status(401).json({ message: "Admin token required" });
      }
      const { leadId } = req.body;
      if (!leadId) {
        return res.status(400).json({ message: "Lead ID required" });
      }
      const lead = await storage.getServiceRequest(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      console.log(`Admin test: Processing lead ${leadId} for postcode ${lead.postcode}, category ${lead.categoryId}`);
      await storage.initializeLeadDistribution(leadId);
      const distributionLogs = await db.select().from(leadDistributionLog).where(eq2(leadDistributionLog.requestId, leadId));
      const offers = await db.select().from(leadOffers).where(eq2(leadOffers.requestId, leadId));
      res.json({
        message: `Lead ${leadId} processed successfully`,
        leadDetails: {
          id: lead.id,
          postcode: lead.postcode,
          categoryId: lead.categoryId,
          status: lead.status
        },
        results: {
          offersCreated: offers.length,
          distributionPhases: distributionLogs.length,
          providers: offers.map((o) => ({ providerId: o.providerId, status: o.status, offerType: o.offerType }))
        }
      });
    } catch (error) {
      console.error("Admin test lead processing error:", error);
      res.status(500).json({ message: "Failed to process lead", error: error.message });
    }
  });
  app2.post("/api/admin/test-push-notification", async (req, res) => {
    try {
      const token = req.headers["x-admin-token"];
      if (!token) {
        return res.status(401).json({ message: "Admin token required" });
      }
      const { providerId, title, message } = req.body;
      if (!providerId) {
        return res.status(400).json({ message: "Provider ID required" });
      }
      console.log(`\u{1F9EA} Admin test: Sending push notification to provider ${providerId}`);
      const { providerNotificationService: providerNotificationService2 } = await Promise.resolve().then(() => (init_providerNotificationService(), providerNotificationService_exports));
      const result2 = await providerNotificationService2.sendNotificationToProvider(parseInt(providerId), {
        title: title || "Test Notification from Admin",
        message: message || `Test push notification sent at ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
        type: "system",
        data: {
          test: true,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          adminTriggered: true
        }
      });
      if (result2) {
        res.json({
          message: `Push notification sent to provider ${providerId}`,
          success: true
        });
      } else {
        res.status(500).json({
          message: "Failed to send push notification",
          success: false
        });
      }
    } catch (error) {
      console.error("Error in test push notification:", error);
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });
  app2.get("/api/admin/departments", isAdminAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error getting departments:", error);
      res.status(500).json({ message: "Failed to get departments" });
    }
  });
  app2.post("/api/admin/departments", isAdminAuthenticated, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Department name is required" });
      }
      const departmentData = {
        name: name.trim(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Failed to create department" });
    }
  });
  app2.put("/api/admin/departments/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Department name is required" });
      }
      const updatedDepartment = await storage.updateDepartment(parseInt(id), {
        name: name.trim()
      });
      res.json(updatedDepartment);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ message: "Failed to update department" });
    }
  });
  app2.delete("/api/admin/departments/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDepartment(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({ message: "Failed to delete department" });
    }
  });
  app2.get("/api/admin/current-user", isAdminAuthenticated, async (req, res) => {
    try {
      const adminInfo = req.admin;
      const username = adminInfo.username;
      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      const { password, ...userInfo } = user;
      res.json(userInfo);
    } catch (error) {
      console.error("Error fetching current admin user:", error);
      res.status(500).json({ message: "Failed to fetch current user" });
    }
  });
  app2.get("/api/admin/users", isAdminAuthenticated, async (req, res) => {
    try {
      const token = req.headers["x-admin-token"];
      const decoded = jwt2.verify(token, process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key");
      const currentAdminUser = await storage.getAdminUserByUsername(decoded.username);
      const users2 = await storage.getAllAdminUsers();
      const canSeeAllUsers = currentAdminUser?.username === "admin" || currentAdminUser?.role === "super_admin" || currentAdminUser?.role === "Administrator";
      const filteredUsers = canSeeAllUsers ? users2 : users2.filter((user) => user.role !== "super_admin" && user.username !== "admin");
      const usersWithDepartments = await Promise.all(
        filteredUsers.map(async (user) => {
          const departments = await storage.getUserDepartments(user.id);
          return { ...user, departments };
        })
      );
      res.json(usersWithDepartments);
    } catch (error) {
      console.error("Error getting admin users:", error);
      res.status(500).json({ message: "Failed to get admin users" });
    }
  });
  app2.get("/api/admin/users/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getAdminUser(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const departments = await storage.getUserDepartments(user.id);
      res.json({ ...user, departments });
    } catch (error) {
      console.error("Error getting admin user:", error);
      res.status(500).json({ message: "Failed to get admin user" });
    }
  });
  app2.post("/api/admin/users", isAdminAuthenticated, async (req, res) => {
    try {
      const { username, firstName, lastName, email, password, role, departmentIds = [] } = req.body;
      if (!username || !firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({
          message: "Username, first name, last name, email, password, and role are required"
        });
      }
      const validRoles = ["super_admin", "Administrator", "Manager", "Team Member"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Role must be super_admin, Administrator, Manager, or Team Member"
        });
      }
      const token = req.headers["x-admin-token"];
      const decoded = jwt2.verify(token, process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key");
      const currentAdminUser = await storage.getAdminUserByUsername(decoded.username);
      if (!currentAdminUser) {
        return res.status(404).json({ message: "Current admin user not found" });
      }
      if (role === "super_admin" && currentAdminUser.username !== "admin") {
        return res.status(403).json({
          message: "Only super admin can create users with super_admin role"
        });
      }
      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword3(password);
      const userData = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: hashedPassword,
        role,
        status: "active",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      const user = await storage.createAdminUser(userData);
      if (departmentIds.length > 0) {
        await storage.updateUserDepartments(user.id, departmentIds);
      }
      const departments = await storage.getUserDepartments(user.id);
      res.status(201).json({ ...user, departments });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });
  app2.put("/api/admin/users/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { username, firstName, lastName, email, password, role, status, departmentIds = [] } = req.body;
      if (!username || !firstName || !lastName || !email || !role || !status) {
        return res.status(400).json({
          message: "Username, first name, last name, email, role, and status are required"
        });
      }
      const trimmedRole = role?.trim();
      const validRoles = ["super_admin", "Administrator", "Manager", "Team Member"];
      if (!trimmedRole || !validRoles.includes(trimmedRole)) {
        console.log("Invalid role received:", role, "Valid roles:", validRoles);
        return res.status(400).json({
          message: "Role must be super_admin, Administrator, Manager, or Team Member"
        });
      }
      const token = req.headers["x-admin-token"];
      const decoded = jwt2.verify(token, process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key");
      const currentAdminUser = await storage.getAdminUserByUsername(decoded.username);
      if (!currentAdminUser) {
        return res.status(404).json({ message: "Current admin user not found" });
      }
      if (trimmedRole === "super_admin" && currentAdminUser.username !== "admin") {
        return res.status(403).json({
          message: "Only super admin can assign or change role to super_admin"
        });
      }
      const validStatuses = ["active", "inactive"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status must be active or inactive"
        });
      }
      if (password && password.length > 0) {
        if (password.length < 8) {
          return res.status(400).json({
            message: "Password must be at least 8 characters long"
          });
        }
      }
      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const targetUser = await storage.getAdminUser(parseInt(id));
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (targetUser.username === "admin" && password && password.length > 0) {
        if (currentAdminUser.username !== "admin" || currentAdminUser.id !== targetUser.id) {
          return res.status(403).json({
            message: "Password changes for the super admin user are only allowed when logged in as super admin"
          });
        }
      }
      const updates = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role: trimmedRole,
        status
      };
      if (password && password.length > 0) {
        if (targetUser.username === "admin" && (currentAdminUser.username !== "admin" || currentAdminUser.id !== targetUser.id)) {
          return res.status(403).json({
            message: "Password changes for the super admin user are only allowed when logged in as super admin"
          });
        }
        const hashedPassword = await hashPassword3(password);
        updates.password = hashedPassword;
      }
      const updatedUser = await storage.updateAdminUser(parseInt(id), updates);
      await storage.updateUserDepartments(parseInt(id), departmentIds);
      const departments = await storage.getUserDepartments(parseInt(id));
      res.json({ ...updatedUser, departments });
    } catch (error) {
      console.error("Error updating admin user:", error);
      res.status(500).json({ message: "Failed to update admin user" });
    }
  });
  app2.delete("/api/admin/users/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getAdminUser(parseInt(id));
      if (user && (user.id === 1 || user.username === "admin")) {
        return res.status(403).json({ message: "Cannot delete main admin user" });
      }
      const success = await storage.deleteAdminUser(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin user:", error);
      res.status(500).json({ message: "Failed to delete admin user" });
    }
  });
  app2.post("/api/admin/change-password", isAdminAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.headers["x-admin-token"];
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }
      const decoded = jwt2.verify(token, process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key");
      const username = decoded.username;
      const adminUser = await storage.getAdminUserByUsername(username);
      if (!adminUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      const isCurrentPasswordValid = await comparePasswords3(currentPassword, adminUser.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedNewPassword = await hashPassword3(newPassword);
      await storage.updateAdminUser(adminUser.id, { password: hashedNewPassword });
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.post("/api/admin/users/:id/change-password", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      const token = req.headers["x-admin-token"];
      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }
      const decoded = jwt2.verify(token, process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key");
      const currentAdminUser = await storage.getAdminUserByUsername(decoded.username);
      if (!currentAdminUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      if (currentAdminUser.role !== "Administrator") {
        return res.status(403).json({ message: "Only administrators can change passwords for other users" });
      }
      const targetUser = await storage.getAdminUser(parseInt(id));
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (targetUser.role === "Administrator" && targetUser.id !== currentAdminUser.id) {
        return res.status(403).json({ message: "Cannot change password for other administrators" });
      }
      const hashedNewPassword = await hashPassword3(newPassword);
      await storage.updateAdminUser(parseInt(id), { password: hashedNewPassword });
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing user password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.post("/api/provider/change-password", isProviderAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const providerId = req.provider?.id;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const provider = await storage.getProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      const isCurrentPasswordValid = await comparePasswords3(currentPassword, provider.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedNewPassword = await hashPassword3(newPassword);
      await storage.updateProvider(providerId, { password: hashedNewPassword });
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing provider password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.get("/api/review/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const reviewData = await storage.getReviewToken(token);
      if (!reviewData) {
        return res.status(404).json({ message: "Review token not found or expired" });
      }
      if (reviewData.isUsed) {
        return res.status(400).json({ message: "Review has already been submitted" });
      }
      const now = /* @__PURE__ */ new Date();
      if (new Date(reviewData.expiresAt) < now) {
        return res.status(400).json({ message: "Review token has expired" });
      }
      res.json(reviewData);
    } catch (error) {
      console.error("Error getting review token:", error);
      res.status(500).json({ message: "Failed to get review details" });
    }
  });
  app2.post("/api/review/submit", async (req, res) => {
    try {
      const reviewData = req.body;
      if (!reviewData.token || !reviewData.overallRating || !reviewData.qualityRating || !reviewData.professionalismRating || !reviewData.timelinessRating || !reviewData.valueRating) {
        return res.status(400).json({ message: "All rating fields are required" });
      }
      const ratings = [
        reviewData.overallRating,
        reviewData.qualityRating,
        reviewData.professionalismRating,
        reviewData.timelinessRating,
        reviewData.valueRating
      ];
      for (const rating of ratings) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          return res.status(400).json({ message: "Ratings must be integers between 1 and 5" });
        }
      }
      const tokenData = await storage.getReviewToken(reviewData.token);
      if (!tokenData) {
        return res.status(404).json({ message: "Invalid review token" });
      }
      if (tokenData.isUsed) {
        return res.status(400).json({ message: "Review has already been submitted" });
      }
      if (new Date(tokenData.expiresAt) < /* @__PURE__ */ new Date()) {
        return res.status(400).json({ message: "Review token has expired" });
      }
      reviewData.customerId = tokenData.customerId;
      reviewData.providerId = tokenData.providerId;
      reviewData.requestId = tokenData.requestId;
      const review = await storage.submitCustomerReview(reviewData);
      res.json({
        success: true,
        message: "Thank you for your review! Your feedback helps improve our service quality.",
        review
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({
        message: error.message.includes("already submitted") ? error.message : "Failed to submit review"
      });
    }
  });
  app2.get("/api/provider/:id/reviews", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const reviews = await storage.getProviderReviews(providerId);
      res.json(reviews);
    } catch (error) {
      console.error("Error getting provider reviews:", error);
      res.status(500).json({ message: "Failed to get provider reviews" });
    }
  });
  app2.get("/api/customer/reviews", isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      const reviews = await storage.getCustomerReviews(customerId);
      res.json(reviews);
    } catch (error) {
      console.error("Error getting customer reviews:", error);
      res.status(500).json({ message: "Failed to get customer reviews" });
    }
  });
  app2.get("/api/customer/lead-settings", isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      const settings = await storage.getLeadSettings();
      res.json({
        providersCanRedeemCredits: settings.providersCanRedeemCredits
      });
    } catch (error) {
      console.error("Error getting customer lead settings:", error);
      res.status(500).json({ message: "Failed to get customer lead settings" });
    }
  });
  app2.get("/api/customer/credit-balance", isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      const balance = await storage.getCustomerCreditBalance(customerId);
      res.json({ balance });
    } catch (error) {
      console.error("Error getting customer credit balance:", error);
      res.status(500).json({ message: "Failed to get credit balance" });
    }
  });
  app2.get("/api/customer/credit-transactions", isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      const transactions = await storage.getCustomerCreditTransactions(customerId);
      res.json(transactions);
    } catch (error) {
      console.error("Error getting customer credit transactions:", error);
      res.status(500).json({ message: "Failed to get credit transactions" });
    }
  });
  app2.post("/api/customer/redeem-voucher", isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      const { voucherCode } = req.body;
      if (!voucherCode) {
        return res.status(400).json({ message: "Voucher code is required" });
      }
      const result2 = await storage.redeemCustomerVoucher(customerId, voucherCode);
      res.json(result2);
    } catch (error) {
      console.error("Error redeeming customer voucher:", error);
      res.status(500).json({ message: "Failed to redeem voucher" });
    }
  });
  app2.get("/api/customer/available-vouchers", isAuthenticated, async (req, res) => {
    try {
      const vouchers = await storage.getAvailableCustomerVouchers();
      res.json(vouchers);
    } catch (error) {
      console.error("Error getting available customer vouchers:", error);
      res.status(500).json({ message: "Failed to get available vouchers" });
    }
  });
  app2.get("/api/admin/potential-customers", isAdminAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getAllPotentialCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error getting potential customers:", error);
      res.status(500).json({ message: "Failed to get potential customers" });
    }
  });
  app2.get("/api/admin/potential-customers/import-groups", isAdminAuthenticated, async (req, res) => {
    try {
      const groups = await storage.getPotentialCustomerImportGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error getting potential customer import groups:", error);
      res.status(500).json({ message: "Failed to get import groups" });
    }
  });
  app2.put("/api/admin/potential-customers/:id/status", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: "Customer ID and status are required" });
      }
      await storage.updatePotentialCustomerCampaignStatus(parseInt(id), status);
      res.json({ success: true, message: "Customer status updated successfully" });
    } catch (error) {
      console.error("Error updating customer status:", error);
      res.status(500).json({ error: "Failed to update customer status" });
    }
  });
  app2.post("/api/admin/potential-customers/import", isAdminAuthenticated, csvUpload.single("file"), async (req, res) => {
    try {
      console.log("\u{1F4E5} Import request received:");
      console.log("  req.body:", req.body);
      console.log("  req.file:", req.file ? { name: req.file.originalname, size: req.file.size } : "No file");
      console.log("  req.body keys:", Object.keys(req.body));
      console.log("  req.body.importName:", req.body.importName);
      const importName = req.body.importName;
      if (!importName) {
        console.log("\u274C Returning error: Import name is required");
        console.log("  Available in req.body:", Object.keys(req.body));
        console.log("  req.body content:", req.body);
        return res.status(400).json({ message: "Import name is required" });
      }
      console.log("Processing import with name:", importName);
      if (!req.file) {
        console.log("No file provided, using sample data");
        const result3 = await storage.importPotentialCustomers(null, importName);
        res.json(result3);
        return;
      }
      const uploadedFile = {
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        data: fs2.readFileSync(req.file.path)
      };
      console.log("Processing file upload:", uploadedFile.name);
      console.log("File object details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype
      });
      const result2 = await storage.importPotentialCustomers(uploadedFile, importName);
      fs2.unlinkSync(req.file.path);
      res.json(result2);
    } catch (error) {
      console.error("Error importing potential customers:", error);
      res.status(500).json({ message: "Failed to import customers" });
    }
  });
  app2.post(
    "/api/admin/potential-customers/send-sms",
    isAdminAuthenticated,
    async (req, res) => {
      try {
        const { customerIds } = req.body;
        console.log("\u{1F4E9} Incoming SMS Request - Customer IDs:", customerIds);
        if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
          console.warn("\u26A0\uFE0F No customer IDs provided in SMS request");
          return res.status(400).json({ message: "No customer IDs provided" });
        }
        const result2 = await storage.sendSmsToPotentialCustomers(customerIds);
        console.log("\u2705 SMS Sending Result (summary):", { count: result2.count });
        console.table(result2.details || []);
        res.json(result2);
      } catch (error) {
        console.error("\u274C Error sending SMS to potential customers:", error);
        res.status(500).json({ message: "Failed to send SMS" });
      }
    }
  );
  app2.post(
    "/api/admin/campaigns/execute",
    isAdminAuthenticated,
    async (req, res) => {
      try {
        const {
          campaignId,
          messageTemplate,
          voucherAmount,
          customerIds,
          adminName
        } = req.body;
        console.log("\u{1F3AF} Executing campaign with unique vouchers:", {
          campaignId,
          voucherAmount,
          customerCount: customerIds?.length
        });
        if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
          return res.status(400).json({ message: "No customer IDs provided" });
        }
        if (!messageTemplate || !voucherAmount) {
          return res.status(400).json({ message: "Message template and voucher amount are required" });
        }
        const results = [];
        let successCount = 0;
        let failureCount = 0;
        for (const customerId of customerIds) {
          try {
            const [customer] = await db.select().from(potentialCustomers).where(eq2(potentialCustomers.id, customerId));
            if (!customer) {
              console.warn(`[Campaign] Customer not found: id=${customerId}`);
              results.push({
                customerId,
                name: "",
                phone: "",
                status: "skipped",
                sent: false,
                reason: "not_found",
                voucherCode: null
              });
              failureCount++;
              continue;
            }
            const raw = (customer.phone || "").toString();
            const digits = raw.replace(/[^0-9+]/g, "");
            const normalizedPhone = digits.startsWith("+61") ? digits : digits.startsWith("61") ? `+${digits}` : digits.startsWith("0") ? `+61${digits.slice(1)}` : null;
            if (!normalizedPhone) {
              console.warn(`[Campaign] Invalid phone format: id=${customer.id} phone=${customer.phone}`);
              results.push({
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                status: "skipped",
                sent: false,
                reason: "invalid_phone",
                voucherCode: null
              });
              failureCount++;
              continue;
            }
            const voucherResult = await smsService.sendSmsWithVoucher(
              normalizedPhone,
              customer.name,
              messageTemplate,
              voucherAmount,
              {
                customerId: customer.id,
                adminName: adminName || "admin",
                smsType: "campaign"
              }
            );
            if (voucherResult.success) {
              await storage.updatePotentialCustomerSmsStatus(customer.id, "1st_sent");
              results.push({
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                status: "sent",
                sent: true,
                voucherCode: voucherResult.voucherCode,
                message: voucherResult.message
              });
              successCount++;
              console.log(`[Campaign] \u2705 Sent to ${customer.name} with voucher ${voucherResult.voucherCode}`);
            } else {
              results.push({
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                status: "failed",
                sent: false,
                reason: voucherResult.message || "SMS send failed",
                voucherCode: null
              });
              failureCount++;
              console.log(`[Campaign] \u274C Failed to send to ${customer.name}: ${voucherResult.message}`);
            }
          } catch (error) {
            console.error(`[Campaign] Error processing customer ${customerId}:`, error);
            results.push({
              customerId,
              name: "",
              phone: "",
              status: "failed",
              sent: false,
              reason: "processing_error",
              voucherCode: null
            });
            failureCount++;
          }
        }
        console.log(`[Campaign] Execution complete: ${successCount} sent, ${failureCount} failed`);
        res.json({
          success: true,
          campaignId,
          totalCustomers: customerIds.length,
          sent: successCount,
          failed: failureCount,
          results
        });
      } catch (error) {
        console.error("\u274C Error executing campaign:", error);
        res.status(500).json({ message: "Failed to execute campaign" });
      }
    }
  );
  app2.post("/api/admin/reports/users", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const { fromDate, toDate } = req.body;
      if (!fromDate || !toDate) {
        return res.status(400).json({ message: "Date range is required" });
      }
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const userReports = await storage.getUserReports(from, to);
      res.json(userReports);
    } catch (error) {
      console.error("Error getting user reports:", error);
      res.status(500).json({ message: "Failed to get user reports" });
    }
  });
  app2.get("/api/admin/terms-conditions", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const terms = await storage.getTermsAndConditions();
      res.json(terms);
    } catch (error) {
      console.error("Error getting terms and conditions:", error);
      res.status(500).json({ message: "Failed to get terms and conditions" });
    }
  });
  app2.put("/api/admin/terms-conditions", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const { providersTerms, customersTerms, websiteTerms } = req.body;
      const updatedTerms = await storage.updateTermsAndConditions({
        providersTerms,
        customersTerms,
        websiteTerms
      });
      res.json(updatedTerms);
    } catch (error) {
      console.error("Error updating terms and conditions:", error);
      res.status(500).json({ message: "Failed to update terms and conditions" });
    }
  });
  app2.get("/api/provider/lead-settings", isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: "Provider authentication required" });
      }
      const settings = await storage.getLeadSettings();
      res.json({
        freeLeadsEnabled: settings.freeLeadsEnabled,
        providersCanRedeemCredits: settings.providersCanRedeemCredits
      });
    } catch (error) {
      console.error("Error getting lead settings:", error);
      res.status(500).json({ message: "Failed to get lead settings" });
    }
  });
  app2.get("/api/admin/lead-management-settings", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const settings = await storage.getLeadManagementSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error getting lead management settings:", error);
      res.status(500).json({ message: "Failed to get lead management settings" });
    }
  });
  app2.put("/api/admin/lead-management-settings", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const updatedSettings = await storage.updateLeadManagementSettings(req.body);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating lead management settings:", error);
      res.status(500).json({ message: "Failed to update lead management settings" });
    }
  });
  app2.post("/api/admin/service-categories", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const newCategory = await storage.createServiceCategory(req.body);
      res.json(newCategory);
    } catch (error) {
      console.error("Error creating service category:", error);
      res.status(500).json({ message: "Failed to create service category" });
    }
  });
  app2.put("/api/admin/service-categories/:id", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const categoryId = parseInt(req.params.id);
      const updatedCategory = await storage.updateServiceCategory(categoryId, req.body);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating service category:", error);
      res.status(500).json({ message: "Failed to update service category" });
    }
  });
  app2.delete("/api/admin/service-categories/:id", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"];
      if (!adminToken) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      const categoryId = parseInt(req.params.id);
      const deleted = await storage.deleteServiceCategory(categoryId);
      if (deleted) {
        res.json({ message: "Service category deleted successfully" });
      } else {
        res.status(404).json({ message: "Service category not found" });
      }
    } catch (error) {
      console.error("Error deleting service category:", error);
      res.status(500).json({ message: error.message || "Failed to delete service category" });
    }
  });
  app2.post("/api/admin/service-categories/:id/image", isAdminAuthenticated, upload.single("image"), async (req, res) => {
    try {
      console.log("Image upload endpoint called");
      console.log("Headers:", req.headers);
      console.log("File:", req.file);
      console.log("Body:", req.body);
      if (!req.file) {
        console.log("No file provided");
        return res.status(400).json({ message: "No image file provided" });
      }
      const categoryId = parseInt(req.params.id);
      console.log("Category ID:", categoryId);
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log("Image URL:", imageUrl);
      const updatedCategory = await storage.updateServiceCategoryImage(categoryId, imageUrl);
      console.log("Updated category:", updatedCategory);
      if (updatedCategory) {
        res.json({
          message: "Image uploaded successfully",
          imageUrl,
          category: updatedCategory
        });
      } else {
        res.status(404).json({ message: "Service category not found" });
      }
    } catch (error) {
      console.error("Error uploading service category image:", error);
      res.status(500).json({ message: error.message || "Failed to upload image" });
    }
  });
  app2.get("/api/admin/potential-customers", isAdminAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getAllPotentialCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error getting potential customers:", error);
      res.status(500).json({ message: "Failed to get potential customers" });
    }
  });
  app2.get("/api/admin/potential-customers/import-groups", isAdminAuthenticated, async (req, res) => {
    try {
      const groups = await storage.getPotentialCustomerImportGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error getting import groups:", error);
      res.status(500).json({ message: "Failed to get import groups" });
    }
  });
  app2.post("/api/admin/potential-customers/import", isAdminAuthenticated, async (req, res) => {
    try {
      const { importName } = req.body;
      const file = req.files?.file;
      if (!file || !importName) {
        return res.status(400).json({ message: "File and import name are required" });
      }
      const result2 = await storage.importPotentialCustomers(file, importName);
      res.json(result2);
    } catch (error) {
      console.error("Error importing potential customers:", error);
      res.status(500).json({ message: error.message || "Failed to import potential customers" });
    }
  });
  app2.post("/api/admin/potential-customers/:id/send-sms", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { message, customMessage } = req.body;
      if (!id) {
        return res.status(400).json({ message: "Customer ID is required" });
      }
      const [customer] = await db.select().from(potentialCustomers).where(eq2(potentialCustomers.id, parseInt(id)));
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      let smsType;
      if (customer.smsDeliveryStatus === "not_sent" || !customer.smsDeliveryStatus) {
        smsType = "1st_sent";
      } else if (customer.smsDeliveryStatus === "1st_sent") {
        smsType = "2nd_sent";
      } else {
        return res.status(400).json({ message: "Maximum SMS limit reached for this customer" });
      }
      let smsSent;
      if (customMessage) {
        smsSent = await smsService.sendSms(customer.phone, customMessage, {
          customerId: customer.id,
          smsType
        });
        smsService.recordOutbound({
          recipientType: "potential_customer",
          recipientId: customer.id,
          recipientPhone: customer.phone,
          recipientName: customer.name,
          message: customMessage,
          smsType: "custom",
          sentBy: req.admin?.username || "admin",
          status: "sent"
        });
      } else {
        const raw = (customer.phone || "").toString();
        const digits = raw.replace(/[^0-9+]/g, "");
        const normalizedPhone = digits.startsWith("+61") ? digits : digits.startsWith("61") ? `+${digits}` : digits.startsWith("0") ? `+61${digits.slice(1)}` : null;
        if (!normalizedPhone) {
          return res.status(400).json({ message: "Invalid phone format for this customer" });
        }
        const templateMessage = smsType === "1st_sent" ? `Hi ${customer.name}! \u{1F44B} 

ServicePanda here! We noticed you might be looking for reliable service providers in your area.

We have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?

Reply YES to get started, or visit our website for more info.

Best regards,
ServicePanda Team` : `Hi ${customer.name}! 

Just following up on our previous message about ServicePanda's verified service providers.

We're here to connect you with trusted professionals in your area. No obligation, just quality service connections.

Reply YES to learn more, or call us directly.

ServicePanda Team`;
        smsSent = await smsService.sendSms(normalizedPhone, templateMessage, { customerId: customer.id, smsType });
        smsService.recordOutbound({
          recipientType: "potential_customer",
          recipientId: customer.id,
          recipientPhone: customer.phone,
          recipientName: customer.name,
          message: templateMessage,
          smsType,
          sentBy: req.admin?.username || "admin",
          status: "sent"
        });
      }
      if (smsSent) {
        await storage.updatePotentialCustomerSmsStatus(parseInt(id), smsType);
        res.json({
          success: true,
          message: `SMS ${smsType} sent successfully to ${customer.name}`,
          smsType,
          customerId: customer.id
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send SMS"
        });
      }
    } catch (error) {
      console.error("Error sending individual SMS:", error);
      res.status(500).json({ message: error.message || "Failed to send SMS" });
    }
  });
  app2.get("/api/admin/sms/status", isAdminAuthenticated, async (req, res) => {
    try {
      const status = smsService.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting SMS service status:", error);
      res.status(500).json({ message: "Failed to get SMS service status" });
    }
  });
  app2.get("/api/admin/sms/messages", isAdminAuthenticated, async (req, res) => {
    try {
      res.set("Cache-Control", "no-store");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.set("ETag", `${Date.now()}`);
      try {
        await db.execute(sql2`CREATE TABLE IF NOT EXISTS sms_messages (
          id SERIAL PRIMARY KEY,
          recipient_type VARCHAR(20) NOT NULL,
          recipient_id INTEGER,
          recipient_phone VARCHAR NOT NULL,
          recipient_name VARCHAR,
          message TEXT NOT NULL,
          direction VARCHAR(20) NOT NULL,
          status VARCHAR(20) DEFAULT 'sent',
          sms_type VARCHAR(20),
          sent_by VARCHAR,
          sent_at TIMESTAMP DEFAULT NOW(),
          delivered_at TIMESTAMP,
          read_at TIMESTAMP,
          api_response TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );`);
        const rows = await db.select().from(smsMessages).orderBy(desc2(smsMessages.sentAt));
        if (!rows || rows.length === 0) {
          const logs = smsService.getLogs();
          return res.status(200).json(logs);
        }
        return res.status(200).json(rows);
      } catch (e) {
        console.warn("DB fetch for sms_messages failed, falling back to in-memory logs");
        const logs = smsService.getLogs();
        return res.status(200).json(logs);
      }
    } catch (error) {
      console.error("Error getting SMS messages:", error);
      res.status(500).json({ message: "Failed to get SMS messages" });
    }
  });
  app2.post("/api/admin/sms/messages/debug-add", isAdminAuthenticated, async (req, res) => {
    try {
      const { recipientPhone = "+61400000000", recipientName = "Debug User", message = "Test SMS from debug endpoint" } = req.body || {};
      await db.execute(sql2`CREATE TABLE IF NOT EXISTS sms_messages (
        id SERIAL PRIMARY KEY,
        recipient_type VARCHAR(20) NOT NULL,
        recipient_id INTEGER,
        recipient_phone VARCHAR NOT NULL,
        recipient_name VARCHAR,
        message TEXT NOT NULL,
        direction VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'sent',
        sms_type VARCHAR(20),
        sent_by VARCHAR,
        sent_at TIMESTAMP DEFAULT NOW(),
        delivered_at TIMESTAMP,
        read_at TIMESTAMP,
        api_response TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`);
      await db.insert(smsMessages).values({
        recipientType: "potential_customer",
        recipientPhone,
        recipientName,
        message,
        direction: "outbound",
        status: "sent",
        sentBy: req.admin?.username || "admin",
        sentAt: /* @__PURE__ */ new Date(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      res.json({ success: true });
    } catch (error) {
      console.error("debug-add sms failed:", error);
      res.status(500).json({ success: false, message: "Failed to insert debug sms" });
    }
  });
  app2.get("/api/admin/potential-providers", isAdminAuthenticated, async (req, res) => {
    try {
      const adminUsername = req.admin?.username;
      const adminRole = req.admin?.role;
      const isSuperAdmin = adminRole === "administrator" || adminRole === "super_admin";
      console.log("Admin username from request:", adminUsername);
      console.log("Admin role:", adminRole);
      console.log("Is super admin:", isSuperAdmin);
      const providers = await storage.getAllPotentialProviders(adminUsername, isSuperAdmin);
      res.json(providers);
    } catch (error) {
      console.error("Error getting potential providers:", error);
      res.status(500).json({ message: "Failed to get potential providers" });
    }
  });
  app2.post("/api/admin/potential-providers", isAdminAuthenticated, async (req, res) => {
    try {
      const providerData = req.body;
      const result2 = await storage.createPotentialProvider(providerData);
      res.json(result2);
    } catch (error) {
      console.error("Error creating potential provider:", error);
      res.status(500).json({ message: "Failed to create potential provider" });
    }
  });
  app2.post("/api/admin/potential-providers/import", isAdminAuthenticated, async (req, res) => {
    try {
      const { importName, csvData } = req.body;
      if (!importName) {
        return res.status(400).json({ message: "Import name is required" });
      }
      const result2 = await storage.importPotentialProviders(csvData, importName);
      res.json(result2);
    } catch (error) {
      console.error("Error importing potential providers:", error);
      res.status(500).json({ message: "Failed to import potential providers" });
    }
  });
  app2.post("/api/admin/potential-providers/confirm-import", isAdminAuthenticated, async (req, res) => {
    try {
      const { importId, providers } = req.body;
      if (!providers || !Array.isArray(providers)) {
        return res.status(400).json({ message: "Providers data is required" });
      }
      const result2 = await storage.confirmPotentialProvidersImport(providers);
      res.json(result2);
    } catch (error) {
      console.error("Error confirming potential providers import:", error);
      res.status(500).json({ message: "Failed to confirm import" });
    }
  });
  app2.patch("/api/admin/potential-providers/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result2 = await storage.updatePotentialProvider(parseInt(id), updateData);
      res.json(result2);
    } catch (error) {
      console.error("Error updating potential provider:", error);
      res.status(500).json({ message: "Failed to update potential provider" });
    }
  });
  app2.post("/api/admin/potential-providers/tasks", isAdminAuthenticated, async (req, res) => {
    try {
      const taskData = req.body;
      const result2 = await storage.createPotentialProviderTask(taskData);
      res.json(result2);
    } catch (error) {
      console.error("Error creating potential provider task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  app2.post("/api/admin/potential-providers/email", isAdminAuthenticated, async (req, res) => {
    try {
      const { potentialProviderId, subject, content } = req.body;
      const result2 = await storage.sendEmailToPotentialProvider(potentialProviderId, subject, content);
      res.json(result2);
    } catch (error) {
      console.error("Error sending email to potential provider:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  app2.post("/api/admin/potential-providers/sms", isAdminAuthenticated, async (req, res) => {
    try {
      const { potentialProviderId, content } = req.body;
      const result2 = await storage.sendSmsToPotentialProvider(potentialProviderId, content);
      res.json(result2);
    } catch (error) {
      console.error("Error sending SMS to potential provider:", error);
      res.status(500).json({ message: "Failed to send SMS" });
    }
  });
  app2.post("/api/admin/potential-providers/:id/convert", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const result2 = await storage.convertPotentialProviderToProvider(parseInt(id));
      res.json(result2);
    } catch (error) {
      console.error("Error converting potential provider:", error);
      res.status(500).json({ message: "Failed to convert provider" });
    }
  });
  app2.get("/api/admin/reports/providers", isAdminAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getProviderReports();
      res.json(reports);
    } catch (error) {
      console.error("Error getting provider reports:", error);
      res.status(500).json({ message: "Failed to get provider reports" });
    }
  });
  app2.post("/api/admin/emails/fetch-imap", isAdminAuthenticated, async (req, res) => {
    try {
      const { email, password, fetchAll = true } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const adminUser = await storage.getAdminUserByUsername(req.admin?.username);
      const adminUserId = adminUser?.id?.toString() || req.admin?.username || "admin";
      const { fetchAndStoreEmails: fetchAndStoreEmails2 } = await Promise.resolve().then(() => (init_imapService(), imapService_exports));
      const result2 = await fetchAndStoreEmails2(email, password, adminUserId, fetchAll);
      if (result2.success) {
        res.json({
          success: true,
          message: `Successfully fetched ${result2.count} emails from ${email}`,
          count: result2.count
        });
      } else {
        res.status(500).json({
          success: false,
          message: result2.error || "Failed to fetch emails",
          error: result2.error
        });
      }
    } catch (error) {
      console.error("Error fetching emails from IMAP:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch emails from IMAP"
      });
    }
  });
  app2.get("/api/admin/emails", isAdminAuthenticated, async (req, res) => {
    try {
      const { tab, user, search, fromDate, toDate } = req.query;
      let userIdForFilter = user || "all";
      if (userIdForFilter && userIdForFilter !== "all" && userIdForFilter !== "admin") {
        const isNumeric = /^\d+$/.test(userIdForFilter);
        if (!isNumeric) {
          try {
            const adminUser = await storage.getAdminUserByUsername(userIdForFilter);
            if (adminUser) {
              userIdForFilter = adminUser.id.toString();
              console.log("Converted username to numeric ID:", userIdForFilter, "for user:", adminUser.username);
            } else {
              console.warn("Admin user not found for username:", userIdForFilter);
            }
          } catch (error) {
            console.error("Error converting username to ID:", error);
          }
        }
      }
      const emails2 = await storage.getEmails({
        tab: tab || "inbox",
        userId: userIdForFilter,
        search: search || "",
        fromDate: fromDate || "",
        toDate: toDate || "",
        isAdmin: true
      });
      res.json(emails2);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });
  app2.post("/api/test/email", async (req, res) => {
    try {
      const { to, subject, body } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({ message: "To, subject, and body are required" });
      }
      const mailgunKeys = await storage.getDecryptedMailgunKeys();
      if (!mailgunKeys) {
        return res.status(500).json({
          message: "Email service not configured. Please configure Mailgun settings first.",
          mailgunConfigured: false
        });
      }
      const emailSent = await sendEmail({
        to,
        subject,
        text: body,
        html: body
      });
      if (emailSent) {
        res.json({
          success: true,
          message: "Test email sent successfully",
          mailgunConfigured: true
        });
      } else {
        res.status(500).json({
          message: "Test email failed to send",
          mailgunConfigured: true
        });
      }
    } catch (error) {
      console.error("Error in test email:", error);
      res.status(500).json({
        message: "Test email error: " + (error instanceof Error ? error.message : "Unknown error"),
        mailgunConfigured: false
      });
    }
  });
  app2.patch("/api/admin/emails/:id/status", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, folder } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const updatedEmail = await storage.updateEmailStatus(parseInt(id), status);
      res.json({
        message: "Email status updated successfully",
        email: updatedEmail
      });
    } catch (error) {
      console.error("Error updating email status:", error);
      res.status(500).json({ message: "Failed to update email status", error: error.message });
    }
  });
  app2.get("/api/admin/email-templates", isAdminAuthenticated, async (req, res) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });
  app2.post("/api/admin/emails/send", isAdminAuthenticated, async (req, res) => {
    console.log("Hello");
    try {
      const { to, cc, bcc, subject, body, template, status } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({ message: "To, subject, and body are required" });
      }
      const adminUser = await storage.getAdminUserByUsername(req.admin?.username);
      const adminUserId = adminUser?.id?.toString() || req.admin?.username || "admin";
      console.log("Admin user lookup:", { username: req.admin?.username, adminUser, adminUserId });
      const adminEmail = adminUser?.email || "";
      const adminFirstName = adminUser?.firstName || "";
      const adminLastName = adminUser?.lastName || "";
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim() || adminUser?.username || "Admin";
      const fromEmail = adminEmail && adminEmail.endsWith("@servicepanda.com.au") ? adminEmail : "team@servicepanda.com.au";
      const fromName = adminFullName;
      const fromDisplay = `${fromName} <${fromEmail}>`;
      const signature = getEmailSignature(adminUser?.username || adminEmail);
      let emailBodyText = body;
      let emailBodyHtml = body;
      if (signature) {
        emailBodyText = appendSignatureToBody(body, signature, false);
        emailBodyHtml = appendSignatureToBody(body, signature, true);
      }
      if (status === "draft") {
        const emailData = {
          from: fromDisplay,
          to,
          cc,
          bcc,
          subject,
          body: emailBodyText,
          bodyHtml: emailBodyHtml,
          status: "draft",
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: "normal",
          folder: "draft",
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: "admin",
          sentAt: null
        };
        await storage.createEmail(emailData);
        res.json({
          success: true,
          message: "Draft saved successfully"
        });
        return;
      }
      const emailSent = await sendEmail({
        to,
        cc,
        bcc,
        subject,
        text: emailBodyText,
        html: emailBodyHtml,
        fromEmail,
        fromName
      });
      if (emailSent) {
        const emailData = {
          from: fromDisplay,
          to,
          cc,
          bcc,
          subject,
          body: emailBodyText,
          bodyHtml: emailBodyHtml,
          status: "sent",
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: "normal",
          folder: "sent",
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: "admin",
          sentAt: /* @__PURE__ */ new Date()
        };
        await storage.createEmail(emailData);
        res.json({
          success: true,
          message: "Email sent successfully",
          debug: { adminUserId, adminUsername: req.admin?.username, fromEmail, fromName }
        });
      } else {
        const emailData = {
          from: fromDisplay,
          to,
          cc,
          bcc,
          subject,
          body: emailBodyText,
          bodyHtml: emailBodyHtml,
          status: "sent",
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: "normal",
          folder: "sent",
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: "admin",
          sentAt: /* @__PURE__ */ new Date()
        };
        await storage.createEmail(emailData);
        res.json({
          success: false,
          message: "Email could not be delivered via Mailgun, but has been saved in Sent."
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      try {
        const adminUser = await storage.getAdminUserByUsername(req.admin?.username);
        const adminUserId = adminUser?.id?.toString() || req.admin?.username || "admin";
        const adminEmail = adminUser?.email || "";
        const adminFirstName = adminUser?.firstName || "";
        const adminLastName = adminUser?.lastName || "";
        const adminFullName = `${adminFirstName} ${adminLastName}`.trim() || adminUser?.username || "Admin";
        const fromEmail = adminEmail && adminEmail.endsWith("@servicepanda.com.au") ? adminEmail : "team@servicepanda.com.au";
        const fromDisplay = `${adminFullName} <${fromEmail}>`;
        const { to, cc, bcc, subject, body } = req.body;
        const signature = getEmailSignature(adminUser?.username || adminEmail);
        let emailBodyText = body;
        let emailBodyHtml = body;
        if (signature) {
          emailBodyText = appendSignatureToBody(body, signature, false);
          emailBodyHtml = appendSignatureToBody(body, signature, true);
        }
        const emailData = {
          from: fromDisplay,
          to,
          cc,
          bcc,
          subject,
          body: emailBodyText,
          bodyHtml: emailBodyHtml,
          status: "sent",
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: "normal",
          folder: "sent",
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: "admin",
          sentAt: /* @__PURE__ */ new Date()
        };
        await storage.createEmail(emailData);
      } catch (saveError) {
        console.error("Failed to save failed email:", saveError);
      }
      res.json({
        success: false,
        message: "Email delivery failed, but the message has been saved in Sent."
      });
    }
  });
  app2.patch("/api/admin/emails/bulk-status", isAdminAuthenticated, async (req, res) => {
    try {
      const { ids, status } = req.body;
      if (!Array.isArray(ids) || ids.length === 0 || !status) {
        return res.status(400).json({ message: "ids (number[]) and status are required" });
      }
      const count = await storage.bulkUpdateEmailStatus(ids, status);
      const updated = await Promise.all(ids.map((id) => storage.getEmail(id)));
      res.json({ message: "Email statuses updated", count, updated });
    } catch (error) {
      console.error("Error in bulk status update:", error);
      res.status(500).json({ message: "Failed to update email statuses" });
    }
  });
  app2.post("/api/admin/emails/bulk-delete", isAdminAuthenticated, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "ids (number[]) are required" });
      }
      const count = await storage.deleteEmails(ids);
      res.json({ message: "Emails deleted", count });
    } catch (error) {
      console.error("Error in bulk delete:", error);
      res.status(500).json({ message: "Failed to delete emails" });
    }
  });
  app2.patch("/api/admin/emails/:id/status", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const result2 = await storage.updateEmailStatus(parseInt(id), status);
      res.json(result2);
    } catch (error) {
      console.error("Error updating email status:", error);
      res.status(500).json({ message: "Failed to update email status" });
    }
  });
  app2.get("/api/admin/emails/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const email = await storage.getEmail(parseInt(id));
      if (!email) {
        return res.status(404).json({ message: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      console.error("Error fetching email:", error);
      res.status(500).json({ message: "Failed to fetch email" });
    }
  });
  app2.patch("/api/admin/emails/:id/read", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const email = await storage.markEmailAsRead(parseInt(id));
      if (!email) {
        return res.status(404).json({ message: "Email not found" });
      }
      res.json({ message: "Email marked as read", email });
    } catch (error) {
      console.error("Error marking email as read:", error);
      res.status(500).json({ message: "Failed to mark email as read" });
    }
  });
  app2.patch("/api/admin/emails/read-state", isAdminAuthenticated, async (req, res) => {
    try {
      const { ids, read } = req.body;
      if (!Array.isArray(ids) || typeof read !== "boolean") {
        return res.status(400).json({ message: "ids (number[]) and read (boolean) are required" });
      }
      const updated = [];
      for (const id of ids) {
        const email = await storage.setEmailReadState(id, read);
        updated.push(email);
      }
      res.json({ message: "Read state updated", count: updated.length });
    } catch (error) {
      console.error("Error updating read state:", error);
      res.status(500).json({ message: "Failed to update read state" });
    }
  });
  app2.get("/api/admin/team-tasks", isAdminAuthenticated, async (req, res) => {
    try {
      const { status, priority, customerType, assignedTo, adminId } = req.query;
      const filters = {
        status,
        priority,
        customerType,
        assignedTo,
        adminId
      };
      const tasks = await storage.getTeamTasks(filters);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching team tasks:", error);
      res.status(500).json({ message: "Failed to fetch team tasks" });
    }
  });
  app2.get("/api/admin/team-tasks/kanban", isAdminAuthenticated, async (req, res) => {
    try {
      const showAll = req.query.all === "true";
      const adminInfo = req.admin;
      let filterBy = null;
      if (showAll && (adminInfo.role === "administrator" || adminInfo.role === "super_admin")) {
        filterBy = null;
      } else {
        filterBy = "assignedTo:" + adminInfo.username;
      }
      console.log("Kanban tasks - User:", adminInfo.username, "Role:", adminInfo.role, "FilterBy:", filterBy);
      const kanbanData = await storage.getTeamTasksForKanban(filterBy);
      res.json(kanbanData);
    } catch (error) {
      console.error("Error fetching team tasks for kanban:", error);
      res.status(500).json({ message: "Failed to fetch kanban data" });
    }
  });
  app2.get("/api/admin/team-tasks/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTeamTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching team task:", error);
      res.status(500).json({ message: "Failed to fetch team task" });
    }
  });
  app2.post("/api/admin/team-tasks", isAdminAuthenticated, async (req, res) => {
    try {
      const taskData = req.body;
      console.log("Received task data:", taskData);
      if (!taskData.title || !taskData.dueDate || !taskData.adminId) {
        console.log("Missing required fields:", {
          title: taskData.title,
          dueDate: taskData.dueDate,
          adminId: taskData.adminId
        });
        return res.status(400).json({
          message: "Missing required fields: title, dueDate, adminId"
        });
      }
      const customerTypes = [
        taskData.potentialProviderId,
        taskData.providerId,
        taskData.customerId
      ].filter(Boolean);
      if (customerTypes.length > 1) {
        return res.status(400).json({
          message: "Only one customer type can be set per task"
        });
      }
      const taskDataForDb = {
        ...taskData,
        dueDate: new Date(taskData.dueDate)
      };
      console.log("Task data for database:", taskDataForDb);
      const newTask = await storage.createTeamTask(taskDataForDb);
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating team task:", error);
      res.status(500).json({ message: "Failed to create team task" });
    }
  });
  app2.put("/api/admin/team-tasks/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const updates = req.body;
      delete updates.id;
      delete updates.createdAt;
      delete updates.updatedAt;
      const updatedTask = await storage.updateTeamTask(taskId, updates);
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating team task:", error);
      res.status(500).json({ message: "Failed to update team task" });
    }
  });
  app2.delete("/api/admin/team-tasks/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      await storage.deleteTeamTask(taskId);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting team task:", error);
      res.status(500).json({ message: "Failed to delete team task" });
    }
  });
  app2.get("/api/admin/sms/campaigns", isAdminAuthenticated, async (req, res) => {
    try {
      const campaigns = await storage.getSmsCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching SMS campaigns:", error);
      res.status(500).json({ message: "Failed to fetch SMS campaigns" });
    }
  });
  app2.post("/api/admin/sms/campaigns", isAdminAuthenticated, async (req, res) => {
    try {
      const campaignData = req.body;
      if (!campaignData.name || !campaignData.name.trim()) {
        return res.status(400).json({ message: "Campaign name is required" });
      }
      if (!campaignData.message || !campaignData.message.trim()) {
        return res.status(400).json({ message: "Campaign message is required" });
      }
      if (!Array.isArray(campaignData.selectedStates)) {
        campaignData.selectedStates = [];
      }
      if (!Array.isArray(campaignData.selectedStatuses)) {
        campaignData.selectedStatuses = [];
      }
      console.log("[SMS Campaign] Creating campaign with data:", JSON.stringify(campaignData, null, 2));
      const campaign = await storage.createSmsCampaign(campaignData);
      console.log("[SMS Campaign] Campaign created successfully:", campaign.id);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("[SMS Campaign] Error creating SMS campaign:", error);
      console.error("[SMS Campaign] Error details:", error.message);
      console.error("[SMS Campaign] Error stack:", error.stack);
      res.status(500).json({
        message: "Failed to create SMS campaign",
        error: error.message || "Unknown error"
      });
    }
  });
  app2.put("/api/admin/sms/campaigns/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaignData = req.body;
      const campaign = await storage.updateSmsCampaign(campaignId, campaignData);
      res.json(campaign);
    } catch (error) {
      console.error("Error updating SMS campaign:", error);
      res.status(500).json({ message: "Failed to update SMS campaign" });
    }
  });
  app2.delete("/api/admin/sms/campaigns/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      await storage.deleteSmsCampaign(campaignId);
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      console.error("Error deleting SMS campaign:", error);
      res.status(500).json({ message: "Failed to delete SMS campaign" });
    }
  });
  app2.post("/api/admin/sms/campaigns/:id/send", isAdminAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { customerIds, adminName } = req.body;
      const result2 = await storage.sendSmsCampaign(campaignId, customerIds, adminName);
      res.json(result2);
    } catch (error) {
      console.error("Error sending SMS campaign:", error);
      res.status(500).json({ message: "Failed to send SMS campaign" });
    }
  });
  app2.get("/api/admin/sms/messages", isAdminAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getSmsMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching SMS messages:", error);
      res.status(500).json({ message: "Failed to fetch SMS messages" });
    }
  });
  app2.post("/api/admin/sms/send", isAdminAuthenticated, async (req, res) => {
    try {
      console.log("\u{1F4F1} [Route] SMS send request received:", req.body);
      const { customerId, message } = req.body;
      if (!customerId || !message) {
        console.error("\u{1F4F1} [Route] Missing required fields:", { customerId, message });
        return res.status(400).json({ message: "Missing customerId or message" });
      }
      console.log("\u{1F4F1} [Route] Calling storage.sendIndividualSms...");
      const result2 = await storage.sendIndividualSms(customerId, message);
      console.log("\u{1F4F1} [Route] SMS send result:", result2);
      res.json(result2);
    } catch (error) {
      console.error("\u{1F4F1} [Route] Error sending SMS:", error);
      console.error("\u{1F4F1} [Route] Error stack:", error.stack);
      res.status(500).json({ message: "Failed to send SMS" });
    }
  });
  app2.post("/api/sms/webhook", async (req, res) => {
    try {
      console.log("\u{1F4E8} [Webhook] Received SMS webhook:", JSON.stringify(req.body, null, 2));
      const { from, to, body, messageId, text: text2, sender, recipient } = req.body;
      const fromPhone = from || sender;
      const toPhone = to || recipient;
      const messageText = body || text2;
      if (!fromPhone || !messageText) {
        console.error("\u274C [Webhook] Missing required fields:", { fromPhone, messageText });
        return res.status(400).json({
          message: "Missing required fields: from/sender and body/text"
        });
      }
      console.log(`\u{1F4F1} [Webhook] Processing SMS from ${fromPhone}: "${messageText}"`);
      const isStopRequest = messageText.trim().toUpperCase() === "STOP";
      if (isStopRequest) {
        console.log("\u{1F6D1} [Webhook] Customer requested to STOP - processing unsubscribe...");
        const customer = await storage.findPotentialCustomerByPhone(fromPhone);
        if (customer) {
          await storage.updatePotentialCustomerStatus(customer.id, "Unsubscribe");
          console.log(`\u2705 [Webhook] Customer ${customer.name} (ID: ${customer.id}) unsubscribed successfully`);
        } else {
          console.warn(`\u26A0\uFE0F [Webhook] Customer not found for phone: ${fromPhone}`);
        }
      }
      await storage.storeIncomingSms(fromPhone, toPhone, messageText, messageId, isStopRequest);
      console.log("\u2705 [Webhook] SMS stored successfully" + (isStopRequest ? " - Customer unsubscribed" : ""));
      res.status(200).json({
        message: "SMS received successfully",
        unsubscribed: isStopRequest
      });
    } catch (error) {
      console.error("\u274C [Webhook] Error processing incoming SMS:", error);
      res.status(500).json({ message: "Failed to process SMS" });
    }
  });
  app2.get("/api/admin/roles", isAdminAuthenticated, async (req, res) => {
    try {
      const roles2 = await storage.getRoles();
      res.json(roles2);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });
  app2.get("/api/admin/permissions", isAdminAuthenticated, async (req, res) => {
    try {
      const permissions2 = await storage.getPermissions();
      res.json(permissions2);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });
  app2.get("/api/admin/roles/:id/permissions", isAdminAuthenticated, async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      const permissions2 = await storage.getRolePermissions(roleId);
      res.json(permissions2);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      res.status(500).json({ message: "Failed to fetch role permissions" });
    }
  });
  app2.post("/api/admin/roles", isAdminAuthenticated, async (req, res) => {
    try {
      const { name, description, permissions: permissions2 } = req.body;
      const role = await storage.createRole({ name, description, permissions: permissions2 });
      res.json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });
  app2.put("/api/admin/roles/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      const { name, description, permissions: permissions2 } = req.body;
      const role = await storage.updateRole(roleId, { name, description, permissions: permissions2 });
      res.json(role);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });
  app2.delete("/api/admin/roles/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      await storage.deleteRole(roleId);
      res.json({ message: "Role deleted successfully" });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ message: "Failed to delete role" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs3 from "fs";
import path6 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path5 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig(async () => {
  const plugins = [
    react(),
    runtimeErrorOverlay()
  ];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
    const cartographer = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer.cartographer());
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": path5.resolve(import.meta.dirname, "client", "src"),
        "@shared": path5.resolve(import.meta.dirname, "shared"),
        "@assets": path5.resolve(import.meta.dirname, "attached_assets")
      }
    },
    root: path5.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path5.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
      // Proxy disabled - using direct API calls to live server
      // proxy: {
      //   '/api': {
      //     target: 'https://api.servicepanda.com.au',
      //     changeOrigin: true,
      //     secure: true,
      //     ws: true,
      //     configure: (proxy, _options) => {
      //       proxy.on('error', (err, _req, _res) => {
      //         console.log('proxy error', err);
      //       });
      //       proxy.on('proxyReq', (proxyReq, req, _res) => {
      //         console.log('Sending Request to the Target:', req.method, req.url);
      //       });
      //       proxy.on('proxyRes', (proxyRes, req, _res) => {
      //         console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
      //       });
      //     },
      //   },
      // },
    }
  };
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    return vite.middlewares(req, res, next);
  });
  app2.use("*", async (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    const url = req.originalUrl;
    try {
      const clientTemplate = path6.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path6.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path6.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv3 from "dotenv";
import path7 from "path";
var envPath3 = path7.resolve(process.cwd(), ".env");
var result = dotenv3.config({ path: envPath3 });
var app = express3();
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}
app.use(express3.json({ limit: "10mb" }));
app.use(express3.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://staging.servicepanda.com.au",
    "https://servicepanda.com.au",
    "https://www.servicepanda.com.au",
    "https://api.servicepanda.com.au",
    "http://localhost:4000",
    "http://localhost:3000",
    "http://127.0.0.1:4000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    // Vite dev server
    "http://127.0.0.1:5173"
  ];
  const origin = req.headers.origin;
  const isDevelopment = process.env.NODE_ENV === "development";
  const isServicePandaDomain = (origin2) => {
    if (!origin2) return false;
    try {
      const url = new URL(origin2);
      return url.hostname === "servicepanda.com.au" || url.hostname === "www.servicepanda.com.au" || url.hostname === "staging.servicepanda.com.au" || url.hostname === "api.servicepanda.com.au" || url.hostname.endsWith(".servicepanda.com.au");
    } catch {
      return origin2.includes("servicepanda.com.au");
    }
  };
  console.log("CORS request from origin:", origin, "| NODE_ENV:", process.env.NODE_ENV, "| Method:", req.method);
  if (req.method === "OPTIONS") {
    if (origin && isServicePandaDomain(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
      res.header("Access-Control-Allow-Credentials", "true");
      console.log("CORS: Preflight allowed for servicepanda domain:", origin);
      return res.sendStatus(200);
    }
    if (isDevelopment && origin && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
      res.header("Access-Control-Allow-Credentials", "true");
      console.log("CORS: Preflight allowed for localhost in development:", origin);
      return res.sendStatus(200);
    }
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
      res.header("Access-Control-Allow-Credentials", "true");
      console.log("CORS: Preflight allowed from list:", origin);
      return res.sendStatus(200);
    }
  }
  if (origin && isServicePandaDomain(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
    res.header("Access-Control-Allow-Credentials", "true");
    console.log("CORS: Allowed servicepanda domain:", origin);
    return next();
  }
  if (isDevelopment && origin && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
    res.header("Access-Control-Allow-Credentials", "true");
    console.log("CORS: Allowed localhost origin in development:", origin);
    return next();
  }
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
    res.header("Access-Control-Allow-Credentials", "true");
    console.log("CORS: Allowed origin from list:", origin);
    return next();
  }
  if (isDevelopment && origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
    res.header("Access-Control-Allow-Credentials", "true");
    console.log("CORS: Allowed origin in development mode:", origin);
    return next();
  }
  if (isDevelopment && !origin) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
    console.log("CORS: No origin header - allowing all in development");
    return next();
  }
  console.log("CORS: Blocked origin:", origin);
  res.status(403).json({ message: "CORS: Origin not allowed", origin });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    message: "ServicePanda API is running"
  });
});
app.use((req, res, next) => {
  const start = Date.now();
  const path8 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path8.startsWith("/api")) {
      let logLine = `${req.method} ${path8} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
    }
  });
  next();
});
(async () => {
  const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  setInterval(async () => {
    try {
      const settings = await storage2.getLeadSettings();
      if (settings.oneMinuteCronActive) {
        console.log("Processing expired leads...");
        await storage2.processExpiredLeads();
        console.log("Expired leads processing completed");
      } else {
        console.log("1-minute cron disabled in admin settings - skipping expired lead processing");
      }
    } catch (error) {
      console.error("Error in expired lead checker:", error);
    }
  }, 6e4);
  const { initializeEmailCron: initializeEmailCron2 } = await Promise.resolve().then(() => (init_emailCronService(), emailCronService_exports));
  initializeEmailCron2(2);
  const isWindows = process.platform === "win32";
  if (isWindows) {
    server.listen(port, "localhost", () => {
      log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      log("Lead and offer expiration checker started - checking every 5 minutes");
    });
  } else {
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      log("Lead and offer expiration checker started - checking every 5 minutes");
    });
  }
})();
