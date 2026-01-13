const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'servicepanda',
  password: '123456',
  port: 5432,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running SMS status migration for potential providers...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '0010_add_sms_status_to_potential_providers.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ SMS status columns added to potential_providers table');
    
    // Verify the columns were added
    const result = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'potential_providers' 
      AND column_name IN ('sms_delivery_status', 'first_sms_sent_at', 'second_sms_sent_at')
      ORDER BY column_name;
    `);
    
    console.log('📋 New columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
