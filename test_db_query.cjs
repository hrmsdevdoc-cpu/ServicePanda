const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testDBQuery() {
  try {
    console.log('🧪 Testing database query...\n');

    // Test simple query
    const result = await pool.query('SELECT COUNT(*) as count FROM emails');
    console.log(`📊 Total emails in database: ${result.rows[0].count}`);

    // Test sent emails query
    const sentEmails = await pool.query(`
      SELECT id, "from", "to", subject, status, folder, user_type, sent_at 
      FROM emails 
      WHERE folder = 'sent' 
      ORDER BY created_at DESC
    `);
    
    console.log(`📧 Sent emails: ${sentEmails.rows.length}`);
    sentEmails.rows.forEach((email, index) => {
      console.log(`${index + 1}. ID: ${email.id} | To: ${email.to} | Subject: ${email.subject}`);
    });

    // Test all emails
    const allEmails = await pool.query(`
      SELECT id, "from", "to", subject, status, folder, user_type, created_at 
      FROM emails 
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📬 All emails: ${allEmails.rows.length}`);
    allEmails.rows.forEach((email, index) => {
      console.log(`${index + 1}. ID: ${email.id} | To: ${email.to} | Subject: ${email.subject} | Folder: ${email.folder}`);
    });

  } catch (error) {
    console.error('❌ Database query failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testDBQuery();
