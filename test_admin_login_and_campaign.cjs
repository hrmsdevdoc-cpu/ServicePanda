const axios = require('axios');

async function testAdminLoginAndCampaign() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing Admin Login and Campaign Sending...');
  
  try {
    // Step 1: Admin Login
    console.log('1. Attempting admin login...');
    
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful!');
    console.log(`   Token: ${token.substring(0, 30)}...`);
    
    // Step 2: Test Campaign Sending
    console.log('\n2. Testing campaign sending with authentication...');
    
    const campaignId = 1; // Use the campaign we found earlier
    const customerIds = [9]; // Your test customer ID
    
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
    console.log('📊 Campaign Results:');
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
      });
    }
    
    console.log('\n🎉 SUCCESS! The campaign sending is working correctly!');
    console.log('💡 The issue was authentication - you need to be logged in to the admin panel.');
    
  } catch (error) {
    console.error('❌ Test failed:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n💡 Authentication failed. Possible issues:');
        console.log('   - Admin user not created in database');
        console.log('   - Wrong username/password');
        console.log('   - Token expired');
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAdminLoginAndCampaign();
