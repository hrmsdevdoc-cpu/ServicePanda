const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function checkLeadsData() {
  try {
    console.log('Checking leads data in database...\n');

    // Check service requests (leads)
    const requestsResult = await pool.query('SELECT COUNT(*) as total FROM service_requests');
    console.log(`Service Requests (Leads): ${requestsResult.rows[0].total}`);

    if (requestsResult.rows[0].total > 0) {
      const sampleRequests = await pool.query('SELECT id, category_id, customer_id, status, created_at FROM service_requests LIMIT 3');
      console.log('Sample requests:');
      sampleRequests.rows.forEach((req, i) => {
        console.log(`  ${i + 1}. ID: ${req.id}, Category: ${req.category_id}, Customer: ${req.customer_id}, Status: ${req.status}`);
      });
    }

    // Check lead offers
    const offersResult = await pool.query('SELECT COUNT(*) as total FROM lead_offers');
    console.log(`\nLead Offers: ${offersResult.rows[0].total}`);

    if (offersResult.rows[0].total > 0) {
      const sampleOffers = await pool.query('SELECT id, request_id, provider_id, status, offer_type FROM lead_offers LIMIT 3');
      console.log('Sample offers:');
      sampleOffers.rows.forEach((offer, i) => {
        console.log(`  ${i + 1}. ID: ${offer.id}, Request: ${offer.request_id}, Provider: ${offer.provider_id}, Status: ${offer.status}, Type: ${offer.offer_type}`);
      });
    }

    // Check service providers
    const providersResult = await pool.query('SELECT COUNT(*) as total FROM service_providers');
    console.log(`\nService Providers: ${providersResult.rows[0].total}`);

    if (providersResult.rows[0].total > 0) {
      const sampleProviders = await pool.query('SELECT id, first_name, last_name, email FROM service_providers LIMIT 3');
      console.log('Sample providers:');
      sampleProviders.rows.forEach((provider, i) => {
        console.log(`  ${i + 1}. ID: ${provider.id}, Name: ${provider.first_name} ${provider.last_name}, Email: ${provider.email}`);
      });

      // Check if there are any leads for the first provider
      const firstProviderId = sampleProviders.rows[0].id;
      const providerLeadsResult = await pool.query(
        'SELECT COUNT(*) as total FROM lead_offers WHERE provider_id = $1',
        [firstProviderId]
      );
      console.log(`\nProvider ${firstProviderId} has ${providerLeadsResult.rows[0].total} lead offers`);
    }

  } catch (error) {
    console.error('❌ Error checking leads data:', error.message);
  } finally {
    await pool.end();
  }
}

checkLeadsData();
