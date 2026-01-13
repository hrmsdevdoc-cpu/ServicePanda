-- Migration: Add trending column to service_categories table
-- This allows service types to be marked as trending in addition to popular

-- Add trending column to service_categories table
ALTER TABLE service_categories 
ADD COLUMN trending BOOLEAN DEFAULT FALSE;

-- Set some sample services as trending for testing
-- You can modify these based on your actual service data
UPDATE service_categories 
SET trending = TRUE 
WHERE name IN ('Cleaning', 'Electrical', 'Plumbing', 'HVAC') 
AND id <= 4;

-- Create an index on trending column for better query performance
CREATE INDEX idx_service_categories_trending ON service_categories(trending);

-- Optional: Create composite index for popular and trending
CREATE INDEX idx_service_categories_popular_trending ON service_categories(popular, trending);
