const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function checkDummyData() {
  try {
    console.log('Checking dummy data in database...\n');

    // Check if potential_providers table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'potential_providers'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ potential_providers table does not exist');
      return;
    }

    // Count total providers
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM potential_providers`);
    console.log(`Total providers in database: ${countResult.rows[0].total}`);

    // Count dummy providers
    const dummyCountResult = await pool.query(`SELECT COUNT(*) as dummy_count FROM potential_providers WHERE source = 'dummy'`);
    console.log(`Dummy providers in database: ${dummyCountResult.rows[0].dummy_count}`);

    // Get all providers with their status
    const providersResult = await pool.query(`
      SELECT id, first_name, last_name, email, status, priority, source 
      FROM potential_providers 
      ORDER BY id
    `);

    if (providersResult.rows.length > 0) {
      console.log('\nProviders in database:');
      providersResult.rows.forEach(provider => {
        console.log(`- ${provider.first_name} ${provider.last_name} (${provider.email}) - Status: ${provider.status}, Priority: ${provider.priority}, Source: ${provider.source}`);
      });
    } else {
      console.log('\n❌ No providers found in database');
    }

    // Check status distribution
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM potential_providers 
      GROUP BY status 
      ORDER BY status
    `);

    console.log('\nStatus distribution:');
    statusResult.rows.forEach(row => {
      console.log(`- ${row.status}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error checking data:', error.message);
  } finally {
    await pool.end();
  }
}

checkDummyData();
