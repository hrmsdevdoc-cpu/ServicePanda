const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkMissingLeads() {
  try {
    console.log('=== CHECKING FOR MISSING LEADS ===');
    
    // 1. Check what service categories provider 7 offers
    console.log('\n1. Service categories offered by provider 7:');
    const providerServices = await pool.query(`
      SELECT ps.category_id, sc.name as category_name
      FROM provider_services ps
      INNER JOIN service_categories sc ON ps.category_id = sc.id
      WHERE ps.provider_id = 7
      ORDER BY sc.name
    `);
    console.log('Provider 7 services:', providerServices.rows);
    
    // 2. Check what postcodes provider 7 covers
    console.log('\n2. Postcodes covered by provider 7:');
    const postcodeCoverage = await pool.query(`
      SELECT DISTINCT postcode
      FROM provider_postcode_coverage
      WHERE provider_id = 7
      ORDER BY postcode
    `);
    console.log('Provider 7 postcode coverage:', postcodeCoverage.rows);
    
    // 3. Find ALL active service requests that match provider 7's categories and postcodes
    console.log('\n3. All active service requests matching provider 7:');
    const categoryIds = providerServices.rows.map(s => s.category_id);
    const postcodes = postcodeCoverage.rows.map(p => p.postcode);
    
    if (categoryIds.length > 0 && postcodes.length > 0) {
      const matchingRequests = await pool.query(`
        SELECT 
          sr.id, 
          sr.category_id, 
          sc.name as category_name,
          sr.postcode, 
          sr.suburb, 
          sr.status, 
          sr.created_at,
          CASE WHEN lo.request_id IS NOT NULL THEN 'Has Offers' ELSE 'No Offers' END as offer_status
        FROM service_requests sr
        INNER JOIN service_categories sc ON sr.category_id = sc.id
        LEFT JOIN lead_offers lo ON sr.id = lo.request_id AND lo.provider_id = 7
        WHERE sr.category_id = ANY($1)
          AND sr.postcode = ANY($2)
          AND sr.status = 'active'
        ORDER BY sr.created_at DESC
      `, [categoryIds, postcodes]);
      
      console.log('Matching service requests:', matchingRequests.rows);
      
      // 4. Find requests that should have offers but don't
      const requestsWithoutOffers = matchingRequests.rows.filter(r => r.offer_status === 'No Offers');
      
      if (requestsWithoutOffers.length > 0) {
        console.log('\n4. Service requests missing lead offers for provider 7:');
        console.log('Missing offers:', requestsWithoutOffers);
        
        // Create missing lead offers
        console.log('\n5. Creating missing lead offers...');
        for (const request of requestsWithoutOffers) {
          console.log(`Creating offer for request ${request.id}...`);
          
          // Check if distribution log exists
          const distLog = await pool.query('SELECT id FROM lead_distribution_log WHERE request_id = $1', [request.id]);
          
          if (distLog.rows.length === 0) {
            // Create distribution log
            await pool.query(`
              INSERT INTO lead_distribution_log (
                request_id, distribution_phase, total_eligible_providers, is_active, created_at
              ) VALUES ($1, 'unique', 1, true, NOW())
            `, [request.id]);
          }
          
          // Create lead offer
          await pool.query(`
            INSERT INTO lead_offers (
              request_id, provider_id, offer_type, lead_cost, status, sort_order,
              is_current_offer, offer_start_time, expires_at, created_at
            )
            VALUES ($1, 7, 'unique', '15.00', 'active', 0, true, NOW(), NOW() + INTERVAL '24 hours', NOW())
            ON CONFLICT DO NOTHING
          `, [request.id]);
          
          console.log(`✓ Created offer for request ${request.id}`);
        }
      } else {
        console.log('\n4. ✓ All matching requests already have lead offers for provider 7');
      }
    }
    
    // 6. Check for requests in other areas that provider might want to cover
    console.log('\n6. Other active requests in Brisbane area (postcodes 4000-4999):');
    const brisbaneRequests = await pool.query(`
      SELECT 
        sr.id, 
        sr.category_id, 
        sc.name as category_name,
        sr.postcode, 
        sr.suburb, 
        sr.status, 
        sr.created_at
      FROM service_requests sr
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE sr.postcode LIKE '4%'
        AND sr.status = 'active'
        AND sr.category_id = ANY($1)
      ORDER BY sr.created_at DESC
      LIMIT 10
    `, [categoryIds]);
    
    console.log('Other Brisbane area requests:', brisbaneRequests.rows);
    
    // 7. Final check - what leads should be visible in provider dashboard
    console.log('\n7. Final verification - leads that should be visible to provider 7:');
    const visibleLeads = await pool.query(`
      SELECT 
        lo.request_id,
        sr.category_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        lo.created_at
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND sr.status = 'active'
        AND lo.status IN ('active', 'pending')
      ORDER BY lo.created_at DESC
    `);
    
    console.log('Leads visible to provider 7:', visibleLeads.rows);
    
    await pool.end();
    console.log('\n✅ ANALYSIS COMPLETED!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMissingLeads();