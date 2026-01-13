const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkEmails() {
  try {
    console.log('🔍 Checking emails in database...\n');

    const result = await pool.query(`
      SELECT id, user_id, user_type, folder, status, subject, "from", "to" 
      FROM emails 
      ORDER BY id
    `);

    console.log('📧 Current emails:');
    result.rows.forEach(email => {
      console.log(`ID: ${email.id} | user_id: ${email.user_id} | user_type: ${email.user_type} | folder: ${email.folder} | status: ${email.status}`);
      console.log(`   Subject: ${email.subject}`);
      console.log(`   From: ${email.from} | To: ${email.to}`);
      console.log('---');
    });

    console.log(`\n📊 Total emails: ${result.rows.length}`);

  } catch (error) {
    console.error('❌ Error checking emails:', error.message);
  } finally {
    await pool.end();
  }
}

checkEmails();
