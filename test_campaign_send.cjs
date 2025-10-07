const { Client } = require('pg');
require('dotenv').config();

async function testCampaignSend() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Get a campaign
    console.log('1. Getting a campaign...');
    const campaigns = await client.query('SELECT * FROM sms_campaigns LIMIT 1');
    
    if (campaigns.rows.length === 0) {
      console.log('❌ No campaigns found');
      return;
    }
    
    const campaign = campaigns.rows[0];
    console.log(`✅ Found campaign: ${campaign.name} (ID: ${campaign.id})`);
    console.log(`   Status: ${campaign.status}`);
    console.log(`   Message: ${campaign.message.substring(0, 100)}...`);

    // Get your test customer
    console.log('\n2. Getting your test customer...');
    const customers = await client.query(`
      SELECT * FROM potential_customers 
      WHERE phone LIKE '%0485901942%'
    `);
    
    if (customers.rows.length === 0) {
      console.log('❌ Your test customer not found');
      return;
    }
    
    const customer = customers.rows[0];
    console.log(`✅ Found customer: ${customer.name} (ID: ${customer.id})`);
    console.log(`   Phone: ${customer.phone}`);
    console.log(`   SMS Status: ${customer.sms_delivery_status}`);

    // Simulate the campaign sending logic
    console.log('\n3. Simulating campaign sending...');
    
    // Determine SMS type
    let smsType = '1st_sent';
    if (customer.sms_delivery_status === 'not_sent' || !customer.sms_delivery_status) {
      smsType = '1st_sent';
    } else if (customer.sms_delivery_status === '1st_sent') {
      smsType = '2nd_sent';
    }
    
    console.log(`   SMS Type: ${smsType}`);

    // Replace placeholders in message
    let message = campaign.message
      .replace(/\{customerName\}/g, customer.name)
      .replace(/\{voucherCode\}/g, campaign.voucher_code || '')
      .replace(/\{voucherAmount\}/g, campaign.voucher_amount?.toString() || '');
    
    console.log(`   Final Message: ${message.substring(0, 150)}...`);

    // Test SMS sending
    console.log('\n4. Testing SMS sending...');
    const axios = require('axios');
    
    const apiKey = '3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc';
    const apiUrl = 'https://dialpad.com/api/v2/sms';
    const fromNumber = '+61452229882';
    
    // Format phone number
    let formattedPhone = customer.phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+61' + formattedPhone.substring(1);
    }
    
    console.log(`   Sending to: ${customer.phone} -> ${formattedPhone}`);
    
    try {
      const response = await axios.post(
        `${apiUrl}?apikey=${encodeURIComponent(apiKey)}`,
        {
          infer_country_code: false,
          text: message,
          to_numbers: [formattedPhone],
          from_number: fromNumber,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ SMS sent successfully!');
      console.log(`   SMS ID: ${response.data.id}`);
      console.log(`   Status: ${response.data.message_status}`);
      
      // Update customer status
      console.log('\n5. Updating customer SMS status...');
      await client.query(`
        UPDATE potential_customers 
        SET sms_delivery_status = $1, 
            first_sms_sent_at = $2,
            updated_at = NOW()
        WHERE id = $3
      `, [smsType, new Date(), customer.id]);
      
      console.log(`✅ Customer status updated to: ${smsType}`);
      
    } catch (error) {
      console.error('❌ SMS sending failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testCampaignSend();
