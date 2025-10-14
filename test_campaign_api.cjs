const axios = require('axios');

async function testCampaignAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing Campaign API call...');
  
  try {
    // First, let's try to get a valid admin token by logging in
    console.log('1. Attempting admin login...');
    
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      email: 'admin@servicepanda.com.au',
      password: 'admin123'
    }).catch(error => {
      console.log('❌ Login failed:', error.response?.data || error.message);
      return null;
    });
    
    if (!loginResponse) {
      console.log('💡 Trying without authentication...');
      
      // Test the campaign send endpoint directly
      const campaignId = 1; // Use the campaign we found earlier
      const customerIds = [9]; // Your test customer ID
      
      console.log(`2. Testing campaign send API (Campaign ID: ${campaignId}, Customer IDs: ${customerIds.join(', ')})...`);
      
      try {
        const sendResponse = await axios.post(
          `${baseUrl}/api/admin/sms/campaigns/${campaignId}/send`,
          {
            customerIds: customerIds,
            adminName: 'admin'
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('✅ Campaign send API call successful!');
        console.log('Response:', JSON.stringify(sendResponse.data, null, 2));
        
      } catch (error) {
        console.log('❌ Campaign send API failed:');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
          console.log('💡 Authentication required. Check if you are logged in to the admin panel.');
        }
      }
      
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test the campaign send endpoint with authentication
    const campaignId = 1;
    const customerIds = [9];
    
    console.log(`2. Testing campaign send API with auth (Campaign ID: ${campaignId}, Customer IDs: ${customerIds.join(', ')})...`);
    
    const sendResponse = await axios.post(
      `${baseUrl}/api/admin/sms/campaigns/${campaignId}/send`,
      {
        customerIds: customerIds,
        adminName: 'admin'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Campaign send API call successful!');
    console.log('Response:', JSON.stringify(sendResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCampaignAPI();
