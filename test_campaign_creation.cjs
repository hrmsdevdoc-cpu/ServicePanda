/**
 * Test script to diagnose SMS campaign creation issue
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testCampaignCreation() {
  console.log('\n🧪 Testing SMS Campaign Creation\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Login as admin
    console.log('\n1️⃣  Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Admin logged in successfully');

    // Step 2: Try creating a campaign with minimal data
    console.log('\n2️⃣  Creating test campaign...');
    
    const campaignData = {
      name: 'Test Campaign ' + Date.now(),
      message: 'Test message with {customerName} and voucher {voucherCode}',
      voucherCode: null,
      voucherAmount: 20,
      selectedStates: ['Queensland', 'New South Wales'], // Must have at least one state
      selectedRegions: null,
      selectedStatuses: ['New'], // Must have at least one status
      scheduledAt: null,
      status: 'draft'
    };

    console.log('Campaign data being sent:');
    console.log(JSON.stringify(campaignData, null, 2));

    const createResponse = await axios.post(
      `${BASE_URL}/api/admin/sms/campaigns`,
      campaignData,
      { headers: { Cookie: cookies } }
    );

    console.log('\n✅ Campaign created successfully!');
    console.log('Campaign ID:', createResponse.data.id);
    console.log('Campaign Name:', createResponse.data.name);

    // Step 3: Test with empty arrays (this might fail)
    console.log('\n3️⃣  Testing with empty arrays...');
    const emptyArrayCampaign = {
      name: 'Empty Array Test ' + Date.now(),
      message: 'Test message',
      voucherCode: null,
      voucherAmount: null,
      selectedStates: [], // Empty array
      selectedRegions: null,
      selectedStatuses: [], // Empty array
      scheduledAt: null,
      status: 'draft'
    };

    try {
      const emptyResponse = await axios.post(
        `${BASE_URL}/api/admin/sms/campaigns`,
        emptyArrayCampaign,
        { headers: { Cookie: cookies } }
      );
      console.log('✅ Empty array campaign created (this might be unexpected)');
    } catch (emptyError) {
      console.log('❌ Empty array campaign failed (expected):');
      console.log('   Status:', emptyError.response?.status);
      console.log('   Message:', emptyError.response?.data?.message);
      console.log('   Error:', emptyError.response?.data?.error || emptyError.message);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Server is not running on', BASE_URL);
      console.error('   Please start the server first with: npm run dev');
    }
    process.exit(1);
  }
}

// Run the test
testCampaignCreation();

