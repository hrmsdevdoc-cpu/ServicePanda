const { Pool } = require('pg');
require('dotenv').config();

// Test different database URLs
const testUrls = [
  'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require',
  'postgresql://postgres:password@localhost:5432/servicepanda',
  'postgresql://postgres:password@localhost:5432/servicepandatracker'
];

async function testDatabaseConnection(url, name) {
  console.log(`\n🔍 Testing ${name}...`);
  console.log(`URL: ${url.replace(/:[^:@]+@/, ':***@')}`);
  
  try {
    const pool = new Pool({
      connectionString: url,
      ssl: url.includes('neon.tech') ? { rejectUnauthorized: false } : false
    });
    
    const client = await pool.connect();
    console.log(`✅ ${name} - Connection successful!`);
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ ${name} - Query successful: ${result.rows[0].current_time}`);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ ${name} - Connection failed: ${error.message}`);
    return false;
  }
}

async function testAllConnections() {
  console.log('🚀 Testing database connections...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const success = await testDatabaseConnection(testUrls[i], `Database ${i + 1}`);
    if (success) {
      console.log(`\n🎉 Working database found! Use this URL:`);
      console.log(`DATABASE_URL=${testUrls[i]}`);
      break;
    }
  }
}

testAllConnections();
