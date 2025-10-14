const { Pool } = require('pg');

// Database configuration - using the same config as the server
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'servicepanda',
  password: '123456',
  port: 5432,
});

async function testLaviSmsStatus() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking Lavi kumar\'s SMS status...');
    
    // Find Lavi kumar
    const providerResult = await client.query(`
      SELECT id, first_name, last_name, phone, sms_delivery_status, first_sms_sent_at, second_sms_sent_at, status
      FROM potential_providers 
      WHERE first_name ILIKE '%lavi%' OR last_name ILIKE '%kumar%' OR phone = '0485901939'
      ORDER BY id DESC
      LIMIT 5;
    `);
    
    console.log('📋 Found providers:');
    providerResult.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ID: ${row.id}`);
      console.log(`   Name: ${row.first_name} ${row.last_name}`);
      console.log(`   Phone: ${row.phone}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   SMS Status: ${row.sms_delivery_status}`);
      console.log(`   1st SMS Sent: ${row.first_sms_sent_at}`);
      console.log(`   2nd SMS Sent: ${row.second_sms_sent_at}`);
    });
    
    // Check if there are any SMS messages for Lavi
    if (providerResult.rows.length > 0) {
      const laviId = providerResult.rows[0].id;
      console.log(`\n📱 Checking SMS messages for provider ID ${laviId}...`);
      
      const smsResult = await client.query(`
        SELECT id, recipient_type, recipient_id, recipient_phone, message, status, sent_at
        FROM sms_messages 
        WHERE recipient_id = $1 OR recipient_phone = $2
        ORDER BY sent_at DESC
        LIMIT 10;
      `, [laviId, '0485901939']);
      
      console.log(`📨 Found ${smsResult.rows.length} SMS messages:`);
      smsResult.rows.forEach((row, index) => {
        console.log(`\n${index + 1}. Message ID: ${row.id}`);
        console.log(`   Recipient Type: ${row.recipient_type}`);
        console.log(`   Recipient ID: ${row.recipient_id}`);
        console.log(`   Phone: ${row.recipient_phone}`);
        console.log(`   Status: ${row.status}`);
        console.log(`   Sent At: ${row.sent_at}`);
        console.log(`   Message: ${row.message?.substring(0, 50)}...`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testLaviSmsStatus().catch(console.error);
