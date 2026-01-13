const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testLiveNotificationFlow() {
  try {
    console.log('🧪 Testing LIVE Notification Flow\n');

    // Step 1: Create a test customer service request
    console.log('📝 Step 1: Creating test service request...');
    
    const testRequest = await pool.query(`
      INSERT INTO service_requests 
      (customer_id, category_id, description, postcode, suburb, property_type, urgency, budget, status)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at
    `, [
      'test-customer-001',  // customer_id
      1,                    // category_id (assuming 1 = House Cleaning)
      'Need urgent house cleaning for 3-bedroom apartment before Eid celebration. Deep cleaning required including kitchen, bathrooms, and living areas.',
      '75001',              // postcode (Karachi area)
      'Gulshan-e-Iqbal',    // suburb
      'apartment',          // property_type
      'urgent',             // urgency
      2500,                 // budget
      'active'              // status
    ]);

    const requestId = testRequest.rows[0].id;
    const createdAt = testRequest.rows[0].created_at;
    
    console.log(`✅ Test request created with ID: ${requestId}`);
    console.log(`📅 Created at: ${createdAt}`);

    // Step 2: Check for eligible providers
    console.log('\n🔍 Step 2: Finding eligible providers...');
    
    const eligibleProviders = await pool.query(`
      SELECT DISTINCT sp.id as provider_id, sp.first_name, sp.last_name, sp.email,
             sc.name as category_name
      FROM service_providers sp
      JOIN provider_services ps ON sp.id = ps.provider_id
      JOIN service_categories sc ON ps.category_id = sc.id
      JOIN provider_postcode_coverage ppc ON sp.id = ppc.provider_id
      WHERE ps.category_id = 1 
        AND ppc.postcode = '75001'
        AND sp.status = 'active'
      LIMIT 5
    `);

    console.log(`Found ${eligibleProviders.rows.length} eligible providers:`);
    eligibleProviders.rows.forEach(provider => {
      console.log(`  - ${provider.first_name} ${provider.last_name} (ID: ${provider.provider_id})`);
    });

    if (eligibleProviders.rows.length === 0) {
      console.log('❌ No eligible providers found! Creating a test provider...');
      
      // Create test provider if none exists
      await pool.query(`
        INSERT INTO service_providers 
        (first_name, last_name, email, phone, business_name, status)
        VALUES 
        ('Test', 'Provider', 'test.provider@example.com', '+92300123456', 'Test Cleaning Service', 'active')
        ON CONFLICT (email) DO NOTHING
      `);

      // Add service for the provider
      const testProvider = await pool.query(`
        SELECT id FROM service_providers WHERE email = 'test.provider@example.com' LIMIT 1
      `);

      if (testProvider.rows.length > 0) {
        const providerId = testProvider.rows[0].id;
        
        // Add service category
        await pool.query(`
          INSERT INTO provider_services (provider_id, category_id)
          VALUES ($1, 1)
          ON CONFLICT (provider_id, category_id) DO NOTHING
        `, [providerId]);

        // Add postcode coverage
        await pool.query(`
          INSERT INTO provider_postcode_coverage (provider_id, postcode)
          VALUES ($1, '75001')
          ON CONFLICT (provider_id, postcode) DO NOTHING
        `, [providerId]);

        console.log(`✅ Created test provider with ID: ${providerId}`);
      }
    }

    // Step 3: Wait for cron job OR manually trigger lead distribution
    console.log('\n⏰ Step 3: Triggering lead distribution (simulating cron job)...');
    
    // Check if lead distribution already exists
    const existingDistribution = await pool.query(`
      SELECT id FROM lead_distribution_log WHERE request_id = $1
    `, [requestId]);

    if (existingDistribution.rows.length === 0) {
      console.log('🚀 Lead distribution not initialized yet - this would normally be done by cron job');
      console.log('📱 In live system, cron job runs every 5 minutes and will:');
      console.log('   1. Find this new request');
      console.log('   2. Initialize lead distribution');
      console.log('   3. Send notifications to all eligible providers');
      console.log('   4. Create lead offers for providers');
    } else {
      console.log('✅ Lead distribution already exists for this request');
    }

    // Step 4: Show current system status
    console.log('\n📊 Step 4: System Status Check');
    
    // Check cron job settings
    const cronSettings = await pool.query(`
      SELECT key, value FROM system_settings 
      WHERE key IN ('oneMinuteCronActive', 'leadSettings')
    `);

    console.log('Cron job settings:');
    cronSettings.rows.forEach(setting => {
      console.log(`  ${setting.key}: ${setting.value}`);
    });

    // Check recent activity
    const recentRequests = await pool.query(`
      SELECT sr.id, sr.description, sr.created_at, sr.status,
             COUNT(lo.id) as offer_count
      FROM service_requests sr
      LEFT JOIN lead_offers lo ON sr.id = lo.request_id
      WHERE sr.created_at > NOW() - INTERVAL '1 hour'
      GROUP BY sr.id, sr.description, sr.created_at, sr.status
      ORDER BY sr.created_at DESC
      LIMIT 5
    `);

    console.log('\nRecent service requests (last hour):');
    recentRequests.rows.forEach(request => {
      console.log(`  ID ${request.id}: ${request.description.substring(0, 50)}... (${request.status}) - ${request.offer_count} offers`);
    });

    console.log('\n🎯 TESTING COMPLETE!');
    console.log('\n📱 To test provider notifications:');
    console.log('1. ✅ Test request created in database');
    console.log('2. ⏰ Wait 5 minutes for cron job to process');
    console.log('3. 📱 Check provider app for notifications');
    console.log('4. 🔍 OR check server logs for notification sending');
    
    console.log(`\n🔗 Test Request Details:`);
    console.log(`   Request ID: ${requestId}`);
    console.log(`   Service: House Cleaning`);
    console.log(`   Location: Gulshan-e-Iqbal, 75001`);
    console.log(`   Status: Active`);
    console.log(`   Eligible Providers: ${eligibleProviders.rows.length}`);

  } catch (error) {
    console.error('❌ Error in test:', error);
  } finally {
    await pool.end();
  }
}

// Run the test
testLiveNotificationFlow();
