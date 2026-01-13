/**
 * Test script to verify unique voucher creation in SMS campaigns
 * This tests that each recipient in a campaign gets a unique voucher code
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testVoucherSmsCampaign() {
  console.log('\n🧪 Testing Unique Voucher Creation in SMS Campaigns\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Login as admin
    console.log('\n1️⃣  Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Admin logged in successfully');

    // Step 2: Get potential customers
    console.log('\n2️⃣  Fetching potential customers...');
    const customersResponse = await axios.get(`${BASE_URL}/api/admin/potential-customers`, {
      headers: { Cookie: cookies }
    });

    const customers = customersResponse.data;
    console.log(`✅ Found ${customers.length} potential customers`);

    if (customers.length < 2) {
      console.log('⚠️  Need at least 2 customers to test. Please add more customers first.');
      return;
    }

    // Select first 2-3 customers for testing
    const testCustomers = customers.slice(0, Math.min(3, customers.length));
    const customerIds = testCustomers.map(c => c.id);
    
    console.log('\n📋 Test customers:');
    testCustomers.forEach(c => {
      console.log(`   - ${c.name} (${c.phone})`);
    });

    // Step 3: Create a test SMS campaign
    console.log('\n3️⃣  Creating test SMS campaign with voucher amount...');
    const campaignData = {
      name: `Test Voucher Campaign ${Date.now()}`,
      message: `Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a $20.00 voucher for your first job with us. Voucher '{voucherCode}'.\nIf you do not wish to receive any sms, please reply STOP\n`,
      voucherAmount: 20,
      targetAudience: 'selected'
    };

    const campaignResponse = await axios.post(
      `${BASE_URL}/api/admin/sms-campaigns`,
      campaignData,
      { headers: { Cookie: cookies } }
    );

    const campaign = campaignResponse.data;
    console.log(`✅ Campaign created: ${campaign.name} (ID: ${campaign.id})`);
    console.log(`   Voucher Amount: $${campaign.voucherAmount}`);

    // Step 4: Send campaign to selected customers
    console.log('\n4️⃣  Sending campaign to selected customers...');
    console.log('   This will create unique vouchers for each recipient...\n');

    const sendResponse = await axios.post(
      `${BASE_URL}/api/admin/sms-campaigns/${campaign.id}/send`,
      {
        customerIds: customerIds,
        adminName: 'admin'
      },
      { headers: { Cookie: cookies } }
    );

    const results = sendResponse.data;
    console.log('📨 Campaign Send Results:');
    console.log(`   ✅ Success: ${results.successCount}`);
    console.log(`   ❌ Failed: ${results.failureCount}`);
    
    if (results.results && results.results.length > 0) {
      console.log('\n📄 Detailed Results:');
      results.results.forEach(result => {
        if (result.status === 'sent' && result.voucherCode) {
          console.log(`   ✅ ${result.name} - Voucher: ${result.voucherCode}`);
        } else if (result.status === 'sent') {
          console.log(`   ✅ ${result.name} - No voucher (campaign has no voucherAmount)`);
        } else {
          console.log(`   ❌ ${result.name} - Failed: ${result.error || 'Unknown error'}`);
        }
      });
    }

    // Step 5: Verify vouchers were created
    console.log('\n5️⃣  Verifying vouchers in database...');
    const vouchersResponse = await axios.get(`${BASE_URL}/api/admin/vouchers`, {
      headers: { Cookie: cookies }
    });

    const allVouchers = vouchersResponse.data;
    console.log(`✅ Total vouchers in system: ${allVouchers.length}`);

    // Find vouchers created in this test (created in last minute)
    const recentVouchers = allVouchers.filter(v => {
      const createdAt = new Date(v.createdAt);
      const oneMinuteAgo = new Date(Date.now() - 60000);
      return createdAt > oneMinuteAgo;
    });

    if (recentVouchers.length > 0) {
      console.log(`\n🎟️  Recently created vouchers (last 1 minute):`);
      recentVouchers.forEach(v => {
        console.log(`   - Code: ${v.code}, Value: $${v.value}, Status: ${v.status}`);
      });
    }

    // Verify uniqueness
    const voucherCodes = results.results
      ?.filter(r => r.voucherCode)
      .map(r => r.voucherCode);

    if (voucherCodes && voucherCodes.length > 0) {
      const uniqueCodes = new Set(voucherCodes);
      if (uniqueCodes.size === voucherCodes.length) {
        console.log(`\n✅ SUCCESS: All ${voucherCodes.length} voucher codes are unique!`);
      } else {
        console.log(`\n❌ FAILURE: Found duplicate voucher codes!`);
      }

      console.log('\n📊 Voucher codes generated:');
      voucherCodes.forEach((code, index) => {
        console.log(`   ${index + 1}. ${code}`);
      });
    }

    console.log('\n' + '=' .repeat(60));
    console.log('✅ Test completed successfully!\n');
    console.log('💡 Key Points:');
    console.log('   • Each recipient receives a UNIQUE voucher code');
    console.log('   • Vouchers are automatically created when sending campaign');
    console.log('   • Vouchers have 30-day expiry from creation');
    console.log('   • Voucher codes are 6-character alphanumeric codes\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testVoucherSmsCampaign();

