const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function checkServiceProviders() {
  try {
    console.log('🔍 Checking for service providers in database...\n');

    // Check if service_providers table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'service_providers'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ service_providers table does not exist');
      return;
    }

    // Count total service providers
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM service_providers`);
    console.log(`Total service providers in database: ${countResult.rows[0].total}`);

    if (countResult.rows[0].total > 0) {
      // Get all service providers with their details
      const providersResult = await pool.query(`
        SELECT id, first_name, last_name, email, status, provider_status, documents_uploaded, terms_accepted
        FROM service_providers 
        ORDER BY id
      `);

      console.log('\nService providers in database:');
      providersResult.rows.forEach(provider => {
        console.log(`- ${provider.first_name} ${provider.last_name} (${provider.email})`);
        console.log(`  Status: ${provider.status}, Provider Status: ${provider.provider_status}`);
        console.log(`  Documents: ${provider.documents_uploaded ? 'Yes' : 'No'}, Terms: ${provider.terms_accepted ? 'Yes' : 'No'}`);
        console.log('  ---');
      });
    } else {
      console.log('\n❌ No service providers found in database');
      console.log('💡 You may need to create a test service provider first');
    }

  } catch (error) {
    console.error('💥 Error checking service providers:', error.message);
  } finally {
    await pool.end();
  }
}

checkServiceProviders();
