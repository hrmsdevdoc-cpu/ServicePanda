# 🔔 Notification System Setup Guide

This guide will help you set up the dynamic notification system for ServicePanda with real database integration and read/unread functionality.

## 📋 Prerequisites

- PostgreSQL database running
- Node.js environment set up
- Access to database migrations
- ServicePanda backend API running

## 🗄️ Database Setup

### Step 1: Run the Migration

First, run the notification system migration to create the necessary tables:

```bash
# Connect to your database and run the migration
psql -d your_database_name -f migrations/0004_notification_system.sql
```

**Or manually run the SQL commands from `migrations/0004_notification_system.sql`**

### Step 2: Verify Tables Created

After running the migration, you should see these new tables:

- `provider_notifications` - Main notifications table
- `provider_notification_settings` - Provider notification preferences
- `notification_templates` - System notification templates

## 📊 Add Dummy Data

### Step 3: Run the Dummy Data Script

Execute the script to add sample notifications:

```bash
# Make sure you have the required dependencies
npm install postgres drizzle-orm dotenv

# Run the dummy data script
node add_notification_dummy_data.cjs
```

**Expected Output:**
```
🚀 Starting to add dummy notification data...
✅ Found 1 providers to add notifications for.
📱 Using provider ID: 1
📝 Adding 12 dummy notifications...
✅ Added: New Lead Available
✅ Added: Payment Successful
✅ Added: Lead Expired
...
🎉 Dummy notification data added successfully!
📊 Total notifications: 12
📬 Unread notifications: 8
👤 Provider ID: 1
```

## 🔧 Backend API Setup

### Step 4: Create API Endpoints

Your backend needs these API endpoints for the notification system to work:

#### GET `/api/provider/notifications`
- Returns all notifications for the authenticated provider
- Should include pagination and filtering options
- Response format:
```json
{
  "data": [
    {
      "id": 1,
      "title": "New Lead Available",
      "message": "A new plumbing lead is available...",
      "type": "info",
      "isRead": false,
      "timestamp": "2024-01-15T10:30:00Z",
      "category": "lead",
      "metadata": { "location": "Brisbane City" }
    }
  ]
}
```

#### PUT `/api/provider/notifications/:id/read`
- Marks a specific notification as read
- Updates `is_read` to `true` and sets `read_at` timestamp
- Returns success status

#### PUT `/api/provider/notifications/read-all`
- Marks all unread notifications as read for the provider
- Returns count of updated notifications

#### GET `/api/provider/notifications/unread-count`
- Returns the count of unread notifications
- Response format: `{ "count": 8 }`

## 📱 Frontend Integration

### Step 5: Update React Native App

The notification system is already integrated into your React Native app:

1. **NotificationIcon** - Shows in header with unread count badge
2. **NotificationList** - Modal dropdown with all notifications
3. **NotificationService** - Handles API calls and state management

### Step 6: Test the System

1. **Open the app** and navigate to Dashboard
2. **Tap the bell icon** 🔔 in the header
3. **View notifications** - should show real data from database
4. **Tap unread notifications** - should mark as read
5. **Use "Mark All as Read"** - should update all notifications
6. **Check badge count** - should update in real-time

## 🗂️ Database Schema Details

### `provider_notifications` Table
```sql
CREATE TABLE "provider_notifications" (
    "id" serial PRIMARY KEY NOT NULL,
    "provider_id" integer NOT NULL,
    "title" varchar(255) NOT NULL,
    "message" text NOT NULL,
    "type" varchar(20) NOT NULL DEFAULT 'info',
    "category" varchar(50) NOT NULL DEFAULT 'general',
    "is_read" boolean NOT NULL DEFAULT false,
    "action_url" varchar(500),
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    "read_at" timestamp
);
```

### Key Features:
- **Read/Unread Status**: `is_read` boolean field
- **Timestamps**: `created_at`, `updated_at`, `read_at`
- **Metadata**: JSONB field for flexible additional data
- **Categories**: Lead, payment, system, general
- **Types**: Info, success, warning, error

## 🔍 Database Functions

The migration creates several helpful database functions:

### `mark_notification_as_read(notification_id)`
- Marks a single notification as read
- Returns boolean success status

### `mark_all_notifications_as_read(provider_id)`
- Marks all unread notifications as read for a provider
- Returns count of updated notifications

### `get_unread_notification_count(provider_id)`
- Returns count of unread notifications for a provider

## 📊 Sample Data Included

The dummy data script adds 12 realistic notifications:

- **New Lead Available** (unread) - Plumbing in Brisbane
- **Payment Successful** (unread) - $50 credit card payment
- **Lead Expired** (read) - Expired lead notification
- **System Maintenance** (read) - Scheduled maintenance alert
- **New Service Category** (unread) - Electrical services
- **Credit Added** (unread) - $100 account credit
- **Profile Updated** (read) - Business profile changes
- **Lead Purchased** (unread) - Plumbing in Gold Coast
- **Payment Failed** (unread) - $25 payment failure
- **High Demand Alert** (unread) - Cleaning services demand
- **Customer Review** (unread) - 5-star review received
- **Weekly Summary** (read) - Weekly performance summary

## 🚨 Troubleshooting

### Common Issues:

1. **"Notification tables do not exist"**
   - Run the migration first: `psql -d your_database -f migrations/0004_notification_system.sql`

2. **"No providers found"**
   - Ensure you have provider records in your `providers` table
   - Check the table name matches your schema

3. **API errors in React Native**
   - Verify backend API endpoints are implemented
   - Check authentication and provider ID handling
   - Fallback to mock data if API is unavailable

4. **Database connection issues**
   - Verify `DATABASE_URL` in your `.env` file
   - Check PostgreSQL is running and accessible

### Verification Queries:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE '%notification%';

-- Check notification data
SELECT * FROM provider_notifications LIMIT 5;

-- Check unread count
SELECT COUNT(*) FROM provider_notifications WHERE is_read = false;

-- Check provider settings
SELECT * FROM provider_notification_settings;
```

## 🎯 Next Steps

After setup, consider implementing:

1. **Real-time Updates**: WebSocket integration for live notifications
2. **Push Notifications**: Mobile push notification support
3. **Email Integration**: Email notifications for important alerts
4. **Notification Preferences**: Allow providers to customize settings
5. **Analytics**: Track notification engagement and effectiveness

## 📞 Support

If you encounter issues:

1. Check the database logs for SQL errors
2. Verify all migration steps completed successfully
3. Test API endpoints independently
4. Check React Native console for frontend errors

---

**🎉 Congratulations!** Your notification system is now fully dynamic with real database integration and read/unread functionality.
