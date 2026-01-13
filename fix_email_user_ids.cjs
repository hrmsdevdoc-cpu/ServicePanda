const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fixEmailUserIds() {
  try {
    console.log('🔧 Fixing email user IDs...\n');

    // Check current emails
    const beforeResult = await pool.query('SELECT id, user_id, user_type, folder FROM emails ORDER BY id');
    console.log('📧 Current emails:');
    beforeResult.rows.forEach(email => {
      console.log(`ID: ${email.id} | user_id: ${email.user_id} | user_type: ${email.user_type} | folder: ${email.folder}`);
    });

    // Update emails with user_id = '2' to user_id = NULL
    const updateResult = await pool.query("UPDATE emails SET user_id = NULL WHERE user_id = '2'");
    console.log(`\n✅ Updated ${updateResult.rowCount} emails`);

    // Check emails after update
    const afterResult = await pool.query('SELECT id, user_id, user_type, folder FROM emails ORDER BY id');
    console.log('\n📧 Emails after update:');
    afterResult.rows.forEach(email => {
      console.log(`ID: ${email.id} | user_id: ${email.user_id} | user_type: ${email.user_type} | folder: ${email.folder}`);
    });

    console.log('\n✅ Email user IDs fixed!');
    console.log('🌐 Now refresh the email page - folder counts should be correct!');

  } catch (error) {
    console.error('❌ Error fixing email user IDs:', error.message);
  } finally {
    await pool.end();
  }
}

fixEmailUserIds();
