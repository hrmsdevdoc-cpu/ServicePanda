const axios = require('axios');

async function testCampaignDetailed() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing campaign sending with detailed logging...');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Get a fresh customer (not Emma Wilson)
    console.log('\n2. Getting a fresh customer...');
    const customersResponse = await axios.get(`${baseUrl}/api/admin/potential-customers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const freshCustomer = customersResponse.data.find(c => 
      c.phone !== '0485901942' && 
      c.smsDeliveryStatus === 'not_sent'
    );
    
    if (!freshCustomer) {
      console.log('❌ No fresh customers found');
      return;
    }
    
    console.log(`✅ Found fresh customer: ${freshCustomer.name} (${freshCustomer.phone})`);
    
    // Step 3: Create a test campaign
    console.log('\n3. Creating test campaign...');
    const campaignData = {
      name: `Test Campaign - ${new Date().toLocaleTimeString()}`,
      message: `Hello {customerName}! This is a test SMS from ServicePanda at {time}. Reply STOP to unsubscribe.`,
      voucherCode: 'TEST123',
      voucherAmount: '10.00',
      selectedStates: ['Queensland'],
      selectedStatuses: ['New'],
      status: 'draft'
    };
    
    const createResponse = await axios.post(`${baseUrl}/api/admin/sms/campaigns`, campaignData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const campaignId = createResponse.data.id;
    console.log(`✅ Campaign created with ID: ${campaignId}`);
    
    // Step 4: Send campaign to fresh customer
    console.log('\n4. Sending campaign to fresh customer...');
    console.log(`   Customer: ${freshCustomer.name} (${freshCustomer.phone})`);
    console.log(`   Campaign ID: ${campaignId}`);
    
    const sendResponse = await axios.post(
      `${baseUrl}/api/admin/sms/campaigns/${campaignId}/send`,
      {
        customerIds: [freshCustomer.id],
        adminName: 'admin'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Campaign send response received!');
    console.log('📊 Results:');
    console.log(`   - Success Count: ${sendResponse.data.successCount}`);
    console.log(`   - Fail Count: ${sendResponse.data.failCount}`);
    console.log(`   - Total Customers: ${sendResponse.data.totalCustomers}`);
    console.log(`   - Campaign Status: ${sendResponse.data.campaign.status}`);
    
    if (sendResponse.data.results && sendResponse.data.results.length > 0) {
      console.log('\n📱 SMS Results:');
      sendResponse.data.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.customerName} (${result.phone}): ${result.status}`);
        if (result.smsType) {
          console.log(`      SMS Type: ${result.smsType}`);
        }
        if (result.error) {
          console.log(`      Error: ${result.error}`);
        }
      });
    }
    
    console.log('\n🎉 Test completed! Check if the customer received the SMS.');
    
  } catch (error) {
    console.error('❌ Test failed:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCampaignDetailed();
