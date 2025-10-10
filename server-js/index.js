var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/smsService.ts
import axios from "axios";
var SmsService, smsService;
var init_smsService = __esm({
  "server/smsService.ts"() {
    "use strict";
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
       * Send SMS using Dialpad API (equivalent to sendDailPadSMS in Laravel)
       */
      async sendDialpadSms(data) {
        if (!this.apiKey || !this.apiUrl) {
          console.error("SMS API not configured");
          return false;
        }
        console.log("[SMS] Preparing request to Dialpad. To:", data.sendTo, "From:", this.fromNumber);
        try {
          const response = await axios.post(
            `${this.apiUrl}?apikey=${encodeURIComponent(this.apiKey)}`,
            {
              infer_country_code: false,
              text: data.chatMessage,
              to_numbers: [data.sendTo],
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
      recordOutbound(params) {
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
      }
      getLogs() {
        return [...this.logs].sort((a, b) => a.sentAt < b.sentAt ? 1 : -1);
      }
    };
    smsService = new SmsService();
  }
});

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
  insertSentEmailSchema: () => insertSentEmailSchema,
  insertServiceCategorySchema: () => insertServiceCategorySchema,
  insertServiceProviderSchema: () => insertServiceProviderSchema,
  insertServiceRequestSchema: () => insertServiceRequestSchema,
  insertSmsMessageSchema: () => insertSmsMessageSchema,
  insertSystemSettingSchema: () => insertSystemSettingSchema,
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
  potentialCustomers: () => potentialCustomers,
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
  sentEmails: () => sentEmails,
  sentEmailsRelations: () => sentEmailsRelations,
  serviceCategories: () => serviceCategories,
  serviceCategoriesRelations: () => serviceCategoriesRelations,
  serviceProviders: () => serviceProviders,
  serviceProvidersRelations: () => serviceProvidersRelations,
  serviceRequests: () => serviceRequests,
  serviceRequestsRelations: () => serviceRequestsRelations,
  sessions: () => sessions,
  smsMessages: () => smsMessages,
  systemSettings: () => systemSettings,
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
var sessions, users, serviceProviders, providerPaymentMethods, serviceCategories, providerServices, australianStates, australianRegions, australianSuburbs, providerServiceAreas, providerDocuments, serviceRequests, leadAssignments, providerRatings, leadOffers, leadDistributionLog2, providerPostcodeCoverage, emailTemplates, sentEmails, emails, emailAttachments, emailLabels, emailLabelRelations, userActivityLogs, systemSettings, passwordResetTokens, providerPasswordResetTokens, providerActivityLogs, providerVouchers, providerCreditTransactions, leadPurchases, customerVouchers, customerCreditTransactions, adminDepartments, adminUsers, adminUserDepartments, usersRelations, serviceProvidersRelations, serviceCategoriesRelations, providerServicesRelations, australianStatesRelations, australianRegionsRelations, australianSuburbsRelations, providerServiceAreasRelations, providerDocumentsRelations, serviceRequestsRelations, leadAssignmentsRelations, emailTemplatesRelations, sentEmailsRelations, emailsRelations, emailAttachmentsRelations, emailLabelsRelations, emailLabelRelationsRelations, userActivityLogsRelations, providerActivityLogsRelations, insertUserSchema, insertServiceProviderSchema, insertServiceCategorySchema, insertProviderServiceSchema, insertProviderServiceAreaSchema, insertProviderDocumentSchema, insertServiceRequestSchema, insertLeadAssignmentSchema, insertEmailTemplateSchema, insertSentEmailSchema, insertUserActivityLogSchema, insertSystemSettingSchema, insertProviderPaymentMethodSchema, insertPasswordResetTokenSchema, insertProviderPasswordResetTokenSchema, insertProviderActivityLogSchema, insertProviderRatingSchema, insertLeadOfferSchema, insertLeadDistributionLogSchema, insertProviderPostcodeCoverageSchema, insertCustomerVoucherSchema, insertCustomerCreditTransactionSchema, insertAdminDepartmentSchema, insertAdminUserSchema, insertAdminUserDepartmentSchema, insertEmailSchema, insertEmailAttachmentSchema, insertEmailLabelSchema, insertEmailLabelRelationSchema, leadSettings, categoryLeadPricing, leadNotes, providerLeadInteractions, providerLeadStatus, customerReviews, reviewTokens, insertLeadNoteSchema, insertProviderLeadInteractionSchema, insertProviderLeadStatusSchema, insertCustomerReviewSchema, insertReviewTokenSchema, potentialCustomers, termsAndConditions, insertTermsAndConditionsSchema, insertPotentialCustomerSchema, potentialProviders, potentialProviderTasks, potentialProviderCommunications, insertPotentialProviderSchema, insertPotentialProviderTaskSchema, insertPotentialProviderCommunicationSchema, smsMessages, insertSmsMessageSchema, providerNotifications, insertProviderNotificationSchema;
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
      active: boolean("active").default(true),
      popular: boolean("popular").default(false),
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
    usersRelations = relations(users, ({ many }) => ({
      serviceRequests: many(serviceRequests),
      sentEmails: many(sentEmails),
      activityLogs: many(userActivityLogs)
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
      importId: varchar("import_id").notNull(),
      // Unique identifier for batch imports
      importName: varchar("import_name").notNull(),
      // Label to identify imported groups
      smsDeliveryStatus: varchar("sms_delivery_status", { length: 20 }).default("not_sent"),
      // not_sent, 1st_sent, 2nd_sent
      firstSmsSentAt: timestamp("first_sms_sent_at"),
      secondSmsSentAt: timestamp("second_sms_sent_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
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
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import dotenv from "dotenv";
import path from "path";
var envPath, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    envPath = path.resolve(process.cwd(), ".env");
    dotenv.config({ path: envPath });
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      console.warn("\u26A0\uFE0F  DATABASE_URL not set. Using fallback configuration for development.");
      process.env.DATABASE_URL = "postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require";
    }
    try {
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
      db = drizzle({ client: pool, schema: schema_exports });
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
var envPath2, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_smsService();
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
        const [user] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
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
        const [serviceProvider] = await db.insert(serviceProviders).values(provider).returning();
        return serviceProvider;
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
        const [provider] = await db.update(serviceProviders).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(serviceProviders.id, id)).returning();
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
        const [result2] = await db.insert(providerServiceAreas).values(serviceAreaData).returning();
        return result2;
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
        const [doc] = await db.insert(providerDocuments).values(document).returning();
        return doc;
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
          console.log(`Getting service requests for customer: ${customerId}`);
          const result2 = await pool.query(
            `SELECT id, customer_id, category_id, description, postcode, suburb, 
                property_type, urgency, budget, preferred_date, booking_type, 
                scheduled_date, status, created_at, updated_at
         FROM service_requests 
         WHERE customer_id = $1
         ORDER BY created_at DESC`,
            [customerId]
          );
          console.log(`Found ${result2.rows.length} service requests via pool.query`);
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
            return {
              id: request.id,
              customerId: request.customer_id,
              categoryId: request.category_id,
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
          console.log(`Found ${result2.rows.length} accepted professionals for request ${requestId}`);
          console.log("Raw professional data:", result2.rows);
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
        console.log(`[updateAdminSetting] Setting ${key} with value length: ${value.length}`);
        const encryptedValue = this.encrypt(value);
        console.log(`[updateAdminSetting] Encrypted value length: ${encryptedValue.length}`);
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
        console.log(`[updateAdminSetting] Database result for ${key}:`, result2.length > 0 ? "Success" : "Failed");
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
          await this.activateNextUniqueOffer(requestId);
        } catch (error) {
          console.error("Error initializing lead distribution:", error);
          throw error;
        }
      }
      async getEligibleProviders(categoryId, postcode) {
        try {
          console.log(`Finding eligible providers for category ${categoryId}, postcode ${postcode}`);
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
          console.log(`Found ${postcodeCoverageProviders.length} providers via postcode coverage`);
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
              console.log(`Target location: ${target.suburb} (${target.latitude}, ${target.longitude})`);
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
                  console.log(`Provider ${provider.firstName} ${provider.lastName} (${area.centerAddress}): ${distance.toFixed(2)}km away, radius: ${area.radiusKm}km`);
                  if (distance <= parseInt(area.radiusKm.toString())) {
                    console.log(`\u2713 Provider ${provider.firstName} ${provider.lastName} is within service area`);
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
              console.log(`No coordinates found for postcode ${postcode}`);
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
          console.log(`Total eligible providers found: ${uniqueProviders.length} (${postcodeCoverageProviders.length} via postcode, ${locationBasedProviders.length} via distance)`);
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
            console.log(`Service area ${serviceAreaId} not found or no center address`);
            return;
          }
          const area = serviceArea[0];
          console.log(`Calculating postcode coverage for provider ${area.providerId}, service area ${serviceAreaId}`);
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
          console.log(`Stored coverage for ${coveredPostcodes.length} postcodes for service area ${serviceAreaId}`);
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
          console.log(`Activated unique offer for provider ${nextOffer.providerId}, expires at ${offerEndTime}`);
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
          console.log(`Started shared phase for request ${requestId}`);
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
          console.log(`Ended lead distribution for request ${requestId}`);
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
          console.log("Processing dynamic lead matching...");
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
          console.log(`Found ${activeLeads.length} active/in-progress leads for dynamic matching`);
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
          console.log(`Found ${newProviders.length} new eligible providers for lead ${requestId}`);
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
              console.log(`Added provider ${provider.firstName} ${provider.lastName} to shared phase for lead ${requestId}`);
            } else {
              const totalUniqueOffers = await db.select({ count: sql`count(*)` }).from(leadOffers).where(
                and(
                  eq(leadOffers.requestId, requestId),
                  eq(leadOffers.offerType, "unique")
                )
              );
              const nextSortOrder = (totalUniqueOffers[0]?.count || 0) + 1;
              await this.createUniqueOffer(requestId, provider.providerId, nextSortOrder, leadSettings2);
              console.log(`Added provider ${provider.firstName} ${provider.lastName} to unique queue (position ${nextSortOrder}) for lead ${requestId}`);
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
            console.log(`Processing expired offer ${expiredOffer.id} for request ${expiredOffer.requestId}`);
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
            console.log(`Expiring shared offers for request ${expired.requestId} due to job date proximity`);
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
          console.log(`Added $${amount} credit to provider ${providerId}. New balance: $${newBalance}`);
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
          console.log(`Deducted $${amount} credit from provider ${providerId}. New balance: $${newBalance}`);
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
            } else {
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
              // Show current unique offers that are pending and active
              and(
                eq(leadOffers.status, "pending"),
                eq(leadOffers.isCurrentOffer, true),
                eq(leadOffers.offerType, "unique")
              ),
              // Show shared offers that are pending (not purchased by this provider yet)
              and(
                eq(leadOffers.status, "pending"),
                eq(leadOffers.offerType, "shared")
              ),
              // Show purchased offers (for activity history)
              eq(leadOffers.status, "purchased")
            ),
            // Only show leads that haven't expired based on job date (24 hours before)
            sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
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
              // Only show leads that haven't expired based on job date (24 hours before)
              sql`${serviceRequests.preferredDate} > (CURRENT_TIMESTAMP + INTERVAL '24 hours')`
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
          }).from(leadOffers).innerJoin(serviceRequests, eq(leadOffers.requestId, serviceRequests.id)).innerJoin(serviceCategories, eq(serviceRequests.categoryId, serviceCategories.id)).where(eq(leadOffers.providerId, providerId)).orderBy(desc(leadOffers.createdAt)).limit(20);
          const processedActivities = activities.map((activity) => {
            let message = "";
            let activityType = "";
            let variant = "default";
            if (activity.status === "purchased") {
              message = `Lead purchased - ${activity.categoryName} in ${activity.suburb}`;
              activityType = "lead_purchased";
              variant = "default";
            } else if (activity.status === "expired" && activity.offerType === "unique") {
              message = `Offer expired - ${activity.categoryName} lead in ${activity.suburb} (was $${activity.leadCost})`;
              activityType = "offer_expired";
              variant = "secondary";
            } else if (activity.status === "pending" && activity.isCurrentOffer && activity.offerType === "unique") {
              message = `New offer - ${activity.categoryName} lead in ${activity.suburb} ($${activity.leadCost})`;
              activityType = "new_offer";
              variant = "outline";
            } else if (activity.status === "pending" && activity.offerType === "shared") {
              message = `Price DROP - ${activity.categoryName} lead in ${activity.suburb} now $${activity.leadCost}`;
              activityType = "price_drop";
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
          return processedActivities.filter((activity) => activity.message);
        } catch (error) {
          console.error("Error getting provider activity history:", error);
          return [];
        }
      }
      // Provider lead interaction tracking methods
      async logProviderLeadInteraction(interaction) {
        try {
          await db.insert(providerLeadInteractions).values(interaction);
          console.log(`Logged provider interaction: ${interaction.interactionType} for lead ${interaction.leadId} by provider ${interaction.providerId}`);
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
            console.log(`Updated rating for provider ${providerId}: ${stats.averageRating} (${stats.totalReviews} reviews)`);
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
            console.log("Processing file:", file.name, "at path:", file.tempFilePath);
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
              console.log("Using file data buffer, size:", file.data.length);
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
              console.log(`[SMS] Preparing send -> id=${customer.id} name=${customer.name} phone=${customer.phone} currentStatus=${customer.smsDeliveryStatus}`);
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
          console.log("Getting provider reports...");
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
          console.log("Provider stats:", { totalProviders, approvedProviders, pendingProviders, rejectedProviders });
          const currentDate = /* @__PURE__ */ new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const newProvidersThisMonth = await db.select({ count: sql`count(*)` }).from(serviceProviders).where(
            and(
              gte(serviceProviders.createdAt, firstDayOfMonth),
              eq(serviceProviders.status, "approved")
            )
          );
          console.log("New providers this month:", newProvidersThisMonth[0]?.count || 0);
          const monthlyData = await db.select({
            month: sql`to_char(${serviceProviders.createdAt}, 'YYYY-MM')`,
            status: serviceProviders.status,
            count: sql`cast(count(*) as integer)`
          }).from(serviceProviders).where(
            gte(serviceProviders.createdAt, sql`CURRENT_DATE - INTERVAL '4 years'`)
          ).groupBy(sql`to_char(${serviceProviders.createdAt}, 'YYYY-MM'), ${serviceProviders.status}`);
          const monthlyJoins = [];
          const monthMap = /* @__PURE__ */ new Map();
          const now = new Date();
          const last4Years = [];
          for (let i = 47; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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
          console.log("Raw monthly data from database:", monthlyData);
          monthlyData.forEach((row) => {
            const monthKey = row.month;
            const monthData = monthMap.get(monthKey);
            if (monthData) {
              const count = parseInt(row.count.toString()) || 0;
              console.log(`Processing ${monthKey}: count=${row.count} (${typeof row.count}), parsed=${count}`);
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
          console.log("Monthly joins:", monthlyJoins);
          const topServiceCategories = await db.select({
            category: serviceCategories.name,
            providerCount: sql`count(distinct ${providerServices.providerId})`
          }).from(providerServices).innerJoin(serviceCategories, eq(providerServices.categoryId, serviceCategories.id)).groupBy(serviceCategories.name).orderBy(desc(sql`count(distinct ${providerServices.providerId})`)).limit(5);
          console.log("Top service categories:", topServiceCategories);
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
          console.log(`Provider reports generated in ${endTime - startTime}ms`);
          console.log("Provider reports result:", result2);
          return result2;
        } catch (error) {
          console.error("Error getting provider reports:", error);
          throw new Error("Failed to get provider reports");
        }
      }
      // Potential Providers methods
      async getAllPotentialProviders() {
        try {
          const providers = await db.select().from(potentialProviders).orderBy(desc(potentialProviders.createdAt));
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
          console.log("Importing potential providers:", importName);
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
          return task;
        } catch (error) {
          console.error("Error creating potential provider task:", error);
          throw error;
        }
      }
      async sendEmailToPotentialProvider(providerId, subject, content, adminUsername = "admin") {
        try {
          const provider = await db.select().from(potentialProviders).where(eq(potentialProviders.id, providerId)).limit(1);
          if (provider.length === 0) {
            throw new Error("Potential provider not found");
          }
          await db.insert(potentialProviderCommunications).values({
            potentialProviderId: providerId,
            communicationType: "email",
            direction: "outbound",
            subject,
            content,
            sentBy: adminUsername,
            status: "sent",
            sentAt: /* @__PURE__ */ new Date(),
            createdAt: /* @__PURE__ */ new Date()
          });
          await db.update(potentialProviders).set({
            status: "email",
            lastContactDate: /* @__PURE__ */ new Date(),
            lastContactType: "email",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(potentialProviders.id, providerId));
          return { success: true, message: "Email sent successfully" };
        } catch (error) {
          console.error("Error sending email to potential provider:", error);
          throw error;
        }
      }
      async sendSmsToPotentialProvider(providerId, content, adminUsername = "admin") {
        try {
          const provider = await db.select().from(potentialProviders).where(eq(potentialProviders.id, providerId)).limit(1);
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
            sentBy: adminUsername,
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
          if (filters.tab === "unread") {
            query = query.where(eq(emails.isRead, false));
          } else if (filters.tab !== "all") {
            query = query.where(eq(emails.status, filters.tab));
          }
          if (filters.userId !== "all") {
            query = query.where(eq(emails.userId, filters.userId));
          }
          if (filters.search) {
            query = query.where(
              or(
                like(emails.subject, `%${filters.search}%`),
                like(emails.body, `%${filters.search}%`),
                like(emails.from, `%${filters.search}%`),
                like(emails.to, `%${filters.search}%`)
              )
            );
          }
          if (filters.fromDate) {
            query = query.where(gte(emails.createdAt, new Date(filters.fromDate)));
          }
          if (filters.toDate) {
            query = query.where(lte(emails.createdAt, new Date(filters.toDate)));
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
    formData.append("from", `ServicePanda <team@servicepanda.com.au>`);
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
    console.log("Mailgun API response status:", response.status);
    console.log("Mailgun API response headers:", Object.fromEntries(response.headers.entries()));
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
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "http://localhost:3000";
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
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "http://localhost:3000";
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
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "http://localhost:3000";
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
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : process.env.FRONTEND_URL || "http://localhost:3000";
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

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
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
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
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
import { scrypt as scrypt2, randomBytes as randomBytes2, timingSafeEqual as timingSafeEqual2 } from "crypto";
import { promisify as promisify2 } from "util";
import path3 from "path";
var scryptAsync2 = promisify2(scrypt2);
async function hashPassword2(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords2(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync2(supplied, salt, 64);
  return timingSafeEqual2(hashedBuf, suppliedBuf);
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
        const host = req.get("host");
        const baseUrl = host?.includes("localhost") ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : `${req.protocol}://${host}`;
        const resetUrl = `${baseUrl}/provider-reset-password?token=${token}`;
        const emailSent = await sendEmail({
          to: email,
          subject: "ServicePanda Partners - Reset Your Password",
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
import { scrypt as scrypt3, randomBytes as randomBytes3, timingSafeEqual as timingSafeEqual3 } from "crypto";
import { promisify as promisify3 } from "util";
import jwt from "jsonwebtoken";
var scryptAsync3 = promisify3(scrypt3);
var JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key";
async function hashPassword3(password) {
  const salt = randomBytes3(16).toString("hex");
  const buf = await scryptAsync3(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords3(supplied, stored) {
  try {
    if (!stored.includes(".")) {
      return supplied === stored;
    }
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync3(supplied, salt, 64);
    return timingSafeEqual3(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
function generateAdminToken(username) {
  return jwt.sign(
    { username, role: "admin", type: "admin" },
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
      const token = generateAdminToken(username);
      console.log("Admin login successful for:", username);
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
    if (!decoded || decoded.role !== "admin") {
      console.log("Admin auth failed - invalid token or role");
      return res.status(401).json({ message: "Invalid admin token" });
    }
    req.admin = decoded;
    console.log("Admin auth successful");
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
init_smsService();
import jwt2 from "jsonwebtoken";
import { eq as eq2, and as and2, or as or2, desc as desc2, sql as sql2 } from "drizzle-orm";
import multer from "multer";
import path4 from "path";
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
  app2.get("/api/service-categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
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
        return res.status(500).json({ error: "Google Maps API key not configured" });
      }
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.append("input", input);
      url.searchParams.append("types", types);
      url.searchParams.append("components", components);
      url.searchParams.append("key", apiKey);
      const response = await fetch(url.toString());
      const data = await response.json();
      if (data.status === "OK") {
        res.json(data);
      } else {
        console.error("Google Places API error:", data);
        res.status(500).json({ error: "Failed to fetch address suggestions" });
      }
    } catch (error) {
      console.error("Address autocomplete error:", error);
      res.status(500).json({ error: "Internal server error" });
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
      const pendingProviders = await storage.getServiceProviderCount("pending");
      const totalCustomers = await storage.getUserCount();
      const totalRequests = await storage.getServiceRequestCount();
      const pendingRequests = await storage.getServiceRequestCount("pending");
      res.json({
        totalProviders,
        activeProviders,
        pendingProviders,
        totalCustomers,
        totalRequests,
        pendingRequests
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
      res.json(serviceRequests2);
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
      const adminToken = req.headers["x-admin-token"];
      const decoded = jwt2.verify(adminToken, process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key");
      const username = decoded.username;
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
      const users2 = await storage.getAllAdminUsers();
      const usersWithDepartments = await Promise.all(
        users2.map(async (user) => {
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
      const validRoles = ["Administrator", "Manager", "Team Member"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Role must be Administrator, Manager, or Team Member"
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
      const { username, firstName, lastName, email, role, status, departmentIds = [] } = req.body;
      if (!username || !firstName || !lastName || !email || !role || !status) {
        return res.status(400).json({
          message: "Username, first name, last name, email, role, and status are required"
        });
      }
      const validRoles = ["Administrator", "Manager", "Team Member"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Role must be Administrator, Manager, or Team Member"
        });
      }
      const validStatuses = ["active", "inactive"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status must be active or inactive"
        });
      }
      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const updates = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
        status
      };
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
  app2.post("/api/admin/potential-customers/import", isAdminAuthenticated, async (req, res) => {
    try {
      console.log("Import request received:");
      console.log("req.body:", req.body);
      console.log("req.files:", req.files ? Object.keys(req.files) : "No files");
      let importName = null;
      if (req.files && req.files.importName) {
        if (req.files.importName.data) {
          importName = req.files.importName.data.toString();
          console.log("Found importName in req.files.data:", importName);
        } else {
          importName = req.files.importName.toString();
          console.log("Found importName in req.files (direct):", importName);
        }
      } else if (req.body && req.body.importName) {
        importName = req.body.importName;
        console.log("Found importName in req.body:", importName);
      } else {
        console.log("No importName found in any location");
        console.log("Available in req.files:", req.files ? Object.keys(req.files) : "No files");
        console.log("Available in req.body:", Object.keys(req.body));
      }
      if (!importName) {
        console.log("Returning error: Import name is required");
        return res.status(400).json({ message: "Import name is required" });
      }
      console.log("Processing import with name:", importName);
      if (!req.files || !req.files.file) {
        console.log("No file provided, using sample data");
        const result3 = await storage.importPotentialCustomers(null, importName);
        res.json(result3);
        return;
      }
      const uploadedFile = req.files.file;
      if (!uploadedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log("Processing file upload:", uploadedFile.name);
      console.log("File object details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        tempFilePath: uploadedFile.tempFilePath,
        mimetype: uploadedFile.mimetype
      });
      const result2 = await storage.importPotentialCustomers(uploadedFile, importName);
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
      const providers = await storage.getAllPotentialProviders();
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
      const adminUsername = req.admin?.username || "admin";
      const result2 = await storage.sendEmailToPotentialProvider(potentialProviderId, subject, content, adminUsername);
      res.json(result2);
    } catch (error) {
      console.error("Error sending email to potential provider:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  app2.post("/api/admin/potential-providers/sms", isAdminAuthenticated, async (req, res) => {
    try {
      const { potentialProviderId, content } = req.body;
      const adminUsername = req.admin?.username || "admin";
      const result2 = await storage.sendSmsToPotentialProvider(potentialProviderId, content, adminUsername);
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
  app2.get("/api/admin/emails", isAdminAuthenticated, async (req, res) => {
    try {
      const { tab, user, search, fromDate, toDate } = req.query;
      const emails2 = await storage.getEmails({
        tab: tab || "inbox",
        userId: user || "all",
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
  app2.post("/api/admin/emails/send", isAdminAuthenticated, async (req, res) => {
    console.log("Hello");
    try {
      const { to, cc, bcc, subject, body, template, status } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({ message: "To, subject, and body are required" });
      }
      
      // Get the admin user's ID from the database
      const adminUser = await storage.getAdminUserByUsername(req.admin?.username);
      const adminUserId = adminUser?.id?.toString() || req.admin?.username || "admin";
      console.log('Admin user lookup:', { username: req.admin?.username, adminUser, adminUserId });
      
      if (status === "draft") {
        const emailData = {
          from: "hrms.devdoc@gmail.com",
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
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
        text: body,
        html: body
      });
      if (emailSent) {
        const emailData = {
          from: "hrms.devdoc@gmail.com",
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
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
          debug: { adminUserId, adminUsername: req.admin?.username }
        });
      } else {
        const emailData = {
          from: "hrms.devdoc@gmail.com",
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
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
          message: "Email could not be delivered via Mailgun, but has been saved in Sent. dddd"
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      try {
        // Get the admin user's ID from the database for error case
        const adminUser = await storage.getAdminUserByUsername(req.admin?.username);
        const adminUserId = adminUser?.id?.toString() || req.admin?.username || "admin";
        
        const { to, cc, bcc, subject, body } = req.body;
        const emailData = {
          from: "hrms.devdoc@gmail.com",
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path6 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path5 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
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
    },
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT || "4000"}`,
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
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
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
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
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path6.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv3 from "dotenv";
import path7 from "path";
var envPath3 = path7.resolve(process.cwd(), ".env");
console.log("Loading .env file from:", envPath3);
var result = dotenv3.config({ path: envPath3 });
console.log("Dotenv result:", result);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
var app = express2();
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
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
      log(logLine);
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
  }, 3e5);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    log("Lead and offer expiration checker started - checking every minute");
  });
})();
