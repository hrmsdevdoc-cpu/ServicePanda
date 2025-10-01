const { Pool } = require('pg');

async function checkLeadsDirect() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda'
  });

  try {
    console.log('🔍 Checking leads directly from database...\n');

    // Check service requests
    console.log('1. Service Requests:');
    const requestsResult = await pool.query('SELECT id, category_id, postcode, status, created_at FROM service_requests ORDER BY created_at DESC LIMIT 5');
    console.log(`Found ${requestsResult.rows.length} service requests`);
    requestsResult.rows.forEach(req => {
      console.log(`  - ID: ${req.id}, Category: ${req.category_id}, Postcode: ${req.postcode}, Status: ${req.status}, Created: ${req.created_at}`);
    });

    // Check lead offers
    console.log('\n2. Lead Offers:');
    const offersResult = await pool.query('SELECT id, request_id, provider_id, status, offer_type, created_at FROM lead_offers ORDER BY created_at DESC LIMIT 10');
    console.log(`Found ${offersResult.rows.length} lead offers`);
    offersResult.rows.forEach(offer => {
      console.log(`  - ID: ${offer.id}, Request: ${offer.request_id}, Provider: ${offer.provider_id}, Status: ${offer.status}, Type: ${offer.offer_type}, Created: ${offer.created_at}`);
    });

    // Check providers
    console.log('\n3. Providers:');
    const providersResult = await pool.query('SELECT id, first_name, last_name, email, status FROM service_providers ORDER BY created_at DESC LIMIT 5');
    console.log(`Found ${providersResult.rows.length} providers`);
    providersResult.rows.forEach(provider => {
      console.log(`  - ID: ${provider.id}, Name: ${provider.first_name} ${provider.last_name}, Email: ${provider.email}, Status: ${provider.status}`);
    });

    // Check lead assignments
    console.log('\n4. Lead Assignments:');
    const assignmentsResult = await pool.query('SELECT id, request_id, provider_id, status, created_at FROM lead_assignments ORDER BY created_at DESC LIMIT 10');
    console.log(`Found ${assignmentsResult.rows.length} lead assignments`);
    assignmentsResult.rows.forEach(assignment => {
      console.log(`  - ID: ${assignment.id}, Request: ${assignment.request_id}, Provider: ${assignment.provider_id}, Status: ${assignment.status}, Created: ${assignment.created_at}`);
    });

    // Check if there are any pending leads for providers
    console.log('\n5. Pending Leads for Providers:');
    const pendingLeadsResult = await pool.query(`
      SELECT 
        lo.id,
        lo.request_id,
        lo.provider_id,
        lo.status,
        lo.offer_type,
        sr.category_id,
        sc.name as category_name,
        u.first_name,
        u.last_name,
        sr.suburb,
        sr.postcode
      FROM lead_offers lo
      JOIN service_requests sr ON lo.request_id = sr.id
      JOIN service_categories sc ON sr.category_id = sc.id
      JOIN users u ON sr.customer_id = u.id
      WHERE lo.status = 'pending'
      ORDER BY lo.created_at DESC
      LIMIT 10
    `);
    console.log(`Found ${pendingLeadsResult.rows.length} pending leads`);
    pendingLeadsResult.rows.forEach(lead => {
      console.log(`  - Offer ID: ${lead.id}, Request: ${lead.request_id}, Provider: ${lead.provider_id}, Category: ${lead.category_name}, Customer: ${lead.first_name} ${lead.last_name}, Location: ${lead.suburb} ${lead.postcode}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await pool.end();
  }
}

checkLeadsDirect();
