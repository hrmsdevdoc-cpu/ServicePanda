const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function fixMissingLeads() {
  try {
    console.log('=== FIXING MISSING LEADS ===');
    
    // 1. Check the current status of all lead offers for provider 7
    console.log('\n1. Current status of all lead offers for provider 7:');
    const allOffers = await pool.query(`
      SELECT 
        lo.request_id,
        sr.category_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        lo.offer_start_time,
        lo.expires_at,
        sr.status as request_status
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
      ORDER BY lo.request_id DESC, lo.created_at DESC
    `);
    
    console.log('All lead offers for provider 7:', allOffers.rows);
    
    // 2. Update any offers that should be active but aren't
    console.log('\n2. Fixing lead offer statuses...');
    
    // Make sure leads for active requests are properly activated
    const fixResults = await pool.query(`
      UPDATE lead_offers 
      SET 
        status = 'active',
        is_current_offer = true,
        offer_start_time = COALESCE(offer_start_time, NOW()),
        expires_at = CASE 
          WHEN expires_at < NOW() THEN NOW() + INTERVAL '24 hours'
          ELSE expires_at 
        END
      FROM service_requests sr
      WHERE lead_offers.request_id = sr.id
        AND lead_offers.provider_id = 7
        AND sr.status = 'active'
        AND lead_offers.status = 'pending'
      RETURNING lead_offers.request_id, lead_offers.status
    `);
    
    console.log('Updated lead offers:', fixResults.rows);
    
    // 3. Check what the provider dashboard query should return
    console.log('\n3. Testing provider dashboard query...');
    
    // This simulates the actual query used in getProviderActiveLeads
    const dashboardLeads = await pool.query(`
      SELECT 
        lo.request_id,
        sr.category_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        sr.description,
        sr.created_at as request_created,
        lo.offer_type,
        lo.status as offer_status,
        lo.is_current_offer,
        lo.lead_cost,
        lo.expires_at
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND sr.status = 'active'
        AND (
          (lo.offer_type = 'unique' AND lo.status IN ('active', 'pending')) OR
          (lo.offer_type = 'shared' AND lo.status IN ('active', 'pending'))
        )
      ORDER BY sr.created_at DESC
    `);
    
    console.log('Leads that should appear in dashboard:', dashboardLeads.rows);
    
    // 4. Check if there are duplicate offers that need cleanup
    console.log('\n4. Checking for duplicate offers...');
    const duplicates = await pool.query(`
      SELECT request_id, COUNT(*) as count
      FROM lead_offers 
      WHERE provider_id = 7
      GROUP BY request_id
      HAVING COUNT(*) > 1
    `);
    
    if (duplicates.rows.length > 0) {
      console.log('Found duplicate offers:', duplicates.rows);
      
      // Clean up duplicates - keep only the most recent offer per request
      for (const dup of duplicates.rows) {
        await pool.query(`
          DELETE FROM lead_offers 
          WHERE provider_id = 7 
            AND request_id = $1 
            AND id NOT IN (
              SELECT id FROM lead_offers 
              WHERE provider_id = 7 AND request_id = $1 
              ORDER BY created_at DESC 
              LIMIT 1
            )
        `, [dup.request_id]);
        
        console.log(`✓ Cleaned up duplicates for request ${dup.request_id}`);
      }
    } else {
      console.log('✓ No duplicate offers found');
    }
    
    // 5. Final verification
    console.log('\n5. Final verification - leads now visible:');
    const finalCheck = await pool.query(`
      SELECT 
        lo.request_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        lo.offer_type,
        lo.status,
        lo.is_current_offer
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND sr.status = 'active'
        AND lo.status IN ('active', 'pending')
      ORDER BY sr.created_at DESC
    `);
    
    console.log('Final visible leads:', finalCheck.rows);
    console.log(`\n🎉 Provider 7 should now see ${finalCheck.rows.length} leads in dashboard!`);
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixMissingLeads();