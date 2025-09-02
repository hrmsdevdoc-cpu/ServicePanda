const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
    
async function addProviderToLeads() {
  try {
    console.log('🔧 Adding New Provider to Existing Leads\n');

    // Find the new provider (abhay gupta)
    const newProvider = await pool.query(`
      SELECT id, first_name, last_name, email
      FROM service_providers 
      WHERE first_name = 'abhay' AND last_name = 'gupta'
      LIMIT 1
    `);
    
    if (newProvider.rows.length === 0) {
      console.log('❌ New provider not found');
      return;
    }
    
    const provider = newProvider.rows[0];
    console.log(`✅ Found provider: ${provider.first_name} ${provider.last_name} (ID: ${provider.id})`);

    // Get all active leads that this provider should be eligible for
    const eligibleLeads = await pool.query(`
      SELECT DISTINCT sr.id, sr.postcode, sr.category_id, sr.status, sr.created_at,
             sc.name as category_name
      FROM service_requests sr
      JOIN service_categories sc ON sr.category_id = sc.id
      JOIN provider_services ps ON sr.category_id = ps.category_id
      JOIN provider_postcode_coverage ppc ON ps.provider_id = ppc.provider_id
      WHERE ps.provider_id = $1 
        AND ppc.postcode = sr.postcode
        AND sr.status IN ('active', 'assigned')
        AND sr.created_at >= NOW() - INTERVAL '7 days'
      ORDER BY sr.created_at DESC
    `, [provider.id]);
    
    console.log(`Found ${eligibleLeads.rows.length} eligible leads for the new provider:`);
    
    for (const lead of eligibleLeads.rows) {
      console.log(`   Lead ${lead.id}: ${lead.category_name} in ${lead.postcode} (${lead.status})`);
      
      // Check if provider already has an offer for this lead
      const existingOffer = await pool.query(`
        SELECT 1 FROM lead_offers WHERE request_id = $1 AND provider_id = $2
      `, [lead.id, provider.id]);
      
      if (existingOffer.rows.length === 0) {
        console.log(`   Adding provider to Lead ${lead.id}...`);
        
        // Get lead settings for pricing
        const leadSettings = await pool.query(`
          SELECT * FROM lead_settings LIMIT 1
        `);
        
        const settings = leadSettings.rows[0] || {
          uniformUniquePrice: 25.00,
          uniformSharePrice: 12.00
        };
        
        // Check if lead is in shared phase
        const uniqueOffers = await pool.query(`
          SELECT COUNT(*) as count FROM lead_offers 
          WHERE request_id = $1 AND offer_type = 'unique'
        `, [lead.id]);
        
        const isInSharedPhase = uniqueOffers.rows[0].count > 0;
        
        if (isInSharedPhase) {
          // Add as shared offer
          await pool.query(`
            INSERT INTO lead_offers (
              request_id, provider_id, offer_type, status, lead_cost, 
              sort_order, is_current_offer, offer_start_time, created_at, updated_at
            ) VALUES ($1, $2, 'shared', 'pending', $3, 999, false, NOW(), NOW(), NOW())
          `, [lead.id, provider.id, settings.uniformSharePrice?.toString() || '12.00']);
          
          console.log(`   ✅ Added shared offer for Lead ${lead.id}`);
        } else {
          // Add to unique offer queue
          const totalUniqueOffers = await pool.query(`
            SELECT COUNT(*) as count FROM lead_offers 
            WHERE request_id = $1 AND offer_type = 'unique'
          `, [lead.id]);
          
          const nextSortOrder = totalUniqueOffers.rows[0].count + 1;
          
          await pool.query(`
            INSERT INTO lead_offers (
              request_id, provider_id, offer_type, status, lead_cost, 
              sort_order, is_current_offer, offer_start_time, created_at, updated_at
            ) VALUES ($1, $2, 'unique', 'pending', $3, $4, false, NULL, NOW(), NOW())
          `, [lead.id, provider.id, settings.uniformUniquePrice?.toString() || '25.00', nextSortOrder]);
          
          console.log(`   ✅ Added unique offer for Lead ${lead.id} (position ${nextSortOrder})`);
        }
      } else {
        console.log(`   Provider already has an offer for Lead ${lead.id}`);
      }
    }

    console.log('\n✅ Provider added to eligible leads!');
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addProviderToLeads(); 