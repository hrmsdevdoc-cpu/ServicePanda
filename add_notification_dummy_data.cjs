const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { config } = require('dotenv');

// Load environment variables
config();

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda';
const client = postgres(connectionString);
const db = drizzle(client);

async function addNotificationDummyData() {
  try {
    console.log('🚀 Starting to add dummy notification data...');

    // First, let's check if the notification tables exist
    const tableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'provider_notifications'
      );
    `;

    if (!tableExists[0].exists) {
      console.log('❌ Notification tables do not exist. Please run the migration first.');
      console.log('Run: psql -d your_database -f migrations/0004_notification_system.sql');
      return;
    }

    // Check if we have any providers to work with
    const providers = await client`
      SELECT id FROM providers LIMIT 5;
    `;

    if (providers.length === 0) {
      console.log('❌ No providers found in the database. Please add some providers first.');
      return;
    }

    console.log(`✅ Found ${providers.length} providers to add notifications for.`);

    // Get the first provider ID for demo purposes
    const providerId = providers[0].id;
    console.log(`📱 Using provider ID: ${providerId}`);

    // Check if notifications already exist for this provider
    const existingNotifications = await client`
      SELECT COUNT(*) as count FROM provider_notifications WHERE provider_id = ${providerId};
    `;

    if (existingNotifications[0].count > 0) {
      console.log(`⚠️  Provider ${providerId} already has ${existingNotifications[0].count} notifications.`);
      console.log('Skipping to avoid duplicates.');
      return;
    }

    // Add dummy notifications
    const dummyNotifications = [
      {
        provider_id: providerId,
        title: 'New Lead Available',
        message: 'A new plumbing lead is available in Brisbane City. Customer needs urgent repair work.',
        type: 'info',
        category: 'lead',
        is_read: false,
        metadata: { location: 'Brisbane City', urgency: 'high', estimated_value: 150 }
      },
      {
        provider_id: providerId,
        title: 'Payment Successful',
        message: 'Your credit card payment of $50.00 has been processed successfully. Your account has been credited.',
        type: 'success',
        category: 'payment',
        is_read: false,
        metadata: { amount: 50.00, payment_method: 'credit_card', transaction_id: 'txn_123456' }
      },
      {
        provider_id: providerId,
        title: 'Lead Expired',
        message: 'A lead you were interested in has expired. The customer has chosen another provider.',
        type: 'warning',
        category: 'lead',
        is_read: true,
        metadata: { expired_at: new Date().toISOString(), lead_value: 75.00 }
      },
      {
        provider_id: providerId,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM. The system will be unavailable for approximately 2 hours.',
        type: 'info',
        category: 'system',
        is_read: true,
        metadata: { maintenance_date: '2024-01-15', duration: '2 hours', impact: 'low' }
      },
      {
        provider_id: providerId,
        title: 'New Service Category',
        message: 'Electrical services are now available in your area. Expand your business opportunities!',
        type: 'info',
        category: 'system',
        is_read: false,
        metadata: { new_category: 'Electrical', location: 'Brisbane Metro', commission_rate: '15%' }
      },
      {
        provider_id: providerId,
        title: 'Credit Added',
        message: 'Your account has been credited with $100.00. This credit can be used for lead purchases.',
        type: 'success',
        category: 'payment',
        is_read: false,
        metadata: { amount: 100.00, source: 'referral_bonus', expiry_date: '2024-12-31' }
      },
      {
        provider_id: providerId,
        title: 'Profile Updated',
        message: 'Your business profile has been successfully updated. All changes are now live.',
        type: 'success',
        category: 'system',
        is_read: true,
        metadata: { updated_fields: ['business_name', 'contact_info'], updated_at: new Date().toISOString() }
      },
      {
        provider_id: providerId,
        title: 'Lead Purchased',
        message: 'You have successfully purchased a lead for Plumbing in Gold Coast. Contact the customer within 24 hours.',
        type: 'success',
        category: 'lead',
        is_read: false,
        metadata: { location: 'Gold Coast', category: 'Plumbing', customer_urgency: 'medium' }
      },
      {
        provider_id: providerId,
        title: 'Payment Failed',
        message: 'Your payment of $25.00 could not be processed. Please check your payment method and try again.',
        type: 'error',
        category: 'payment',
        is_read: false,
        metadata: { amount: 25.00, failure_reason: 'insufficient_funds', retry_count: 1 }
      },
      {
        provider_id: providerId,
        title: 'High Demand Alert',
        message: 'High demand detected for cleaning services in your area. Consider adjusting your availability.',
        type: 'info',
        category: 'lead',
        is_read: false,
        metadata: { service_type: 'Cleaning', demand_level: 'high', location: 'Brisbane Metro' }
      },
      {
        provider_id: providerId,
        title: 'Customer Review Received',
        message: 'You received a 5-star review from John Smith for your recent plumbing work.',
        type: 'success',
        category: 'system',
        is_read: false,
        metadata: { rating: 5, customer_name: 'John Smith', service_type: 'Plumbing' }
      },
      {
        provider_id: providerId,
        title: 'Weekly Summary',
        message: 'This week you completed 3 leads, earned $225, and received 2 positive reviews.',
        type: 'info',
        category: 'system',
        is_read: true,
        metadata: { leads_completed: 3, earnings: 225.00, reviews: 2, period: 'weekly' }
      }
    ];

    console.log(`📝 Adding ${dummyNotifications.length} dummy notifications...`);

    // Insert notifications one by one to handle any potential errors
    for (const notification of dummyNotifications) {
      try {
        await client`
          INSERT INTO provider_notifications (
            provider_id, title, message, type, category, is_read, metadata, created_at
          ) VALUES (
            ${notification.provider_id},
            ${notification.title},
            ${notification.message},
            ${notification.type},
            ${notification.category},
            ${notification.is_read},
            ${JSON.stringify(notification.metadata)},
            ${notification.created_at || new Date()}
          );
        `;
        console.log(`✅ Added: ${notification.title}`);
      } catch (error) {
        console.error(`❌ Failed to add notification: ${notification.title}`, error.message);
      }
    }

    // Add notification settings for the provider
    try {
      await client`
        INSERT INTO provider_notification_settings (
          provider_id, email_notifications, sms_notifications, push_notifications,
          lead_notifications, payment_notifications, system_notifications
        ) VALUES (
          ${providerId}, true, false, true, true, true, true
        ) ON CONFLICT (provider_id) DO NOTHING;
      `;
      console.log('✅ Added notification settings for provider');
    } catch (error) {
      console.error('❌ Failed to add notification settings:', error.message);
    }

    // Verify the data was added
    const finalCount = await client`
      SELECT COUNT(*) as count FROM provider_notifications WHERE provider_id = ${providerId};
    `;

    const unreadCount = await client`
      SELECT COUNT(*) as count FROM provider_notifications WHERE provider_id = ${providerId} AND is_read = false;
    `;

    console.log('\n🎉 Dummy notification data added successfully!');
    console.log(`📊 Total notifications: ${finalCount[0].count}`);
    console.log(`📬 Unread notifications: ${unreadCount[0].count}`);
    console.log(`👤 Provider ID: ${providerId}`);

    // Show sample of added notifications
    const sampleNotifications = await client`
      SELECT title, type, category, is_read, created_at 
      FROM provider_notifications 
      WHERE provider_id = ${providerId} 
      ORDER BY created_at DESC 
      LIMIT 5;
    `;

    console.log('\n📋 Sample notifications added:');
    sampleNotifications.forEach((notification, index) => {
      const status = notification.is_read ? '📖 Read' : '📬 Unread';
      const emoji = notification.is_read ? '✅' : '🔔';
      console.log(`${emoji} ${index + 1}. ${notification.title} (${notification.type}) - ${status}`);
    });

  } catch (error) {
    console.error('❌ Error adding dummy notification data:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the function
addNotificationDummyData().catch(console.error);
