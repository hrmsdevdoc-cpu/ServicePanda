const { Client } = require('pg');
require('dotenv').config();

async function checkSmsStatus() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Check all customers and their SMS status
    console.log('📱 Checking all customers and their SMS status...');
    const customers = await client.query(`
      SELECT id, name, phone, sms_delivery_status, 
             first_sms_sent_at, second_sms_sent_at,
             created_at, updated_at
      FROM potential_customers 
      ORDER BY id
    `);
    
    console.log(`\n📊 Found ${customers.rows.length} customers:\n`);
    
    let canReceiveSms = 0;
    let alreadySent2 = 0;
    let invalidPhone = 0;
    
    customers.rows.forEach((customer, index) => {
      const status = customer.sms_delivery_status || 'not_sent';
      const phone = customer.phone;
      
      // Check if phone is valid
      const isValidPhone = phone && phone !== '0000000000' && phone.length >= 10;
      
      let statusIcon = '❌';
      let statusText = status;
      
      if (!isValidPhone) {
        statusIcon = '🚫';
        statusText = 'Invalid Phone';
        invalidPhone++;
      } else if (status === '2nd_sent') {
        statusIcon = '✅';
        statusText = 'Sent 2 SMS';
        alreadySent2++;
      } else if (status === '1st_sent') {
        statusIcon = '⚠️';
        statusText = 'Sent 1 SMS';
        canReceiveSms++;
      } else {
        statusIcon = '🆕';
        statusText = 'Not Sent';
        canReceiveSms++;
      }
      
      console.log(`${index + 1}. ${statusIcon} ${customer.name} (${phone})`);
      console.log(`   Status: ${statusText}`);
      console.log(`   1st SMS: ${customer.first_sms_sent_at || 'Not sent'}`);
      console.log(`   2nd SMS: ${customer.second_sms_sent_at || 'Not sent'}`);
      console.log('');
    });

    console.log('📈 Summary:');
    console.log(`   🆕 Can receive SMS: ${canReceiveSms} customers`);
    console.log(`   ✅ Already sent 2 SMS: ${alreadySent2} customers`);
    console.log(`   🚫 Invalid phone numbers: ${invalidPhone} customers`);
    
    // Show customers who can receive SMS
    if (canReceiveSms > 0) {
      console.log('\n🎯 Customers who can still receive SMS:');
      customers.rows.forEach((customer, index) => {
        const status = customer.sms_delivery_status || 'not_sent';
        const phone = customer.phone;
        const isValidPhone = phone && phone !== '0000000000' && phone.length >= 10;
        
        if (isValidPhone && status !== '2nd_sent') {
          console.log(`   - ${customer.name} (${phone}) - Status: ${status}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkSmsStatus();
