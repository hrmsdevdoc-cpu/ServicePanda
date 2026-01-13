-- Migration: Add SMS campaigns table
-- This allows storing and managing SMS campaigns for potential customers

-- Create sms_campaigns table
CREATE TABLE IF NOT EXISTS "sms_campaigns" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "message" text NOT NULL,
    "voucher_code" varchar,
    "voucher_amount" decimal(10,2),
    "selected_states" jsonb NOT NULL,
    "selected_regions" jsonb,
    "selected_statuses" jsonb NOT NULL,
    "scheduled_at" timestamp,
    "status" varchar(20) DEFAULT 'draft' NOT NULL,
    "total_sent" integer DEFAULT 0,
    "sent_at" timestamp,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_sms_campaigns_status" ON "sms_campaigns"("status");
CREATE INDEX IF NOT EXISTS "idx_sms_campaigns_created_at" ON "sms_campaigns"("created_at");

-- Add some sample campaigns for testing
INSERT INTO "sms_campaigns" (
    "name", 
    "message", 
    "voucher_code", 
    "voucher_amount", 
    "selected_states", 
    "selected_statuses", 
    "status", 
    "total_sent"
) VALUES 
(
    'QLD Launch Campaign',
    'Welcome to ServicePanda! Get 20% off your first service booking. Use code QLD20 to redeem. Book now at servicepanda.com.au',
    'QLD20',
    20.00,
    '["Queensland"]',
    '["New"]',
    'sent',
    150
),
(
    'NSW Winter Special',
    'Beat the winter blues! 30% off all home services this month. Limited time offer - book today!',
    'WINTER30',
    30.00,
    '["New South Wales"]',
    '["New", "Contacted"]',
    'scheduled',
    0
),
(
    'VIC Follow-up Campaign',
    'Hi! We noticed you haven''t booked a service yet. Here''s a special 25% discount just for you. Don''t miss out!',
    'VIC25',
    25.00,
    '["Victoria"]',
    '["New"]',
    'draft',
    0
),
(
    'National Welcome Campaign',
    'Welcome to ServicePanda! We''re excited to help you find the perfect service provider. Get started with 15% off your first booking.',
    'WELCOME15',
    15.00,
    '["New South Wales", "Victoria", "Queensland"]',
    '["New"]',
    'sent',
    320
),
(
    'Failed Test Campaign',
    'This is a test message that failed to send properly due to API issues.',
    NULL,
    NULL,
    '["Western Australia"]',
    '["New"]',
    'failed',
    0
);
