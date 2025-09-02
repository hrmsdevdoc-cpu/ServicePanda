-- Email management system tables
CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" varchar NOT NULL,
	"to" varchar NOT NULL,
	"cc" varchar,
	"bcc" varchar,
	"subject" varchar NOT NULL,
	"body" text NOT NULL,
	"body_html" text,
	"status" varchar(20) DEFAULT 'inbox' NOT NULL,
	"is_read" boolean DEFAULT false,
	"is_starred" boolean DEFAULT false,
	"has_attachments" boolean DEFAULT false,
	"priority" varchar(10) DEFAULT 'normal',
	"folder" varchar(50) DEFAULT 'inbox',
	"user_id" varchar,
	"user_type" varchar(20),
	"provider_id" integer,
	"thread_id" varchar,
	"parent_email_id" integer,
	"sent_at" timestamp,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Email management system tables
CREATE TABLE "email_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"email_id" integer NOT NULL,
	"filename" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"mime_type" varchar NOT NULL,
	"size" integer NOT NULL,
	"file_path" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);

-- Email management system tables
CREATE TABLE "email_labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"color" varchar(7) DEFAULT '#3B82F6',
	"user_id" varchar,
	"created_at" timestamp DEFAULT now()
);

-- Email management system tables
CREATE TABLE "email_label_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email_id" integer NOT NULL,
	"label_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE "emails" ADD CONSTRAINT "emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

-- Add foreign key constraints
ALTER TABLE "emails" ADD CONSTRAINT "emails_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;

-- Add foreign key constraints
ALTER TABLE "emails" ADD CONSTRAINT "emails_parent_email_id_emails_id_fk" FOREIGN KEY ("parent_email_id") REFERENCES "public"."emails"("id") ON DELETE no action ON UPDATE no action;

-- Add foreign key constraints
ALTER TABLE "email_attachments" ADD CONSTRAINT "email_attachments_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE no action ON UPDATE no action;

-- Add foreign key constraints
ALTER TABLE "email_labels" ADD CONSTRAINT "email_labels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

-- Add foreign key constraints
ALTER TABLE "email_label_relations" ADD CONSTRAINT "email_label_relations_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE no action ON UPDATE no action;

-- Add foreign key constraints
ALTER TABLE "email_label_relations" ADD CONSTRAINT "email_label_relations_label_id_email_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."email_labels"("id") ON DELETE no action ON UPDATE no action;

-- Add indexes for better performance
CREATE INDEX "emails_status_idx" ON "emails"("status");

-- Add indexes for better performance
CREATE INDEX "emails_user_id_idx" ON "emails"("user_id");

-- Add indexes for better performance
CREATE INDEX "emails_created_at_idx" ON "emails"("created_at");

-- Add indexes for better performance
CREATE INDEX "emails_is_read_idx" ON "emails"("is_read");

-- Add indexes for better performance
CREATE INDEX "emails_folder_idx" ON "emails"("folder");

-- Add indexes for better performance
CREATE INDEX "emails_thread_id_idx" ON "emails"("thread_id");
