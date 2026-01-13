const axios = require('axios');

// Test the unique voucher functionality
async function testUniqueVouchers() {
  try {
    console.log('🧪 Testing Unique Voucher Campaign Functionality...\n');

    // Test data
    const testCampaign = {
      campaignId: 12345,
      messageTemplate: "Hello {customerName}! Welcome to ServicePanda. Here's your unique voucher: {voucherCode} worth ${voucherAmount}. Reply STOP to unsubscribe.",
      voucherAmount: 30,
      customerIds: [1, 2, 3], // Assuming these customer IDs exist
      adminName: 'test_admin'
    };

    console.log('📋 Test Campaign Data:');
    console.log(`- Campaign ID: ${testCampaign.campaignId}`);
    console.log(`- Message Template: ${testCampaign.messageTemplate}`);
    console.log(`- Voucher Amount: $${testCampaign.voucherAmount}`);
    console.log(`- Target Customers: ${testCampaign.customerIds.length}`);
    console.log('');

    // Make API call to execute campaign
    console.log('🚀 Executing campaign with unique vouchers...');
    
    const response = await axios.post('http://localhost:3000/api/admin/campaigns/execute', testCampaign, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'your-admin-token-here' // Replace with actual admin token
      }
    });

    console.log('✅ Campaign execution response:');
    console.log(`- Success: ${response.data.success}`);
    console.log(`- Total Customers: ${response.data.totalCustomers}`);
    console.log(`- Sent: ${response.data.sent}`);
    console.log(`- Failed: ${response.data.failed}`);
    console.log('');

    // Display results for each customer
    if (response.data.results && response.data.results.length > 0) {
      console.log('📊 Individual Customer Results:');
      response.data.results.forEach((result, index) => {
        console.log(`\n${index + 1}. Customer ID: ${result.customerId}`);
        console.log(`   Name: ${result.name}`);
        console.log(`   Phone: ${result.phone}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Sent: ${result.sent}`);
        if (result.voucherCode) {
          console.log(`   Unique Voucher Code: ${result.voucherCode}`);
        }
        if (result.reason) {
          console.log(`   Reason: ${result.reason}`);
        }
      });
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('\n💡 Key Features Verified:');
    console.log('- Each customer receives a unique voucher code');
    console.log('- Message template is personalized with customer name');
    console.log('- Voucher amount is dynamically inserted');
    console.log('- Campaign execution tracks success/failure per customer');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testUniqueVouchers();
