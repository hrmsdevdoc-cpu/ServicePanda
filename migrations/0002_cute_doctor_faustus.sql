CREATE TABLE "potential_provider_communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"potential_provider_id" integer NOT NULL,
	"communication_type" varchar NOT NULL,
	"direction" varchar NOT NULL,
	"subject" varchar,
	"content" text NOT NULL,
	"status" varchar DEFAULT 'sent',
	"sent_by" varchar NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"delivered_at" timestamp,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "potential_provider_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"potential_provider_id" integer NOT NULL,
	"task_type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"title" varchar NOT NULL,
	"description" text,
	"scheduled_date" timestamp,
	"completed_date" timestamp,
	"assigned_to" varchar,
	"result" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "potential_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"business_name" varchar,
	"business_abn" varchar,
	"address" text NOT NULL,
	"state" varchar NOT NULL,
	"city" varchar NOT NULL,
	"postcode" varchar NOT NULL,
	"service_categories" text,
	"source" varchar DEFAULT 'manual',
	"import_id" varchar,
	"import_name" varchar,
	"status" varchar DEFAULT 'new',
	"priority" varchar DEFAULT 'medium',
	"assigned_to" varchar,
	"notes" text,
	"next_follow_up_date" timestamp,
	"last_contact_date" timestamp,
	"last_contact_type" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "potential_provider_communications" ADD CONSTRAINT "potential_provider_communications_potential_provider_id_potential_providers_id_fk" FOREIGN KEY ("potential_provider_id") REFERENCES "public"."potential_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "potential_provider_tasks" ADD CONSTRAINT "potential_provider_tasks_potential_provider_id_potential_providers_id_fk" FOREIGN KEY ("potential_provider_id") REFERENCES "public"."potential_providers"("id") ON DELETE no action ON UPDATE no action;