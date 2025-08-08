const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function reactivateExpiredLeads() {
  try {
    console.log('=== REACTIVATING EXPIRED LEADS ===');
    
    // 1. Find expired offers for active requests that should be reactivated
    console.log('\n1. Finding expired offers for provider 7 on active requests...');
    const expiredOffers = await pool.query(`
      SELECT 
        lo.request_id,
        sr.category_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        sr.created_at
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND sr.status = 'active'
        AND lo.status = 'expired'
      ORDER BY sr.created_at DESC
    `);
    
    console.log('Requests with expired offers:', expiredOffers.rows);
    
    // 2. Delete the expired offers and create fresh ones
    for (const request of expiredOffers.rows) {
      console.log(`\n2. Reactivating offers for request ${request.request_id} (${request.category_name} in ${request.suburb})...`);
      
      // Delete existing expired offers for this request and provider
      const deleteResult = await pool.query(`
        DELETE FROM lead_offers 
        WHERE request_id = $1 AND provider_id = 7 AND status = 'expired'
      `, [request.request_id]);
      
      console.log(`Deleted ${deleteResult.rowCount} expired offers`);
      
      // Create a fresh active offer
      await pool.query(`
        INSERT INTO lead_offers (
          request_id,
          provider_id,
          offer_type,
          lead_cost,
          status,
          sort_order,
          is_current_offer,
          offer_start_time,
          expires_at,
          created_at
        )
        VALUES ($1, 7, 'unique', '15.00', 'pending', 0, true, NOW(), NOW() + INTERVAL '7 days', NOW())
      `, [request.request_id]);
      
      console.log(`✓ Created fresh offer for request ${request.request_id}`);
    }
    
    // 3. Also ensure requests 22 and 20 have properly activated offers
    console.log('\n3. Activating pending offers...');
    await pool.query(`
      UPDATE lead_offers 
      SET 
        status = 'pending',
        is_current_offer = true,
        offer_start_time = COALESCE(offer_start_time, NOW()),
        expires_at = COALESCE(expires_at, NOW() + INTERVAL '7 days')
      WHERE provider_id = 7 
        AND request_id IN (22, 20)
        AND status = 'pending'
    `);
    
    // 4. Final verification
    console.log('\n4. Final check - all leads now available to provider 7:');
    const finalLeads = await pool.query(`
      SELECT 
        lo.request_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        lo.expires_at
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND sr.status = 'active'
        AND lo.status = 'pending'
      ORDER BY sr.created_at DESC
    `);
    
    console.log('All available leads:', finalLeads.rows);
    console.log(`\n🎉 SUCCESS! Provider 7 now has ${finalLeads.rows.length} active leads available!`);
    
    if (finalLeads.rows.length > 0) {
      console.log('\nLeads summary:');
      finalLeads.rows.forEach(lead => {
        console.log(`- Request ${lead.request_id}: ${lead.category_name} in ${lead.suburb} (${lead.postcode})`);
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

reactivateExpiredLeads();