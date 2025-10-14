const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createSmsMessagesTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating SMS messages table...');
    
    // Create SMS messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sms_messages (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        customer_name VARCHAR NOT NULL,
        customer_phone VARCHAR NOT NULL,
        message TEXT NOT NULL,
        direction VARCHAR(10) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'sent',
        campaign_id INTEGER,
        campaign_name VARCHAR,
        sent_at TIMESTAMP DEFAULT NOW(),
        received_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sms_messages_customer_id ON sms_messages(customer_id);
      CREATE INDEX IF NOT EXISTS idx_sms_messages_direction ON sms_messages(direction);
      CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON sms_messages(status);
      CREATE INDEX IF NOT EXISTS idx_sms_messages_campaign_id ON sms_messages(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_sms_messages_sent_at ON sms_messages(sent_at);
    `);
    
    console.log('✅ SMS messages table created successfully!');
    
    // Check if table was created
    const result = await client.query(`
      SELECT COUNT(*) as count FROM sms_messages;
    `);
    
    console.log(`📊 SMS messages table has ${result.rows[0].count} records`);
    
  } catch (error) {
    console.error('❌ Error creating SMS messages table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createSmsMessagesTable();
