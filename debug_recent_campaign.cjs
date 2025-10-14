const { Client } = require('pg');
require('dotenv').config();

async function debugRecentCampaign() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Check recent campaigns
    console.log('1. Checking recent campaigns...');
    const recentCampaigns = await client.query(`
      SELECT * FROM sms_campaigns 
      ORDER BY updated_at DESC 
      LIMIT 3
    `);
    
    console.log(`📊 Found ${recentCampaigns.rows.length} recent campaigns:`);
    recentCampaigns.rows.forEach((campaign, index) => {
      console.log(`   ${index + 1}. ${campaign.name} (ID: ${campaign.id})`);
      console.log(`      Status: ${campaign.status}`);
      console.log(`      Total Sent: ${campaign.total_sent}`);
      console.log(`      Updated: ${campaign.updated_at}`);
      console.log('');
    });

    // Check all customers and their SMS status
    console.log('2. Checking all customers and their SMS status...');
    const customers = await client.query(`
      SELECT id, name, phone, sms_delivery_status, 
             first_sms_sent_at, second_sms_sent_at,
             created_at, updated_at
      FROM potential_customers 
      ORDER BY updated_at DESC
    `);
    
    console.log(`📱 Found ${customers.rows.length} customers:`);
    customers.rows.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name} (${customer.phone})`);
      console.log(`      SMS Status: ${customer.sms_delivery_status || 'not_sent'}`);
      console.log(`      1st SMS: ${customer.first_sms_sent_at || 'Not sent'}`);
      console.log(`      2nd SMS: ${customer.second_sms_sent_at || 'Not sent'}`);
      console.log(`      Updated: ${customer.updated_at}`);
      console.log('');
    });

    // Check if there are any customers who can still receive SMS
    console.log('3. Checking customers who can still receive SMS...');
    const eligibleCustomers = customers.rows.filter(customer => {
      const status = customer.sms_delivery_status;
      return !status || status === 'not_sent' || status === '1st_sent';
    });
    
    console.log(`✅ ${eligibleCustomers.length} customers can still receive SMS:`);
    eligibleCustomers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name} (${customer.phone}) - Status: ${customer.sms_delivery_status || 'not_sent'}`);
    });

    // Test SMS sending to a fresh customer
    if (eligibleCustomers.length > 0) {
      console.log('\n4. Testing SMS to a fresh customer...');
      const testCustomer = eligibleCustomers[0];
      
      console.log(`   Testing with: ${testCustomer.name} (${testCustomer.phone})`);
      
      // Test direct SMS
      const axios = require('axios');
      const apiKey = '3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc';
      const apiUrl = 'https://dialpad.com/api/v2/sms';
      const fromNumber = '+61452229882';
      
      // Format phone number
      let formattedPhone = testCustomer.phone.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+61' + formattedPhone.substring(1);
      }
      
      const testMessage = `Test SMS from ServicePanda - ${new Date().toLocaleTimeString()}`;
      
      try {
        const response = await axios.post(
          `${apiUrl}?apikey=${encodeURIComponent(apiKey)}`,
          {
            infer_country_code: false,
            text: testMessage,
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
        
        console.log('✅ Test SMS sent successfully!');
        console.log(`   SMS ID: ${response.data.id}`);
        console.log(`   Status: ${response.data.message_status}`);
        console.log(`   To: ${testCustomer.phone} -> ${formattedPhone}`);
        
      } catch (error) {
        console.error('❌ Test SMS failed:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

debugRecentCampaign();
