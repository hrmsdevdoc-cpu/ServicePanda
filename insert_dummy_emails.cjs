const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function insertDummyEmails() {
  try {
    console.log('📧 Inserting dummy emails into the database...\n');

    // Dummy email 1 - Follow up email to potential provider
    const email1 = {
      from: 'admin@servicepanda.com.au',
      to: 'john.doe@example.com',
      subject: 'Follow up on your application',
      body: 'Hi John,\n\nThank you for your interest in joining ServicePanda as a service provider. We would like to follow up on your application.\n\nPlease let us know if you have any questions or if you need any additional information.\n\nBest regards,\nServicePanda Team',
      bodyHtml: '<p>Hi John,</p><p>Thank you for your interest in joining ServicePanda as a service provider. We would like to follow up on your application.</p><p>Please let us know if you have any questions or if you need any additional information.</p><p>Best regards,<br>ServicePanda Team</p>',
      status: 'sent',
      folder: 'sent',
      userType: 'admin',
      providerId: null,
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    };

    // Dummy email 2 - Welcome email to potential provider
    const email2 = {
      from: 'admin@servicepanda.com.au',
      to: 'sarah.wilson@example.com',
      subject: 'Welcome to ServicePanda - Next Steps',
      body: 'Hi Sarah,\n\nWelcome to ServicePanda! We are excited to have you join our platform.\n\nTo complete your registration, please:\n1. Upload your required documents\n2. Complete your profile\n3. Set your service areas\n\nIf you need any assistance, please don\'t hesitate to contact us.\n\nBest regards,\nServicePanda Team',
      bodyHtml: '<p>Hi Sarah,</p><p>Welcome to ServicePanda! We are excited to have you join our platform.</p><p>To complete your registration, please:</p><ol><li>Upload your required documents</li><li>Complete your profile</li><li>Set your service areas</li></ol><p>If you need any assistance, please don\'t hesitate to contact us.</p><p>Best regards,<br>ServicePanda Team</p>',
      status: 'sent',
      folder: 'sent',
      userType: 'admin',
      providerId: null,
      sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    };

    // Insert first email
    console.log('Inserting email 1...');
    const result1 = await pool.query(`
      INSERT INTO emails ("from", "to", subject, body, body_html, status, folder, user_type, provider_id, sent_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      email1.from,
      email1.to,
      email1.subject,
      email1.body,
      email1.bodyHtml,
      email1.status,
      email1.folder,
      email1.userType,
      email1.providerId,
      email1.sentAt,
      email1.createdAt,
      email1.updatedAt
    ]);
    console.log(`✅ Email 1 inserted with ID: ${result1.rows[0].id}`);

    // Insert second email
    console.log('Inserting email 2...');
    const result2 = await pool.query(`
      INSERT INTO emails ("from", "to", subject, body, body_html, status, folder, user_type, provider_id, sent_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      email2.from,
      email2.to,
      email2.subject,
      email2.body,
      email2.bodyHtml,
      email2.status,
      email2.folder,
      email2.userType,
      email2.providerId,
      email2.sentAt,
      email2.createdAt,
      email2.updatedAt
    ]);
    console.log(`✅ Email 2 inserted with ID: ${result2.rows[0].id}`);

    // Check total emails
    const countResult = await pool.query('SELECT COUNT(*) as count FROM emails');
    console.log(`\n📊 Total emails in database: ${countResult.rows[0].count}`);

    // Show all emails
    const allEmails = await pool.query(`
      SELECT id, "from", "to", subject, status, folder, user_type, sent_at 
      FROM emails 
      ORDER BY created_at DESC
    `);

    console.log('\n📬 All emails in database:');
    allEmails.rows.forEach((email, index) => {
      console.log(`${index + 1}. ID: ${email.id} | To: ${email.to} | Subject: ${email.subject} | Folder: ${email.folder} | Sent: ${email.sent_at}`);
    });

    console.log('\n✅ Dummy emails inserted successfully!');
    console.log('\n🌐 Now go to: http://localhost:4000/admin/email');
    console.log('📁 Check the "Sent" folder - you should see these 2 emails!');

  } catch (error) {
    console.error('❌ Error inserting dummy emails:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

insertDummyEmails();
