const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'servicepanda',
  password: '123456',
  port: 5432,
});

async function testSmsStatusUpdate() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing SMS status update...');
    
    // First, let's check the current structure of potential_providers table
    console.log('\n📋 Checking table structure:');
    const structureResult = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'potential_providers' 
      AND column_name LIKE '%sms%'
      ORDER BY column_name;
    `);
    
    console.log('SMS-related columns:');
    structureResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
    // Check current data for a specific provider (let's find Lavi kumar)
    console.log('\n👤 Checking Lavi kumar\'s current data:');
    const providerResult = await client.query(`
      SELECT id, first_name, last_name, phone, sms_delivery_status, first_sms_sent_at, second_sms_sent_at
      FROM potential_providers 
      WHERE first_name ILIKE '%lavi%' OR last_name ILIKE '%kumar%'
      LIMIT 5;
    `);
    
    console.log('Found providers:');
    providerResult.rows.forEach(row => {
      console.log(`  - ID: ${row.id}, Name: ${row.first_name} ${row.last_name}, Phone: ${row.phone}`);
      console.log(`    SMS Status: ${row.sms_delivery_status}, 1st SMS: ${row.first_sms_sent_at}, 2nd SMS: ${row.second_sms_sent_at}`);
    });
    
    // Test updating SMS status manually
    if (providerResult.rows.length > 0) {
      const providerId = providerResult.rows[0].id;
      console.log(`\n🔄 Testing manual SMS status update for provider ID ${providerId}...`);
      
      await client.query(`
        UPDATE potential_providers 
        SET sms_delivery_status = '1st_sent', 
            first_sms_sent_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
      `, [providerId]);
      
      console.log('✅ Manual update completed');
      
      // Verify the update
      const verifyResult = await client.query(`
        SELECT id, first_name, last_name, sms_delivery_status, first_sms_sent_at
        FROM potential_providers 
        WHERE id = $1
      `, [providerId]);
      
      console.log('📊 Verification:');
      verifyResult.rows.forEach(row => {
        console.log(`  - ID: ${row.id}, Name: ${row.first_name} ${row.last_name}`);
        console.log(`    SMS Status: ${row.sms_delivery_status}, 1st SMS: ${row.first_sms_sent_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testSmsStatusUpdate().catch(console.error);
