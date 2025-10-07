const axios = require('axios');

async function testFreshCustomer() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing SMS with fresh customer...');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Create test campaign
    console.log('\n2. Creating test campaign...');
    const campaignData = {
      name: `Fresh Customer Test - ${new Date().toLocaleTimeString()}`,
      message: `Hello {customerName}! This is a test SMS from ServicePanda at ${new Date().toLocaleTimeString()}. Reply STOP to unsubscribe.`,
      voucherCode: 'FRESH123',
      voucherAmount: '15.00',
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
    
    // Step 3: Send to Michael Chen (fresh customer)
    console.log('\n3. Sending to Michael Chen (0462222222)...');
    
    const sendResponse = await axios.post(
      `${baseUrl}/api/admin/sms/campaigns/${campaignId}/send`,
      {
        customerIds: [2], // Michael Chen's ID
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
    console.log(`   - Campaign Status: ${sendResponse.data.campaign.status}`);
    
    if (sendResponse.data.results && sendResponse.data.results.length > 0) {
      console.log('\n📱 SMS Results:');
      sendResponse.data.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.customerName} (${result.phone}): ${result.status}`);
        if (result.smsType) {
          console.log(`      SMS Type: ${result.smsType}`);
        }
      });
    }
    
    console.log('\n🎉 Test completed! Check if Michael Chen received the SMS.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testFreshCustomer();
