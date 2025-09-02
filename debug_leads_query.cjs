const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function debugLeadsQuery() {
  try {
    console.log('Debugging provider leads query...\n');

    // Check what leads exist for provider 2
    console.log('=== Checking lead offers for provider 2 ===');
    const offersResult = await pool.query(`
      SELECT id, request_id, provider_id, status, offer_type, is_current_offer, lead_cost
      FROM lead_offers 
      WHERE provider_id = 2
      ORDER BY id
    `);
    
    console.log(`Provider 2 has ${offersResult.rows.length} lead offers:`);
    offersResult.rows.forEach((offer, i) => {
      console.log(`  ${i + 1}. ID: ${offer.id}, Request: ${offer.request_id}, Status: ${offer.status}, Type: ${offer.offer_type}, Current: ${offer.is_current_offer}`);
    });

    // Check the service requests for these offers
    if (offersResult.rows.length > 0) {
      const requestIds = offersResult.rows.map(o => o.request_id);
      console.log(`\n=== Checking service requests for offers: ${requestIds.join(', ')} ===`);
      
      const requestsResult = await pool.query(`
        SELECT id, category_id, customer_id, status, preferred_date, created_at
        FROM service_requests 
        WHERE id = ANY($1)
        ORDER BY id
      `, [requestIds]);
      
      console.log(`Found ${requestsResult.rows.length} service requests:`);
      requestsResult.rows.forEach((req, i) => {
        console.log(`  ${i + 1}. ID: ${req.id}, Status: ${req.status}, Preferred Date: ${req.preferred_date}, Created: ${req.created_at}`);
      });

      // Check if any leads meet the criteria for active leads
      console.log(`\n=== Checking which leads meet active criteria ===`);
      
      // The server filters out leads that have expired (24 hours before preferred date)
      const now = new Date();
      const activeRequests = requestsResult.rows.filter(req => {
        if (!req.preferred_date) return false;
        const preferredDate = new Date(req.preferred_date);
        const expiryTime = new Date(preferredDate.getTime() - (24 * 60 * 60 * 1000)); // 24 hours before
        return now < expiryTime;
      });
      
      console.log(`Leads that haven't expired: ${activeRequests.length}`);
      activeRequests.forEach((req, i) => {
        const preferredDate = new Date(req.preferred_date);
        const expiryTime = new Date(preferredDate.getTime() - (24 * 60 * 60 * 1000));
        console.log(`  ${i + 1}. ID: ${req.id}, Preferred: ${req.preferred_date}, Expires: ${expiryTime.toISOString()}`);
      });

      // Check the exact query the server would run
      console.log(`\n=== Simulating server query ===`);
      const serverQueryResult = await pool.query(`
        SELECT 
          sr.id as "requestId",
          sc.name as "categoryName",
          CONCAT(u.first_name, ' ', u.last_name) as "customerName",
          u.email as "customerEmail",
          u.phone_number as "customerPhone",
          sr.suburb,
          sr.postcode,
          sr.preferred_date as "preferredDate",
          sr.booking_type as "bookingType",
          sr.description,
          sr.urgency,
          sr.budget,
          lo.offer_type as "offerType",
          lo.lead_cost as "leadCost",
          lo.status,
          lo.is_current_offer as "isCurrentOffer",
          lo.expires_at as "expiresAt",
          lo.purchased_at as "purchasedAt",
          sr.created_at as "createdAt"
        FROM lead_offers lo
        INNER JOIN service_requests sr ON lo.request_id = sr.id
        INNER JOIN service_categories sc ON sr.category_id = sc.id
        INNER JOIN users u ON sr.customer_id = u.id
        WHERE lo.provider_id = 2
        AND (
          (lo.status = 'pending' AND lo.is_current_offer = true AND lo.offer_type = 'unique')
          OR (lo.status = 'pending' AND lo.offer_type = 'shared')
          OR lo.status = 'purchased'
        )
        AND sr.preferred_date > (CURRENT_TIMESTAMP + INTERVAL '24 hours')
        ORDER BY sr.created_at DESC
      `);
      
      console.log(`Server query returned: ${serverQueryResult.rows.length} leads`);
      if (serverQueryResult.rows.length > 0) {
        console.log('Sample result:');
        const sample = serverQueryResult.rows[0];
        console.log(`  - Request ID: ${sample.requestId}`);
        console.log(`  - Category: ${sample.categoryName}`);
        console.log(`  - Customer: ${sample.customerName}`);
        console.log(`  - Status: ${sample.status}`);
        console.log(`  - Preferred Date: ${sample.preferredDate}`);
      }
    }

  } catch (error) {
    console.error('❌ Error debugging leads query:', error.message);
  } finally {
    await pool.end();
  }
}

debugLeadsQuery();
