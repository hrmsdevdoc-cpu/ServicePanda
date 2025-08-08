const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function verifyTestLead() {
  try {
    console.log('🔍 VERIFYING TEST LEAD FOR HRMS PROVIDER 🔍\n');

    // Check if provider 7 can see the test lead
    const providerLeads = await pool.query(`
      SELECT 
        sr.id as request_id,
        sr.description,
        sr.suburb,
        sr.postcode,
        sc.name as category_name,
        lo.status as offer_status,
        lo.is_current_offer,
        lo.expires_at,
        u.first_name || ' ' || u.last_name as customer_name,
        u.email as customer_email
      FROM service_requests sr
      JOIN service_categories sc ON sr.category_id = sc.id
      JOIN lead_offers lo ON sr.id = lo.request_id
      JOIN users u ON sr.customer_id = u.id
      WHERE lo.provider_id = 7
        AND lo.is_current_offer = true
        AND lo.status = 'pending'
      ORDER BY sr.created_at DESC
    `);

    console.log(`✅ Provider 7 (HRMS) can see ${providerLeads.rows.length} active leads:`);
    
    if (providerLeads.rows.length > 0) {
      providerLeads.rows.forEach((lead, i) => {
        console.log(`\n   ${i + 1}. LEAD ID ${lead.request_id}:`);
        console.log(`      📋 Description: ${lead.description}`);
        console.log(`      🏷️  Category: ${lead.category_name}`);
        console.log(`      📍 Location: ${lead.suburb}, ${lead.postcode}`);
        console.log(`      ⏰ Status: ${lead.offer_status}`);
        console.log(`      👤 Customer: ${lead.customer_name} (${lead.customer_email})`);
        console.log(`      ⏳ Expires: ${lead.expires_at}`);
      });
      
      console.log('\n🎯 PERFECT! Now you can test the review system:');
      console.log('\n📝 TESTING STEPS:');
      console.log('1. 🔑 Login as provider: hrms.devdoc@gmail.com / 123456');
      console.log('2. 📊 Go to Provider Dashboard');
      console.log('3. 👀 You should see the "Test Bond Cleaning" lead');
      console.log('4. ✅ Click "Close Lead" and mark "Job Booked: YES"');
      console.log('5. 📧 System will send review email to customer');
      console.log('6. 🌐 Use the review URL to test the review form');
      console.log('7. ⭐ Submit a 5-star review');
      console.log('8. 📊 Check that provider rating updates in dashboard');
      
    } else {
      console.log('❌ No active leads found for provider 7');
      console.log('The lead might have expired or there was an issue.');
      
      // Check all leads for provider 7
      const allLeads = await pool.query(`
        SELECT 
          sr.id as request_id,
          sr.description,
          lo.status as offer_status,
          lo.is_current_offer,
          lo.expires_at
        FROM service_requests sr
        JOIN lead_offers lo ON sr.id = lo.request_id
        WHERE lo.provider_id = 7
        ORDER BY sr.created_at DESC
        LIMIT 5
      `);
      
      console.log(`\nAll recent leads for provider 7 (${allLeads.rows.length}):`);
      allLeads.rows.forEach((lead, i) => {
        console.log(`   ${i + 1}. ID ${lead.request_id}: ${lead.description}`);
        console.log(`      Status: ${lead.offer_status}, Current: ${lead.is_current_offer}`);
      });
    }

    await pool.end();
    
  } catch (error) {
    console.error('❌ Error verifying test lead:', error);
    process.exit(1);
  }
}

verifyTestLead();