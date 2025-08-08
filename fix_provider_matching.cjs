const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fixProviderMatching() {
  try {
    console.log('🔧 Fixing Provider Lead Matching for New Provider\n');

    // 1. Find the new provider (abhay gupta)
    console.log('1️⃣ Finding new provider...');
    const newProvider = await pool.query(`
      SELECT id, first_name, last_name, email, status, provider_status
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

    // 2. Get all active leads that this provider should be eligible for
    console.log('\n2️⃣ Finding eligible leads for the new provider...');
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
    eligibleLeads.rows.forEach(lead => {
      console.log(`   Lead ${lead.id}: ${lead.category_name} in ${lead.postcode} (${lead.status}) - Created: ${lead.created_at}`);
    });

    // 3. Check which leads already have offers for this provider
    console.log('\n3️⃣ Checking existing offers...');
    for (const lead of eligibleLeads.rows) {
      const existingOffers = await pool.query(`
        SELECT id, offer_type, status, created_at
        FROM lead_offers
        WHERE request_id = $1 AND provider_id = $2
      `, [lead.id, provider.id]);
      
      if (existingOffers.rows.length > 0) {
        console.log(`   Lead ${lead.id}: Already has ${existingOffers.rows.length} offer(s)`);
        existingOffers.rows.forEach(offer => {
          console.log(`     - ${offer.offer_type} offer (${offer.status})`);
        });
      } else {
        console.log(`   Lead ${lead.id}: No offers found - will add new offer`);
        
        // 4. Add the provider to this lead
        await addProviderToLead(lead.id, provider.id, lead.category_id);
      }
    }

    // 5. Check if there are any leads that should be eligible but aren't covered by postcode
    console.log('\n4️⃣ Checking for leads that might be eligible via distance...');
    const allActiveLeads = await pool.query(`
      SELECT sr.id, sr.postcode, sr.category_id, sr.status, sr.created_at,
             sc.name as category_name
      FROM service_requests sr
      JOIN service_categories sc ON sr.category_id = sc.id
      WHERE sr.status IN ('active', 'assigned')
        AND sr.created_at >= NOW() - INTERVAL '7 days'
      ORDER BY sr.created_at DESC
    `);
    
    for (const lead of allActiveLeads.rows) {
      // Check if provider offers this service
      const providerService = await pool.query(`
        SELECT 1 FROM provider_services 
        WHERE provider_id = $1 AND category_id = $2
      `, [provider.id, lead.category_id]);
      
      if (providerService.rows.length === 0) {
        continue; // Provider doesn't offer this service
      }
      
      // Check if provider has service areas that cover this postcode
      const serviceAreas = await pool.query(`
        SELECT center_lat, center_lng, radius_km, center_address
        FROM provider_service_areas
        WHERE provider_id = $1 AND center_lat IS NOT NULL AND center_lng IS NOT NULL
      `, [provider.id]);
      
      if (serviceAreas.rows.length === 0) {
        continue; // No service areas with coordinates
      }
      
      // Get postcode coordinates
      const postcodeCoords = await pool.query(`
        SELECT latitude, longitude FROM australian_suburbs WHERE postcode = $1 LIMIT 1
      `, [lead.postcode]);
      
      if (postcodeCoords.rows.length === 0) {
        continue; // No coordinates for this postcode
      }
      
      const targetLat = parseFloat(postcodeCoords.rows[0].latitude);
      const targetLng = parseFloat(postcodeCoords.rows[0].longitude);
      
      // Check if any service area covers this postcode
      for (const area of serviceAreas.rows) {
        const distance = calculateDistance(
          targetLat,
          targetLng,
          parseFloat(area.center_lat),
          parseFloat(area.center_lng)
        );
        
        if (distance <= parseInt(area.radius_km.toString())) {
          console.log(`   Lead ${lead.id}: Provider is within service area (${distance.toFixed(2)}km from ${area.center_address})`);
          
          // Check if provider already has an offer for this lead
          const existingOffer = await pool.query(`
            SELECT 1 FROM lead_offers WHERE request_id = $1 AND provider_id = $2
          `, [lead.id, provider.id]);
          
          if (existingOffer.rows.length === 0) {
            console.log(`   Adding provider to Lead ${lead.id}...`);
            await addProviderToLead(lead.id, provider.id, lead.category_id);
          }
          break;
        }
      }
    }

    console.log('\n✅ Provider matching fix completed!');
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function addProviderToLead(requestId, providerId, categoryId) {
  try {
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
    `, [requestId]);
    
    const isInSharedPhase = uniqueOffers.rows[0].count > 0;
    
    if (isInSharedPhase) {
      // Add as shared offer
      await pool.query(`
        INSERT INTO lead_offers (
          request_id, provider_id, offer_type, status, lead_cost, 
          sort_order, is_current_offer, offer_start_time, created_at, updated_at
        ) VALUES ($1, $2, 'shared', 'pending', $3, 999, false, NOW(), NOW(), NOW())
      `, [requestId, providerId, settings.uniformSharePrice?.toString() || '12.00']);
      
      console.log(`   ✅ Added shared offer for Lead ${requestId}`);
    } else {
      // Add to unique offer queue
      const totalUniqueOffers = await pool.query(`
        SELECT COUNT(*) as count FROM lead_offers 
        WHERE request_id = $1 AND offer_type = 'unique'
      `, [requestId]);
      
      const nextSortOrder = totalUniqueOffers.rows[0].count + 1;
      
      await pool.query(`
        INSERT INTO lead_offers (
          request_id, provider_id, offer_type, status, lead_cost, 
          sort_order, is_current_offer, offer_start_time, created_at, updated_at
        ) VALUES ($1, $2, 'unique', 'pending', $3, $4, false, NULL, NOW(), NOW())
      `, [requestId, providerId, settings.uniformUniquePrice?.toString() || '25.00', nextSortOrder]);
      
      console.log(`   ✅ Added unique offer for Lead ${requestId} (position ${nextSortOrder})`);
    }
  } catch (error) {
    console.error(`Error adding provider to lead ${requestId}:`, error);
  }
}

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI/180);
}

fixProviderMatching(); 