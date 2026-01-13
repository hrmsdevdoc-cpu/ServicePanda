-- Migration: Add image URL to service categories
-- Description: Adds imageUrl column to service_categories table for image uploads

-- Add imageUrl column to service_categories table
ALTER TABLE "service_categories" ADD COLUMN "image_url" TEXT DEFAULT '';

-- Add comment to document the new column
COMMENT ON COLUMN "service_categories"."image_url" IS 'URL to uploaded image for the service category';
