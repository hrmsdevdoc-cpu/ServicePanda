const axios = require('axios');

async function testCampaignWithLogs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing campaign with detailed error logging...');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Get a fresh customer
    console.log('\n2. Getting fresh customer...');
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
    
    // Step 3: Create a simple test campaign
    console.log('\n3. Creating test campaign...');
    const campaignData = {
      name: `Debug Test - ${new Date().toLocaleTimeString()}`,
      message: `Hello {customerName}! Test SMS at ${new Date().toLocaleTimeString()}. Reply STOP to unsubscribe.`,
      voucherCode: 'DEBUG123',
      voucherAmount: '5.00',
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
    
    // Step 4: Send campaign with detailed error handling
    console.log('\n4. Sending campaign...');
    console.log(`   Customer: ${freshCustomer.name} (${freshCustomer.phone})`);
    console.log(`   Campaign ID: ${campaignId}`);
    
    try {
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
      console.log('📊 Detailed Results:');
      console.log(JSON.stringify(sendResponse.data, null, 2));
      
    } catch (sendError) {
      console.error('❌ Campaign send failed:');
      console.error('Status:', sendError.response?.status);
      console.error('Error:', sendError.response?.data);
      console.error('Full error:', sendError.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testCampaignWithLogs();
