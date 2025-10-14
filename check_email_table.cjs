const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkEmailTable() {
  try {
    console.log('🔍 Checking email table structure...\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'emails' 
      ORDER BY ordinal_position
    `);
    
    console.log('Email table columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
    // Check if table exists and has data
    const countResult = await pool.query('SELECT COUNT(*) as count FROM emails');
    console.log(`\n📊 Total emails in table: ${countResult.rows[0].count}`);
    
    // Check for admin emails
    const adminEmails = await pool.query("SELECT COUNT(*) as count FROM emails WHERE user_type = 'admin'");
    console.log(`📧 Admin emails: ${adminEmails.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkEmailTable();
