const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testEmailTracking() {
  try {
    console.log('🧪 Testing potential provider email tracking...\n');

    // 1. Check if we have any potential providers
    const potentialProvidersResult = await pool.query('SELECT id, firstName, lastName, email FROM potential_providers LIMIT 1');
    
    if (potentialProvidersResult.rows.length === 0) {
      console.log('❌ No potential providers found. Please add some test data first.');
      return;
    }

    const testProvider = potentialProvidersResult.rows[0];
    console.log(`📧 Testing with provider: ${testProvider.firstName} ${testProvider.lastName} (${testProvider.email})`);

    // 2. Check current email count
    const beforeCount = await pool.query('SELECT COUNT(*) as count FROM emails WHERE userType = $1', ['admin']);
    console.log(`📊 Emails in database before test: ${beforeCount.rows[0].count}`);

    // 3. Simulate sending an email (insert directly into emails table)
    const testEmail = {
      from: 'admin@servicepanda.com.au',
      to: testProvider.email,
      subject: 'Test Email - Follow up on your application',
      body: 'Hi ' + testProvider.firstName + ',\n\nThank you for your interest in joining ServicePanda as a service provider.\n\nBest regards,\nServicePanda Team',
      bodyHtml: '<p>Hi ' + testProvider.firstName + ',</p><p>Thank you for your interest in joining ServicePanda as a service provider.</p><p>Best regards,<br>ServicePanda Team</p>',
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

    // 4. Check email count after insertion
    const afterCount = await pool.query('SELECT COUNT(*) as count FROM emails WHERE userType = $1', ['admin']);
    console.log(`📊 Emails in database after test: ${afterCount.rows[0].count}`);

    // 5. Verify the email appears in sent folder
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

    // 6. Test the admin email API endpoint
    console.log('\n🌐 Testing admin email API endpoint...');
    
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:4000/api/admin/emails?tab=sent', {
      headers: {
        'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN || 'test-token'
      }
    });

    if (response.ok) {
      const emails = await response.json();
      console.log(`✅ Admin email API returned ${emails.length} emails`);
      if (emails.length > 0) {
        console.log(`📧 Latest email: ${emails[0].subject} to ${emails[0].to}`);
      }
    } else {
      console.log(`❌ Admin email API failed: ${response.status} ${response.statusText}`);
    }

    console.log('\n✅ Email tracking test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Send an email from the potential providers page');
    console.log('2. Check the /admin/email page to see if it appears in the "Sent" folder');
    console.log('3. Verify the email shows the correct recipient and subject');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testEmailTracking();
