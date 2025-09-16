const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda',
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function createTestProviderJohn() {
  try {
    console.log('🔧 Creating test service provider with john.smith@example.com...\n');

    // Check if test provider already exists
    const existingProvider = await pool.query(`
      SELECT id FROM service_providers WHERE email = 'john.smith@example.com'
    `);

    if (existingProvider.rows.length > 0) {
      console.log('✅ Test provider john.smith@example.com already exists');
      console.log('🔄 Updating password to password123...');
      
      // Update password
      const hashedPassword = await bcrypt.hash('password123', 10);
      await pool.query(`
        UPDATE service_providers 
        SET password = $1, status = 'approved', provider_status = 'activated', 
            documents_uploaded = true, terms_accepted = true
        WHERE email = 'john.smith@example.com'
      `, [hashedPassword]);
      
      console.log('✅ Password updated successfully');
      return;
    }

    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const result = await pool.query(`
      INSERT INTO service_providers (
        first_name, last_name, email, password, mobile_number, address, 
        business_name, status, provider_status, documents_uploaded, terms_accepted
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, first_name, last_name, email
    `, [
      'John', 'Smith', 'john.smith@example.com', hashedPassword, 
      '0412345678', '123 Test Street, Test City, NSW 2000',
      'John Smith Services', 'approved', 'activated', true, true
    ]);

    const provider = result.rows[0];
    console.log('✅ Test service provider created successfully:');
    console.log(`   ID: ${provider.id}`);
    console.log(`   Name: ${provider.first_name} ${provider.last_name}`);
    console.log(`   Email: ${provider.email}`);
    console.log(`   Password: ${testPassword}`);
    console.log('\n💡 Use these credentials to test API login:');
    console.log(`   Email: ${provider.email}`);
    console.log(`   Password: ${testPassword}`);

  } catch (error) {
    console.error('💥 Error creating test provider:', error.message);
  } finally {
    await pool.end();
  }
}

createTestProviderJohn();
