-- Add SMS status columns to potential_providers table
ALTER TABLE potential_providers 
ADD COLUMN sms_delivery_status VARCHAR(20) DEFAULT 'not_sent',
ADD COLUMN first_sms_sent_at TIMESTAMP,
ADD COLUMN second_sms_sent_at TIMESTAMP;
