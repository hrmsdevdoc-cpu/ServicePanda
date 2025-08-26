const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64);
  return `${hash.toString('hex')}.${salt}`;
}

async function createTestProvider() {
  try {
    console.log('🔧 Creating test service provider...\n');

    // Check if test provider already exists
    const existingProvider = await pool.query(`
      SELECT id FROM service_providers WHERE email = 'test@servicepanda.com'
    `);

    if (existingProvider.rows.length > 0) {
      console.log('✅ Test provider already exists');
      return;
    }

    const testPassword = 'test123';
    const hashedPassword = await hashPassword(testPassword);

    const result = await pool.query(`
      INSERT INTO service_providers (
        first_name, last_name, email, password, mobile_number, address, 
        business_name, status, provider_status, documents_uploaded, terms_accepted
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, first_name, last_name, email
    `, [
      'Test', 'Provider', 'test@servicepanda.com', hashedPassword, 
      '0412345678', '123 Test Street, Test City, NSW 2000',
      'Test Business', 'approved', 'activated', true, true
    ]);

    const provider = result.rows[0];
    console.log('✅ Test service provider created successfully:');
    console.log(`   ID: ${provider.id}`);
    console.log(`   Name: ${provider.first_name} ${provider.last_name}`);
    console.log(`   Email: ${provider.email}`);
    console.log(`   Password: ${testPassword}`);
    console.log('\n💡 Use these credentials to test mobile login:');
    console.log(`   Email: ${provider.email}`);
    console.log(`   Password: ${testPassword}`);

  } catch (error) {
    console.error('💥 Error creating test provider:', error.message);
  } finally {
    await pool.end();
  }
}

createTestProvider();
