const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function debugProviderMatching() {
  try {
    console.log('🔍 Debugging Provider Lead Matching Issues\n');

    // 1. Check all approved providers
    console.log('1️⃣ Checking all approved providers...');
    const approvedProviders = await pool.query(`
      SELECT id, first_name, last_name, email, status, provider_status, created_at
      FROM service_providers 
      WHERE status = 'approved' AND provider_status = 'activated'
      ORDER BY created_at DESC
    `);
    
    console.log(`Found ${approvedProviders.rows.length} approved providers:`);
    approvedProviders.rows.forEach(provider => {
      console.log(`   ${provider.first_name} ${provider.last_name} (${provider.email}) - Created: ${provider.created_at}`);
    });

    // 2. Check provider services (categories)
    console.log('\n2️⃣ Checking provider services...');
    const providerServices = await pool.query(`
      SELECT ps.provider_id, ps.category_id, sc.name as category_name, 
             sp.first_name, sp.last_name
      FROM provider_services ps
      JOIN service_categories sc ON ps.category_id = sc.id
      JOIN service_providers sp ON ps.provider_id = sp.id
      WHERE sp.status = 'approved' AND sp.provider_status = 'activated'
      ORDER BY sp.first_name, sc.name
    `);
    
    console.log('Provider services:');
    providerServices.rows.forEach(service => {
      console.log(`   ${service.first_name} ${service.last_name}: ${service.category_name}`);
    });

    // 3. Check provider service areas
    console.log('\n3️⃣ Checking provider service areas...');
    const serviceAreas = await pool.query(`
      SELECT psa.provider_id, psa.center_address, psa.center_lat, psa.center_lng, 
             psa.radius_km, psa.area_name, sp.first_name, sp.last_name
      FROM provider_service_areas psa
      JOIN service_providers sp ON psa.provider_id = sp.id
      WHERE sp.status = 'approved' AND sp.provider_status = 'activated'
      ORDER BY sp.first_name
    `);
    
    console.log('Provider service areas:');
    serviceAreas.rows.forEach(area => {
      console.log(`   ${area.first_name} ${area.last_name}: ${area.center_address} (${area.radius_km}km radius)`);
    });

    // 4. Check provider postcode coverage
    console.log('\n4️⃣ Checking provider postcode coverage...');
    const postcodeCoverage = await pool.query(`
      SELECT ppc.provider_id, ppc.postcode, ppc.distance, sp.first_name, sp.last_name
      FROM provider_postcode_coverage ppc
      JOIN service_providers sp ON ppc.provider_id = sp.id
      WHERE sp.status = 'approved' AND sp.provider_status = 'activated'
      ORDER BY sp.first_name, ppc.postcode
    `);
    
    console.log('Provider postcode coverage:');
    postcodeCoverage.rows.forEach(coverage => {
      console.log(`   ${coverage.first_name} ${coverage.last_name}: ${coverage.postcode} (${coverage.distance}km)`);
    });

    // 5. Check recent leads and their distribution
    console.log('\n5️⃣ Checking recent leads...');
    const recentLeads = await pool.query(`
      SELECT sr.id, sr.postcode, sr.category_id, sr.status, sr.created_at,
             sc.name as category_name
      FROM service_requests sr
      JOIN service_categories sc ON sr.category_id = sc.id
      ORDER BY sr.created_at DESC
      LIMIT 5
    `);
    
    console.log('Recent leads:');
    recentLeads.rows.forEach(lead => {
      console.log(`   Lead ${lead.id}: ${lead.category_name} in ${lead.postcode} (${lead.status}) - Created: ${lead.created_at}`);
    });

    // 6. Check lead offers for the most recent lead
    if (recentLeads.rows.length > 0) {
      const latestLead = recentLeads.rows[0];
      console.log(`\n6️⃣ Checking lead offers for Lead ${latestLead.id}...`);
      
      const leadOffers = await pool.query(`
        SELECT lo.id, lo.provider_id, lo.offer_type, lo.status, lo.created_at,
               sp.first_name, sp.last_name, sp.email
        FROM lead_offers lo
        JOIN service_providers sp ON lo.provider_id = sp.id
        WHERE lo.request_id = $1
        ORDER BY lo.sort_order
      `, [latestLead.id]);
      
      console.log(`Lead ${latestLead.id} offers:`);
      leadOffers.rows.forEach(offer => {
        console.log(`   ${offer.first_name} ${offer.last_name} (${offer.email}): ${offer.offer_type} - ${offer.status}`);
      });

      // 7. Test the getEligibleProviders function for this lead
      console.log(`\n7️⃣ Testing getEligibleProviders for Lead ${latestLead.id}...`);
      const eligibleProviders = await pool.query(`
        SELECT DISTINCT
          sp.id as provider_id,
          sp.first_name,
          sp.last_name,
          COALESCE(pr.rating, 5.0) as rating
        FROM service_providers sp
        INNER JOIN provider_services ps ON sp.id = ps.provider_id
        LEFT JOIN provider_ratings pr ON sp.id = pr.provider_id
        WHERE ps.category_id = $1 
          AND sp.status = 'approved' 
          AND sp.provider_status = 'activated'
        ORDER BY COALESCE(pr.rating, 5.0) DESC, sp.first_name
      `, [latestLead.category_id]);
      
      console.log(`Eligible providers for category ${latestLead.category_id}:`);
      eligibleProviders.rows.forEach(provider => {
        console.log(`   ${provider.first_name} ${provider.last_name} (Rating: ${provider.rating})`);
      });

      // 8. Check if any providers have postcode coverage for this lead's postcode
      console.log(`\n8️⃣ Checking postcode coverage for ${latestLead.postcode}...`);
      const postcodeProviders = await pool.query(`
        SELECT ppc.provider_id, ppc.postcode, ppc.distance, sp.first_name, sp.last_name
        FROM provider_postcode_coverage ppc
        JOIN service_providers sp ON ppc.provider_id = sp.id
        WHERE ppc.postcode = $1 AND sp.status = 'approved' AND sp.provider_status = 'activated'
        ORDER BY ppc.distance
      `, [latestLead.postcode]);
      
      console.log(`Providers with postcode coverage for ${latestLead.postcode}:`);
      if (postcodeProviders.rows.length > 0) {
        postcodeProviders.rows.forEach(provider => {
          console.log(`   ${provider.first_name} ${provider.last_name}: ${provider.distance}km away`);
        });
      } else {
        console.log('   No providers found with explicit postcode coverage');
      }

      // 9. Check distance-based matching for this postcode
      console.log(`\n9️⃣ Checking distance-based matching for ${latestLead.postcode}...`);
      const targetSuburb = await pool.query(`
        SELECT id, suburb, postcode, latitude, longitude
        FROM australian_suburbs
        WHERE postcode = $1
        LIMIT 1
      `, [latestLead.postcode]);
      
      if (targetSuburb.rows.length > 0) {
        const target = targetSuburb.rows[0];
        console.log(`Target location: ${target.suburb} (${target.latitude}, ${target.longitude})`);
        
        // Get all providers with service areas
        const providersWithAreas = await pool.query(`
          SELECT DISTINCT sp.id, sp.first_name, sp.last_name
          FROM service_providers sp
          JOIN provider_service_areas psa ON sp.id = psa.provider_id
          WHERE sp.status = 'approved' AND sp.provider_status = 'activated'
        `);
        
        console.log('Providers with service areas:');
        for (const provider of providersWithAreas.rows) {
          const serviceAreas = await pool.query(`
            SELECT center_lat, center_lng, radius_km, center_address
            FROM provider_service_areas
            WHERE provider_id = $1 AND center_lat IS NOT NULL AND center_lng IS NOT NULL
          `, [provider.id]);
          
          for (const area of serviceAreas.rows) {
            if (area.center_lat && area.center_lng && area.radius_km) {
              const distance = calculateDistance(
                parseFloat(target.latitude),
                parseFloat(target.longitude),
                parseFloat(area.center_lat),
                parseFloat(area.center_lng)
              );
              
              console.log(`   ${provider.first_name} ${provider.last_name} (${area.center_address}): ${distance.toFixed(2)}km away, radius: ${area.radius_km}km`);
              
              if (distance <= parseInt(area.radius_km.toString())) {
                console.log(`   ✓ ${provider.first_name} ${provider.last_name} is within service area!`);
              }
            }
          }
        }
      } else {
        console.log(`No coordinates found for postcode ${latestLead.postcode}`);
      }
    }

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
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

debugProviderMatching(); 