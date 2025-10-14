/**
 * Test script to create an SMS campaign with voucher
 */

const axios = require('axios');

// Use the correct port from your browser (localhost:3000 from the error you showed)
const BASE_URL = 'http://localhost:3000';

async function testCreateCampaign() {
  console.log('\n🧪 Testing Campaign Creation\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Login as admin
    console.log('\n1️⃣  Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    }, {
      withCredentials: true
    });

    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Admin logged in successfully');

    // Step 2: Create a campaign
    console.log('\n2️⃣  Creating SMS campaign with voucher...');
    
    const campaignData = {
      name: 'Test Voucher Campaign ' + Date.now(),
      message: `Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a $20.00 voucher for your first job with us. Voucher '{voucherCode}'.

If you do not wish to receive any sms, please reply STOP`,
      voucherCode: null, // Will be auto-generated per recipient
      voucherAmount: 20, // $20 voucher
      selectedStates: ['Queensland', 'New South Wales'], // Target states
      selectedRegions: null,
      selectedStatuses: ['New'], // Target new customers
      scheduledAt: null, // Send immediately (draft)
      status: 'draft'
    };

    console.log('\n📋 Campaign Data:');
    console.log('   Name:', campaignData.name);
    console.log('   Voucher Amount: $' + campaignData.voucherAmount);
    console.log('   Target States:', campaignData.selectedStates.join(', '));
    console.log('   Target Statuses:', campaignData.selectedStatuses.join(', '));

    const createResponse = await axios.post(
      `${BASE_URL}/api/admin/sms/campaigns`,
      campaignData,
      { 
        headers: { 
          Cookie: cookies,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    console.log('\n✅ SUCCESS! Campaign created!');
    console.log('📄 Campaign Details:');
    console.log('   ID:', createResponse.data.id);
    console.log('   Name:', createResponse.data.name);
    console.log('   Status:', createResponse.data.status);
    console.log('   Voucher Amount: $' + createResponse.data.voucherAmount);
    console.log('   Created At:', createResponse.data.createdAt);

    // Step 3: Verify by fetching all campaigns
    console.log('\n3️⃣  Verifying campaign was saved...');
    const campaignsResponse = await axios.get(
      `${BASE_URL}/api/admin/sms/campaigns`,
      { 
        headers: { Cookie: cookies },
        withCredentials: true
      }
    );

    const campaigns = campaignsResponse.data;
    const ourCampaign = campaigns.find(c => c.id === createResponse.data.id);
    
    if (ourCampaign) {
      console.log('✅ Campaign found in database!');
      console.log('   Total campaigns:', campaigns.length);
    } else {
      console.log('⚠️  Campaign not found in list (this is unexpected)');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!\n');
    console.log('💡 Next Steps:');
    console.log('   1. Go to your admin panel');
    console.log('   2. Navigate to Potential Customers → SMS Campaigns');
    console.log('   3. You should see: "' + campaignData.name + '"');
    console.log('   4. Click to send it to customers\n');

  } catch (error) {
    console.error('\n❌ Test failed!');
    
    if (error.response) {
      console.error('\n📋 Error Details:');
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message || 'No message');
      console.error('   Error:', error.response.data?.error || 'No error detail');
      console.error('\n   Full Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Server is not running!');
      console.error('   Please start the server first with: npm run dev');
      console.error('   Make sure it\'s running on port 3000');
    } else {
      console.error('   Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the test
console.log('🚀 Starting campaign creation test...');
testCreateCampaign();

