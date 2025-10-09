-- Create SMS messages table for chat functionality
CREATE TABLE IF NOT EXISTS sms_messages (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    customer_name VARCHAR NOT NULL,
    customer_phone VARCHAR NOT NULL,
    message TEXT NOT NULL,
    direction VARCHAR(10) NOT NULL, -- 'outbound' or 'inbound'
    status VARCHAR(20) NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed', 'received'
    campaign_id INTEGER, -- Reference to sms_campaigns table
    campaign_name VARCHAR, -- Denormalized for easier querying
    sent_at TIMESTAMP DEFAULT NOW(),
    received_at TIMESTAMP, -- For inbound messages
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sms_messages_customer_id ON sms_messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_direction ON sms_messages(direction);
CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON sms_messages(status);
CREATE INDEX IF NOT EXISTS idx_sms_messages_campaign_id ON sms_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_sent_at ON sms_messages(sent_at);
