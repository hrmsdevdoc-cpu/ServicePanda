const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testEmailStorage() {
  try {
    console.log('🧪 Testing email storage functionality...\n');

    // 1. Check current email count
    const beforeCount = await pool.query('SELECT COUNT(*) as count FROM emails');
    console.log(`📊 Emails in database before test: ${beforeCount.rows[0].count}`);

    // 2. Insert a test email (simulating what our code does)
    const testEmail = {
      from: 'admin@servicepanda.com.au',
      to: 'test@example.com',
      subject: 'Test Email - Follow up on your application',
      body: 'Hi Test User,\n\nThank you for your interest in joining ServicePanda as a service provider.\n\nBest regards,\nServicePanda Team',
      bodyHtml: '<p>Hi Test User,</p><p>Thank you for your interest in joining ServicePanda as a service provider.</p><p>Best regards,<br>ServicePanda Team</p>',
      status: 'sent',
      folder: 'sent',
      userType: 'admin',
      providerId: null,
      sentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await pool.query(`
      INSERT INTO emails (from_email, to_email, subject, body, body_html, status, folder, user_type, provider_id, sent_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      testEmail.from,
      testEmail.to,
      testEmail.subject,
      testEmail.body,
      testEmail.bodyHtml,
      testEmail.status,
      testEmail.folder,
      testEmail.userType,
      testEmail.providerId,
      testEmail.sentAt,
      testEmail.createdAt,
      testEmail.updatedAt
    ]);

    console.log(`✅ Test email inserted with ID: ${insertResult.rows[0].id}`);

    // 3. Check email count after insertion
    const afterCount = await pool.query('SELECT COUNT(*) as count FROM emails');
    console.log(`📊 Emails in database after test: ${afterCount.rows[0].count}`);

    // 4. Verify the email appears in sent folder
    const sentEmails = await pool.query(`
      SELECT id, from_email, to_email, subject, status, folder, user_type, sent_at 
      FROM emails 
      WHERE folder = 'sent' AND user_type = 'admin' 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('\n📬 Recent sent emails:');
    sentEmails.rows.forEach((email, index) => {
      console.log(`${index + 1}. ID: ${email.id} | To: ${email.to_email} | Subject: ${email.subject} | Sent: ${email.sent_at}`);
    });

    console.log('\n✅ Email storage test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to /admin/potential-providers page');
    console.log('2. Send an email to a potential provider');
    console.log('3. Check the /admin/email page to see if it appears in the "Sent" folder');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testEmailStorage();
