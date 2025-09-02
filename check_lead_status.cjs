const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkLeadStatus() {
  try {
    console.log('=== CHECKING LEAD STATUS ISSUE ===');
    
    // Check what leads provider 7 actually has
    console.log('\n1. All lead offers for provider 7:');
    const allOffers = await pool.query(`
      SELECT 
        lo.id,
        lo.request_id,
        lo.provider_id,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        lo.offer_start_time,
        lo.expires_at,
        sr.category_id,
        sr.suburb,
        sr.postcode,
        sc.name as category_name
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
      ORDER BY lo.created_at DESC
    `);
    console.log('All offers:', allOffers.rows);
    
    // Check what the getProviderActiveLeads function should return
    console.log('\n2. Testing the API endpoint logic:');
    
    // Simulate what getProviderActiveLeads should return
    const activeLeads = await pool.query(`
      SELECT 
        lo.id as offer_id,
        lo.request_id,
        lo.provider_id,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        lo.lead_cost,
        lo.offer_start_time,
        lo.expires_at,
        sr.customer_id,
        sr.category_id,
        sr.description,
        sr.postcode,
        sr.suburb,
        sr.property_type,
        sr.urgency,
        sr.budget,
        sr.preferred_date,
        sr.booking_type,
        sr.created_at,
        sc.name as category_name
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND lo.status IN ('pending', 'purchased')
      ORDER BY 
        CASE WHEN lo.status = 'purchased' THEN 0 ELSE 1 END,
        lo.created_at DESC
    `);
    console.log('Active leads (what API should return):', activeLeads.rows.length, 'leads');
    
    // Count by status
    const pendingCount = activeLeads.rows.filter(l => l.status === 'pending').length;
    const purchasedCount = activeLeads.rows.filter(l => l.status === 'purchased').length;
    
    console.log('\n3. Status breakdown:');
    console.log('- Pending leads:', pendingCount);
    console.log('- Purchased leads:', purchasedCount);
    
    // Check recent activity entries
    console.log('\n4. Recent activity entries for provider 7:');
    const activities = await pool.query(`
      SELECT 
        id,
        provider_id,
        activity_type,
        description,
        created_at
      FROM provider_activity_log
      WHERE provider_id = 7
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.log('Recent activities:', activities.rows);
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkLeadStatus();