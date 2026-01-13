const { Client } = require('pg');

async function checkDatabaseDirectly() {
  const client = new Client({
    host: '13.201.64.152',
    port: 5432,
    database: 'servicepanda',
    user: 'servicepanda',
    password: 'servicepanda@8954',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Check lead_offers table directly
    console.log('\n📊 LEAD_OFFERS TABLE:');
    const leadOffersResult = await client.query(`
      SELECT 
        id,
        provider_id,
        request_id,
        status,
        offer_type,
        is_current_offer,
        lead_cost,
        created_at,
        expires_at,
        purchased_at
      FROM lead_offers 
      WHERE provider_id = 1 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    console.log(`Total lead_offers for provider 1: ${leadOffersResult.rows.length}`);
    leadOffersResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}, Status: ${row.status}, Type: ${row.offer_type}, Cost: $${row.lead_cost}, Created: ${row.created_at}`);
    });

    // Check what the actual query returns (same as getProviderActivityHistory)
    console.log('\n🔍 ACTUAL QUERY RESULT:');
    const actualQueryResult = await client.query(`
      SELECT 
        lo.id,
        lo.request_id,
        sc.name as category_name,
        sr.suburb,
        sr.postcode,
        lo.lead_cost,
        lo.offer_type,
        lo.status,
        lo.is_current_offer,
        lo.expires_at,
        lo.purchased_at,
        lo.created_at,
        sr.description,
        sr.urgency
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 1
      ORDER BY lo.created_at DESC
      LIMIT 50
    `);
    
    console.log(`Query returned: ${actualQueryResult.rows.length} rows`);
    actualQueryResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. [${row.created_at}] ${row.status} - ${row.category_name} in ${row.suburb} ($${row.lead_cost})`);
    });

    // Check if there are more records beyond the limit
    console.log('\n📈 TOTAL COUNT CHECK:');
    const totalCountResult = await client.query(`
      SELECT COUNT(*) as total
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 1
    `);
    
    console.log(`Total records available: ${totalCountResult.rows[0].total}`);

    // Check recent records (today)
    console.log('\n📅 TODAY\'S RECORDS:');
    const todayResult = await client.query(`
      SELECT 
        lo.id,
        lo.status,
        sc.name as category_name,
        sr.suburb,
        lo.created_at
      FROM lead_offers lo
      INNER JOIN service_requests sr ON lo.request_id = sr.id
      INNER JOIN service_categories sc ON sr.category_id = sc.id
      WHERE lo.provider_id = 1
        AND lo.created_at >= CURRENT_DATE
      ORDER BY lo.created_at DESC
    `);
    
    console.log(`Today's records: ${todayResult.rows.length}`);
    todayResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. [${row.created_at}] ${row.status} - ${row.category_name} in ${row.suburb}`);
    });

  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabaseDirectly();
