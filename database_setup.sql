-- ServicePanda Database Setup Script
-- Run this in your PostgreSQL database

-- Create admin_users table
CREATE TABLE IF NOT EXISTS "admin_users" (
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

-- Create service_providers table
CREATE TABLE IF NOT EXISTS "service_providers" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "mobile_number" varchar,
    "address" text,
    "business_name" varchar,
    "business_abn" varchar,
    "status" varchar DEFAULT 'pending',
    "provider_status" varchar DEFAULT 'pending',
    "documents_uploaded" boolean DEFAULT false,
    "terms_accepted" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    CONSTRAINT "service_providers_email_unique" UNIQUE("email")
);

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" varchar PRIMARY KEY NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "phone_number" varchar,
    "address" text,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create service_categories table
CREATE TABLE IF NOT EXISTS "service_categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "icon" varchar,
    "description" text,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS "service_requests" (
    "id" serial PRIMARY KEY NOT NULL,
    "customer_id" varchar NOT NULL,
    "category_id" integer NOT NULL,
    "description" text NOT NULL,
    "postcode" varchar NOT NULL,
    "suburb" varchar NOT NULL,
    "property_type" varchar,
    "urgency" varchar DEFAULT 'normal',
    "budget" decimal(10,2),
    "preferred_date" timestamp,
    "booking_type" varchar DEFAULT 'one_time',
    "status" varchar DEFAULT 'open',
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create provider_documents table
CREATE TABLE IF NOT EXISTS "provider_documents" (
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

-- Create provider_service_areas table
CREATE TABLE IF NOT EXISTS "provider_service_areas" (
    "id" serial PRIMARY KEY NOT NULL,
    "provider_id" integer NOT NULL,
    "center_address" varchar NOT NULL,
    "center_lat" varchar,
    "center_lng" varchar,
    "radius_km" integer NOT NULL,
    "area_name" varchar,
    "created_at" timestamp DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS "system_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "value" text,
    "description" text,
    "updated_at" timestamp DEFAULT now(),
    CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);

-- Insert admin user (password: 123456)
-- Note: This password hash is for '123456'
INSERT INTO "admin_users" ("username", "email", "password", "first_name", "last_name", "role", "status")
VALUES (
    'admin', 
    'admin@servicepanda.com.au', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Admin', 
    'User', 
    'super_admin',
    'active'
) ON CONFLICT ("username") DO NOTHING;

-- Insert some basic service categories
INSERT INTO "service_categories" ("name", "icon", "description") VALUES
('Cleaning', '🧹', 'House cleaning and maintenance services'),
('Plumbing', '🔧', 'Plumbing repairs and installations'),
('Electrical', '⚡', 'Electrical work and repairs'),
('Gardening', '🌱', 'Garden maintenance and landscaping'),
('Painting', '🎨', 'Interior and exterior painting services')
ON CONFLICT DO NOTHING;

-- Insert some basic system settings
INSERT INTO "system_settings" ("key", "value", "description") VALUES
('app_name', 'ServicePanda', 'Application name'),
('app_version', '1.0.0', 'Application version'),
('maintenance_mode', 'false', 'Maintenance mode status')
ON CONFLICT ("key") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_service_providers_email" ON "service_providers" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_service_requests_customer_id" ON "service_requests" ("customer_id");
CREATE INDEX IF NOT EXISTS "idx_service_requests_category_id" ON "service_requests" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_provider_documents_provider_id" ON "provider_documents" ("provider_id");

-- Display success message
SELECT 'Database setup completed successfully!' as message;
SELECT 'Admin user created with credentials:' as info;
SELECT 'Username: admin' as username;
SELECT 'Email: admin@servicepanda.com.au' as email;
SELECT 'Password: 123456' as password;

