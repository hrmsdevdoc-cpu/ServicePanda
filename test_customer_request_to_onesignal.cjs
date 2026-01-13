#!/usr/bin/env node

// Test script to verify customer request → OneSignal notification flow
// This will simulate what happens when a customer makes a service request

// Use built-in fetch (Node.js 18+) or fallback
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Test configuration
const SERVER_URL = 'http://localhost:3000';
const TEST_CUSTOMER_EMAIL = 'test@customer.com';
const TEST_CUSTOMER_PASSWORD = 'password123';

async function testCustomerRequestNotificationFlow() {
  console.log('🧪 Testing Customer Request → OneSignal Notification Flow');
  console.log('=' .repeat(60));

  try {
    // Step 1: Login as test customer
    console.log('\n📝 Step 1: Login as test customer...');
    const loginResponse = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_CUSTOMER_EMAIL,
        password: TEST_CUSTOMER_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Customer login successful');

    // Step 2: Get available service categories
    console.log('\n📋 Step 2: Get service categories...');
    const categoriesResponse = await fetch(`${SERVER_URL}/api/service-categories`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const categories = await categoriesResponse.json();
    const testCategory = categories[0]; // Use first available category
    console.log(`✅ Using category: ${testCategory.name} (ID: ${testCategory.id})`);

    // Step 3: Create a service request (this should trigger notifications)
    console.log('\n🛎️ Step 3: Create service request (should trigger OneSignal notifications)...');
    const serviceRequestData = {
      categoryId: testCategory.id,
      description: 'Test service request to verify OneSignal notification flow',
      suburb: 'Test Suburb',
      postcode: '12345',
      contactPhone: '+1234567890',
      preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      urgency: 'medium'
    };

    console.log('📤 Sending service request:', serviceRequestData);

    const requestResponse = await fetch(`${SERVER_URL}/api/service-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(serviceRequestData)
    });

    if (!requestResponse.ok) {
      const errorData = await requestResponse.text();
      throw new Error(`Service request failed: ${requestResponse.status} - ${errorData}`);
    }

    const requestData = await requestResponse.json();
    console.log('✅ Service request created successfully!');
    console.log(`📋 Request ID: ${requestData.request.id}`);
    console.log(`📋 Message: ${requestData.message}`);

    // Step 4: Wait and check server logs for notification activity
    console.log('\n⏳ Step 4: Waiting for notification processing...');
    console.log('🔍 Check your server console for:');
    console.log('   - "🛎️ Notifying X providers of new customer request"');
    console.log('   - "📤 Sending OneSignal push notification to provider"');
    console.log('   - "✅ OneSignal notification sent"');
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

    // Step 5: Check OneSignal dashboard
    console.log('\n📊 Step 5: Check OneSignal Dashboard');
    console.log('🌐 Go to: https://dashboard.onesignal.com/apps/a3f5070d-9c46-44cd-8b0a-259df155ae94/push');
    console.log('🔍 Look for new notifications with:');
    console.log(`   - Title: "New Customer Request Available! 🛎️"`);
    console.log(`   - Message: "${testCategory.name} needed in Test Suburb, 12345"`);
    console.log(`   - Status: Should be "Delivered" (not "Failed")`);

    console.log('\n✅ Test completed! Check the results above.');
    console.log('\n💡 If notifications are not appearing in OneSignal:');
    console.log('   1. Check server console logs for errors');
    console.log('   2. Verify OneSignal API key is correct');
    console.log('   3. Ensure providers are registered with correct external user IDs');
    console.log('   4. Check if initializeLeadDistribution is being called');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Make sure the server is running on localhost:3000');
    console.log('   2. Ensure test customer exists (email: test@customer.com)');
    console.log('   3. Check server logs for detailed error messages');
  }
}

// Run the test
testCustomerRequestNotificationFlow();
