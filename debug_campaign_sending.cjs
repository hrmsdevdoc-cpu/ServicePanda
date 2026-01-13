const axios = require('axios');

async function debugCampaignSending() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Debugging Campaign SMS sending...');
  
  try {
    // Check if server is running
    console.log('1. Checking server status...');
    const healthCheck = await axios.get(`${baseUrl}/api/health`).catch(() => null);
    if (!healthCheck) {
      console.log('❌ Server is not running. Please start the server first:');
      console.log('   npm run dev:server');
      return;
    }
    console.log('✅ Server is running');
    
    // Check if campaigns endpoint exists
    console.log('2. Testing campaigns endpoint...');
    try {
      const campaignsResponse = await axios.get(`${baseUrl}/api/admin/sms/campaigns`, {
        headers: {
          'Authorization': 'Bearer test-token' // You might need proper auth
        }
      });
      console.log('✅ Campaigns endpoint accessible');
      console.log('Campaigns found:', campaignsResponse.data.length);
    } catch (error) {
      console.log('❌ Campaigns endpoint error:', error.response?.status, error.response?.data);
    }
    
    // Check if potential customers exist
    console.log('3. Testing potential customers endpoint...');
    try {
      const customersResponse = await axios.get(`${baseUrl}/api/admin/potential-customers`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ Potential customers endpoint accessible');
      console.log('Customers found:', customersResponse.data.length);
    } catch (error) {
      console.log('❌ Potential customers endpoint error:', error.response?.status, error.response?.data);
    }
    
    console.log('\n📋 Debug Summary:');
    console.log('- Check if sms_campaigns table exists in database');
    console.log('- Check if potential_customers table has data');
    console.log('- Check server logs for campaign sending errors');
    console.log('- Verify authentication for admin endpoints');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugCampaignSending();
