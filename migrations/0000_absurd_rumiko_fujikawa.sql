CREATE TABLE "admin_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_user_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"role" varchar NOT NULL,
	"status" varchar DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "australian_regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"state_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "australian_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"abbreviation" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "australian_suburbs" (
	"id" serial PRIMARY KEY NOT NULL,
	"postcode" varchar NOT NULL,
	"suburb" varchar NOT NULL,
	"state_id" integer NOT NULL,
	"region_id" integer,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8)
);
--> statement-breakpoint
CREATE TABLE "category_lead_pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"unique_price" numeric(10, 2) NOT NULL,
	"share_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_credit_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar NOT NULL,
	"transaction_type" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"balance_before" numeric(10, 2) NOT NULL,
	"balance_after" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"service_request_id" integer,
	"voucher_code" varchar(50),
	"stripe_payment_intent_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar NOT NULL,
	"provider_id" integer NOT NULL,
	"request_id" integer NOT NULL,
	"overall_rating" integer NOT NULL,
	"quality_rating" integer NOT NULL,
	"professionalism_rating" integer NOT NULL,
	"timeliness_rating" integer NOT NULL,
	"value_rating" integer NOT NULL,
	"review_text" text,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_vouchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"redeemed_by" varchar,
	"redeemed_at" timestamp,
	"created_by" varchar DEFAULT 'admin',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "customer_vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"body" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"status" varchar DEFAULT 'pending',
	"accepted_at" timestamp,
	"declined_at" timestamp,
	"is_free" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_distribution_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"distribution_phase" varchar NOT NULL,
	"current_offer_provider_id" integer,
	"next_offer_provider_id" integer,
	"total_eligible_providers" integer DEFAULT 0,
	"unique_offers_completed" integer DEFAULT 0,
	"shared_offers_purchased" integer DEFAULT 0,
	"max_shared_offers" integer DEFAULT 3,
	"phase_start_time" timestamp DEFAULT now(),
	"current_offer_end_time" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"note" text NOT NULL,
	"admin_name" varchar(255) DEFAULT 'admin',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"offer_type" varchar NOT NULL,
	"lead_cost" numeric(10, 2) NOT NULL,
	"status" varchar DEFAULT 'pending',
	"offer_start_time" timestamp DEFAULT now(),
	"offer_end_time" timestamp,
	"purchased_at" timestamp,
	"expires_at" timestamp,
	"sort_order" integer DEFAULT 0,
	"is_current_offer" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_offer_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"request_id" integer NOT NULL,
	"total_cost" numeric(10, 2) NOT NULL,
	"credit_used" numeric(10, 2) DEFAULT '0.00',
	"amount_charged" numeric(10, 2) DEFAULT '0.00',
	"payment_method" varchar NOT NULL,
	"stripe_payment_intent_id" varchar,
	"is_free_lead_used" boolean DEFAULT false,
	"purchased_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"pricing_model" varchar(50) DEFAULT 'uniform' NOT NULL,
	"uniform_unique_price" numeric(10, 2) DEFAULT '25.00',
	"uniform_share_price" numeric(10, 2) DEFAULT '12.00',
	"unique_offer_window" integer DEFAULT 2,
	"max_providers_per_area" integer DEFAULT 10,
	"min_provider_rating" numeric(3, 1) DEFAULT '3.0',
	"provider_restrictions_active" boolean DEFAULT false,
	"first_three_lead_behavior" varchar(20) DEFAULT 'shared' NOT NULL,
	"free_leads_enabled" boolean DEFAULT true,
	"one_minute_cron_active" boolean DEFAULT true,
	"providers_can_redeem_credits" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "provider_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"actor_type" varchar(20) NOT NULL,
	"actor_id" varchar(50),
	"actor_name" varchar(100),
	"description" text NOT NULL,
	"old_value" text,
	"new_value" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_credit_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"transaction_type" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"balance_before" numeric(10, 2) NOT NULL,
	"balance_after" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"lead_offer_id" integer,
	"voucher_code" varchar(50),
	"stripe_payment_intent_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"document_type" varchar NOT NULL,
	"file_name" varchar NOT NULL,
	"file_path" varchar NOT NULL,
	"file_size" integer,
	"mime_type" varchar,
	"status" varchar DEFAULT 'pending',
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_lead_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer,
	"lead_id" integer,
	"interaction_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_lead_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"lead_id" integer NOT NULL,
	"status" varchar DEFAULT 'new' NOT NULL,
	"was_job_booked" boolean,
	"status_updated_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "provider_password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "provider_payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"stripe_customer_id" varchar NOT NULL,
	"stripe_payment_method_id" varchar NOT NULL,
	"card_brand" varchar NOT NULL,
	"card_last_four" varchar NOT NULL,
	"card_exp_month" integer NOT NULL,
	"card_exp_year" integer NOT NULL,
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_postcode_coverage" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"service_area_id" integer NOT NULL,
	"postcode" varchar(10) NOT NULL,
	"distance" numeric(8, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"rating" numeric(3, 1) DEFAULT '5.0' NOT NULL,
	"total_reviews" integer DEFAULT 0,
	"average_response_time" integer DEFAULT 30,
	"completion_rate" numeric(5, 2) DEFAULT '100.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_service_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"center_address" text NOT NULL,
	"center_lat" numeric(10, 7),
	"center_lng" numeric(10, 7),
	"radius_km" integer DEFAULT 25 NOT NULL,
	"area_name" varchar,
	"suburb_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_vouchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"redeemed_by" integer,
	"redeemed_at" timestamp,
	"created_by" varchar DEFAULT 'admin',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "provider_vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "review_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(64) NOT NULL,
	"customer_id" varchar NOT NULL,
	"provider_id" integer NOT NULL,
	"request_id" integer NOT NULL,
	"is_used" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "review_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sent_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipient_id" varchar,
	"recipient_email" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"body" text NOT NULL,
	"template_id" integer,
	"status" varchar DEFAULT 'pending',
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"icon" varchar NOT NULL,
	"description" text,
	"active" boolean DEFAULT true,
	"popular" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"mobile_number" varchar NOT NULL,
	"address" text NOT NULL,
	"business_name" varchar,
	"business_abn" varchar,
	"status" varchar DEFAULT 'pending',
	"provider_status" varchar DEFAULT 'deactivated',
	"documents_uploaded" boolean DEFAULT false,
	"terms_accepted" boolean DEFAULT false,
	"credit_card_added" boolean DEFAULT false,
	"free_leads_remaining" integer DEFAULT 3,
	"stripe_customer_id" varchar,
	"license_info" text,
	"police_check_info" text,
	"insurance_certificate_info" text,
	"insurance_expiry_date" timestamp,
	"admin_notes" text,
	"credit_balance" numeric(10, 2) DEFAULT '0.00',
	"leads_purchased_count" integer DEFAULT 0,
	"first_leads_free_used" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "service_providers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar NOT NULL,
	"category_id" integer NOT NULL,
	"description" text NOT NULL,
	"postcode" varchar NOT NULL,
	"suburb" varchar NOT NULL,
	"property_type" varchar,
	"urgency" varchar,
	"budget" numeric(10, 2),
	"preferred_date" timestamp,
	"booking_type" varchar,
	"scheduled_date" timestamp,
	"status" varchar DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"value" text,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "terms_and_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"providers_terms" text,
	"customers_terms" text,
	"website_terms" text,
	"providers_updated_at" timestamp,
	"customers_updated_at" timestamp,
	"website_updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"user_type" varchar NOT NULL,
	"action" varchar NOT NULL,
	"details" jsonb,
	"ip_address" varchar,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"phone_number" varchar,
	"profile_image_url" varchar,
	"last_login" timestamp,
	"credit_balance" numeric(10, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_user_departments" ADD CONSTRAINT "admin_user_departments_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_user_departments" ADD CONSTRAINT "admin_user_departments_department_id_admin_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."admin_departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "australian_regions" ADD CONSTRAINT "australian_regions_state_id_australian_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."australian_states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "australian_suburbs" ADD CONSTRAINT "australian_suburbs_state_id_australian_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."australian_states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "australian_suburbs" ADD CONSTRAINT "australian_suburbs_region_id_australian_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."australian_regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_lead_pricing" ADD CONSTRAINT "category_lead_pricing_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_credit_transactions" ADD CONSTRAINT "customer_credit_transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_credit_transactions" ADD CONSTRAINT "customer_credit_transactions_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_vouchers" ADD CONSTRAINT "customer_vouchers_redeemed_by_users_id_fk" FOREIGN KEY ("redeemed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_distribution_log" ADD CONSTRAINT "lead_distribution_log_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_distribution_log" ADD CONSTRAINT "lead_distribution_log_current_offer_provider_id_service_providers_id_fk" FOREIGN KEY ("current_offer_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_distribution_log" ADD CONSTRAINT "lead_distribution_log_next_offer_provider_id_service_providers_id_fk" FOREIGN KEY ("next_offer_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_service_requests_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_offers" ADD CONSTRAINT "lead_offers_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_offers" ADD CONSTRAINT "lead_offers_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_purchases" ADD CONSTRAINT "lead_purchases_lead_offer_id_lead_offers_id_fk" FOREIGN KEY ("lead_offer_id") REFERENCES "public"."lead_offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_purchases" ADD CONSTRAINT "lead_purchases_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_purchases" ADD CONSTRAINT "lead_purchases_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_activity_logs" ADD CONSTRAINT "provider_activity_logs_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_credit_transactions" ADD CONSTRAINT "provider_credit_transactions_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_credit_transactions" ADD CONSTRAINT "provider_credit_transactions_lead_offer_id_lead_offers_id_fk" FOREIGN KEY ("lead_offer_id") REFERENCES "public"."lead_offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_documents" ADD CONSTRAINT "provider_documents_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_lead_interactions" ADD CONSTRAINT "provider_lead_interactions_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_lead_interactions" ADD CONSTRAINT "provider_lead_interactions_lead_id_service_requests_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_lead_status" ADD CONSTRAINT "provider_lead_status_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_lead_status" ADD CONSTRAINT "provider_lead_status_lead_id_service_requests_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_password_reset_tokens" ADD CONSTRAINT "provider_password_reset_tokens_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_payment_methods" ADD CONSTRAINT "provider_payment_methods_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_postcode_coverage" ADD CONSTRAINT "provider_postcode_coverage_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_postcode_coverage" ADD CONSTRAINT "provider_postcode_coverage_service_area_id_provider_service_areas_id_fk" FOREIGN KEY ("service_area_id") REFERENCES "public"."provider_service_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_ratings" ADD CONSTRAINT "provider_ratings_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_service_areas" ADD CONSTRAINT "provider_service_areas_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_service_areas" ADD CONSTRAINT "provider_service_areas_suburb_id_australian_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."australian_suburbs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_services" ADD CONSTRAINT "provider_services_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_services" ADD CONSTRAINT "provider_services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_vouchers" ADD CONSTRAINT "provider_vouchers_redeemed_by_service_providers_id_fk" FOREIGN KEY ("redeemed_by") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tokens" ADD CONSTRAINT "review_tokens_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tokens" ADD CONSTRAINT "review_tokens_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tokens" ADD CONSTRAINT "review_tokens_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_customer_provider_request_review" ON "customer_reviews" USING btree ("customer_id","provider_id","request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_lead_status_unique" ON "provider_lead_status" USING btree ("provider_id","lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_service_area_postcode_unique" ON "provider_postcode_coverage" USING btree ("provider_id","service_area_id","postcode");--> statement-breakpoint
CREATE INDEX "provider_postcode_idx" ON "provider_postcode_coverage" USING btree ("provider_id","postcode");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");