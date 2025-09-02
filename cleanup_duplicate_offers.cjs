const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function cleanupDuplicateOffers() {
  try {
    console.log('=== CLEANING UP DUPLICATE OFFERS ===');
    
    // 1. Find requests with multiple offers for provider 7
    console.log('\n1. Finding requests with multiple offers...');
    const duplicates = await pool.query(`
      SELECT 
        request_id, 
        COUNT(*) as offer_count,
        array_agg(id ORDER BY created_at DESC) as offer_ids
      FROM lead_offers 
      WHERE provider_id = 7 
        AND status = 'pending'
      GROUP BY request_id
      HAVING COUNT(*) > 1
      ORDER BY request_id
    `);
    
    console.log('Requests with multiple offers:', duplicates.rows);
    
    // 2. For each request with duplicates, keep only the most recent offer
    for (const dup of duplicates.rows) {
      const keepOfferId = dup.offer_ids[0]; // Most recent (first in DESC order)
      const deleteOfferIds = dup.offer_ids.slice(1); // Rest to delete
      
      console.log(`\n2. Cleaning request ${dup.request_id}: keeping offer ${keepOfferId}, deleting ${deleteOfferIds.join(', ')}`);
      
      // Delete the older duplicate offers
      if (deleteOfferIds.length > 0) {
        await pool.query(`
          DELETE FROM lead_offers 
          WHERE id = ANY($1)
        `, [deleteOfferIds]);
        
        console.log(`✓ Deleted ${deleteOfferIds.length} duplicate offers for request ${dup.request_id}`);
      }
      
      // Ensure the kept offer is properly set up
      await pool.query(`
        UPDATE lead_offers 
        SET 
          is_current_offer = true,
          offer_start_time = COALESCE(offer_start_time, NOW()),
          expires_at = COALESCE(expires_at, NOW() + INTERVAL '7 days')
        WHERE id = $1
      `, [keepOfferId]);
    }
    
    // 3. Final verification - unique leads for provider 7
    console.log('\n3. Final verification - unique active leads:');
    const finalLeads = await pool.query(`
      SELECT 
        lo.request_id,
        sc.name as category_name,
        sr.postcode,
        sr.suburb,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        sr.description
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 7
        AND sr.status = 'active'
        AND lo.status = 'pending'
      ORDER BY sr.created_at DESC
    `);
    
    console.log('Unique active leads for provider 7:', finalLeads.rows);
    console.log(`\n🎉 CLEANUP COMPLETE! Provider 7 now has ${finalLeads.rows.length} unique leads available!`);
    
    console.log('\n📋 Your available leads:');
    finalLeads.rows.forEach((lead, index) => {
      console.log(`${index + 1}. Request #${lead.request_id}: ${lead.category_name}`);
      console.log(`   Location: ${lead.suburb} (${lead.postcode})`);
      console.log(`   Type: ${lead.offer_type} lead`);
      console.log(`   Description: ${lead.description?.substring(0, 100)}...`);
      console.log('');
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupDuplicateOffers();