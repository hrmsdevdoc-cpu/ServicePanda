-- Migration: Notification System
-- Description: Creates tables for managing provider notifications with read/unread functionality

-- Create notifications table
CREATE TABLE "provider_notifications" (
    "id" serial PRIMARY KEY NOT NULL,
    "provider_id" integer NOT NULL,
    "title" varchar(255) NOT NULL,
    "message" text NOT NULL,
    "type" varchar(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    "category" varchar(50) NOT NULL DEFAULT 'general' CHECK (category IN ('lead', 'payment', 'system', 'general')),
    "is_read" boolean NOT NULL DEFAULT false,
    "action_url" varchar(500),
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    "read_at" timestamp
);

-- Create indexes for better performance
CREATE INDEX "idx_provider_notifications_provider_id" ON "provider_notifications" ("provider_id");
CREATE INDEX "idx_provider_notifications_is_read" ON "provider_notifications" ("is_read");
CREATE INDEX "idx_provider_notifications_created_at" ON "provider_notifications" ("created_at");
CREATE INDEX "idx_provider_notifications_category" ON "provider_notifications" ("category");
CREATE INDEX "idx_provider_notifications_type" ON "provider_notifications" ("type");

-- Create composite index for common queries
CREATE INDEX "idx_provider_notifications_provider_read" ON "provider_notifications" ("provider_id", "is_read");

-- Add foreign key constraint to providers table (if it exists)
-- Note: This assumes there's a providers table with id column
-- If the table name is different, adjust accordingly
-- ALTER TABLE "provider_notifications" ADD CONSTRAINT "fk_provider_notifications_provider_id" 
--     FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON DELETE CASCADE;

-- Create notification settings table for provider preferences
CREATE TABLE "provider_notification_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "provider_id" integer NOT NULL,
    "email_notifications" boolean NOT NULL DEFAULT true,
    "sms_notifications" boolean NOT NULL DEFAULT false,
    "push_notifications" boolean NOT NULL DEFAULT true,
    "lead_notifications" boolean NOT NULL DEFAULT true,
    "payment_notifications" boolean NOT NULL DEFAULT true,
    "system_notifications" boolean NOT NULL DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create unique constraint to ensure one settings record per provider
CREATE UNIQUE INDEX "idx_provider_notification_settings_provider_id" ON "provider_notification_settings" ("provider_id");

-- Create notification templates table for system-generated notifications
CREATE TABLE "notification_templates" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(100) NOT NULL,
    "title_template" varchar(255) NOT NULL,
    "message_template" text NOT NULL,
    "type" varchar(20) NOT NULL DEFAULT 'info',
    "category" varchar(50) NOT NULL DEFAULT 'general',
    "is_active" boolean NOT NULL DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create unique constraint for template names
CREATE UNIQUE INDEX "idx_notification_templates_name" ON "notification_templates" ("name");

-- Insert some default notification templates
INSERT INTO "notification_templates" ("name", "title_template", "message_template", "type", "category") VALUES
('new_lead_available', 'New Lead Available', 'A new {category} lead is available in {location}', 'info', 'lead'),
('payment_successful', 'Payment Successful', 'Your payment of ${amount} has been processed successfully', 'success', 'payment'),
('lead_expired', 'Lead Expired', 'A lead you were interested in has expired', 'warning', 'lead'),
('system_maintenance', 'System Maintenance', 'Scheduled maintenance will occur on {date} at {time}', 'info', 'system'),
('credit_added', 'Credit Added', 'Your account has been credited with ${amount}', 'success', 'payment'),
('profile_updated', 'Profile Updated', 'Your business profile has been successfully updated', 'success', 'system'),
('new_service_category', 'New Service Category', '{category} services are now available in your area', 'info', 'system'),
('lead_purchased', 'Lead Purchased', 'You have successfully purchased a lead for {category} in {location}', 'success', 'lead'),
('payment_failed', 'Payment Failed', 'Your payment of ${amount} could not be processed', 'error', 'payment'),
('account_suspended', 'Account Suspended', 'Your account has been temporarily suspended due to {reason}', 'error', 'system');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_provider_notifications_updated_at 
    BEFORE UPDATE ON "provider_notifications" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_notification_settings_updated_at 
    BEFORE UPDATE ON "provider_notification_settings" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON "notification_templates" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id integer)
RETURNS boolean AS $$
BEGIN
    UPDATE "provider_notifications" 
    SET "is_read" = true, "read_at" = now()
    WHERE "id" = notification_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark all notifications as read for a provider
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(provider_id_param integer)
RETURNS integer AS $$
DECLARE
    updated_count integer;
BEGIN
    UPDATE "provider_notifications" 
    SET "is_read" = true, "read_at" = now()
    WHERE "provider_id" = provider_id_param AND "is_read" = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get unread count for a provider
CREATE OR REPLACE FUNCTION get_unread_notification_count(provider_id_param integer)
RETURNS integer AS $$
DECLARE
    unread_count integer;
BEGIN
    SELECT COUNT(*) INTO unread_count
    FROM "provider_notifications"
    WHERE "provider_id" = provider_id_param AND "is_read" = false;
    
    RETURN unread_count;
END;
$$ LANGUAGE plpgsql;
