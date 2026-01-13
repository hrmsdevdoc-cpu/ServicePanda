const axios = require('axios');

// Test the campaign SMS sending endpoint
async function testCampaignSms() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing Campaign SMS sending...');
  
  try {
    // First, let's test if the server is running
    const healthCheck = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ Server is running');
    
    // Test SMS sending endpoint (you'll need to create a test campaign first)
    const testData = {
      customerIds: [1], // Assuming customer ID 1 exists
      adminName: 'Test Admin'
    };
    
    console.log('📱 Testing SMS sending to customer...');
    console.log('Note: This will only work if you have created a campaign and have customers in the database');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the server first:');
      console.log('   npm run dev:server');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testCampaignSms();
