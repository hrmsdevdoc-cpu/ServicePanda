const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepandatracker'
});

async function checkUserAndLeads() {
  try {
    // Check if hrms.devdoc@gmail.com exists as provider
    const providerQuery = await pool.query(
      'SELECT id, email, first_name, last_name, status, approved, provider_status FROM service_providers WHERE email = $1', 
      ['hrms.devdoc@gmail.com']
    );
    console.log('Provider check:', providerQuery.rows);
    
    // Check if it exists as customer
    const customerQuery = await pool.query(
      'SELECT id, email, first_name, last_name FROM users WHERE email = $1', 
      ['hrms.devdoc@gmail.com']
    );
    console.log('Customer check:', customerQuery.rows);
    
    // Check recent service requests
    const recentRequests = await pool.query(
      'SELECT id, customer_id, category_id, postcode, suburb, status, created_at FROM service_requests ORDER BY created_at DESC LIMIT 5'
    );
    console.log('Recent service requests:', recentRequests.rows);
    
    // Check lead offers for recent requests
    if (recentRequests.rows.length > 0) {
      const leadOffers = await pool.query(
        'SELECT request_id, provider_id, offer_type, status, created_at FROM lead_offers WHERE request_id = $1', 
        [recentRequests.rows[0].id]
      );
      console.log('Lead offers for latest request:', leadOffers.rows);
    }
    
    // Check if provider has service categories and service areas
    if (providerQuery.rows.length > 0) {
      const providerId = providerQuery.rows[0].id;
      
      const services = await pool.query(
        'SELECT category_id FROM provider_services WHERE provider_id = $1', 
        [providerId]
      );
      console.log('Provider services:', services.rows);
      
      const postcodeCoverage = await pool.query(
        'SELECT postcode FROM provider_postcode_coverage WHERE provider_id = $1 LIMIT 5', 
        [providerId]
      );
      console.log('Provider postcode coverage:', postcodeCoverage.rows);
      
      const locationAreas = await pool.query(
        'SELECT id, area_name, center_address, radius_km FROM provider_location_service_areas WHERE provider_id = $1', 
        [providerId]
      );
      console.log('Provider location service areas:', locationAreas.rows);
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUserAndLeads();