const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function debugLeadStatus() {
  try {
    console.log('=== DEBUGGING LEAD STATUS ISSUE ===');
    
    // 1. Check current lead offers for provider 7
    console.log('\n1. Current lead offers for provider 7:');
    const offers = await pool.query(`
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
        sr.postcode,
        sr.suburb,
        sc.name as category_name
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
      ORDER BY lo.created_at DESC
    `);
    console.log('Lead offers:', offers.rows);
    
    // 2. Check what the API endpoint returns for provider leads
    console.log('\n2. Check what getProviderActiveLeads would return for provider 7:');
    
    // Simulate the query from getProviderActiveLeads
    const activeLeads = await pool.query(`
      SELECT 
        lo.request_id as "requestId",
        lo.id as "leadOfferId",
        lo.provider_id as "providerId", 
        lo.offer_type as "offerType",
        lo.status,
        lo.lead_cost as "leadCost",
        lo.is_current_offer as "isCurrentOffer",
        lo.offer_start_time as "offerStartTime",
        lo.expires_at as "expiresAt",
        sr.description,
        sr.postcode,
        sr.suburb,
        sr.preferred_date as "preferredDate",
        sr.urgency,
        sr.booking_type as "bookingType",
        sc.name as "categoryName",
        CONCAT(u.first_name, ' ', u.last_name) as "customerName",
        u.phone_number as "customerPhone",
        u.email as "customerEmail"
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      INNER JOIN users u ON sr.customer_id = u.id
      WHERE lo.provider_id = 7
        AND lo.status IN ('pending', 'active')
      ORDER BY lo.created_at DESC
    `);
    console.log('Active leads query result:', activeLeads.rows);
    
    // 3. Check if offers need to be activated
    console.log('\n3. Checking if any offers need activation:');
    const pendingOffers = await pool.query(`
      SELECT request_id, status, is_current_offer, offer_start_time
      FROM lead_offers 
      WHERE provider_id = 7 AND status = 'pending'
    `);
    console.log('Pending offers that might need activation:', pendingOffers.rows);
    
    // 4. Activate the offers that should be current
    console.log('\n4. Activating current offers...');
    for (const offer of pendingOffers.rows) {
      if (offer.is_current_offer) {
        await pool.query(`
          UPDATE lead_offers 
          SET status = 'active', offer_start_time = NOW()
          WHERE request_id = $1 AND provider_id = 7 AND is_current_offer = true
        `, [offer.request_id]);
        console.log(`✓ Activated offer for request ${offer.request_id}`);
      }
    }
    
    // 5. Final check - what should now appear in New Leads
    console.log('\n5. Final verification - leads that should appear in New Leads:');
    const finalLeads = await pool.query(`
      SELECT 
        lo.request_id,
        lo.status,
        lo.is_current_offer,
        sr.suburb,
        sc.name as category_name
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND lo.status IN ('pending', 'active')
        AND lo.is_current_offer = true
      ORDER BY lo.created_at DESC
    `);
    console.log('Leads that should appear in New Leads:', finalLeads.rows);
    
    await pool.end();
    console.log('\n✅ DEBUG COMPLETED!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugLeadStatus();