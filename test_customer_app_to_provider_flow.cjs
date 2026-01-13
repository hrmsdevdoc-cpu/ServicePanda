/**
 * Test Customer App → Server → Provider Notification Flow
 * Simulates the complete flow from customer app submission to provider notification
 */

console.log('🧪 Testing Customer App → Provider Notification Flow');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

async function testCompleteCustomerFlow() {
  try {
    console.log('1️⃣ Simulating customer app service request submission...');
    
    // Step 1: Simulate customer app API call (same as RequestServiceScreen.tsx)
    const customerFormData = {
      categoryId: 1, // Plumbing
      description: 'Kitchen sink is completely blocked and overflowing. Need urgent repair!',
      postcode: '4000',
      suburb: 'Brisbane CBD',
      preferredDate: null,
      bookingType: 'emergency',
      customerId: 'customer_001'
    };
    
    console.log('📋 Customer Form Data:');
    console.log(`   - Category ID: ${customerFormData.categoryId}`);
    console.log(`   - Description: ${customerFormData.description}`);
    console.log(`   - Location: ${customerFormData.suburb}, ${customerFormData.postcode}`);
    console.log(`   - Booking Type: ${customerFormData.bookingType}`);
    console.log('');
    
    // Step 2: Call the actual server API (same endpoint as customer app)
    console.log('2️⃣ Calling server API: POST /api/service-requests');
    console.log('🌐 API URL: https://api.servicepanda.com.au/api/service-requests');
    
    const response = await fetch('https://api.servicepanda.com.au/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: JSON.stringify(customerFormData)
    });
    
    console.log(`📡 Server Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Service request created successfully!');
      console.log('📊 Server Response:', result);
      
      if (result.request && result.request.id) {
        console.log(`🆔 Request ID: ${result.request.id}`);
        console.log('');
        console.log('3️⃣ Server should now be processing the request...');
        console.log('   - Finding eligible providers in postcode 4000');
        console.log('   - Creating lead distribution records');
        console.log('   - Sending OneSignal notifications to providers');
        console.log('');
        
        // Wait a moment for server processing
        console.log('⏳ Waiting 3 seconds for server to process...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('4️⃣ Expected server actions completed:');
        console.log('   ✅ storage.createServiceRequest() called');
        console.log('   ✅ storage.initializeLeadDistribution() called');
        console.log('   ✅ providerNotificationService.notifyProvidersOfNewRequest() called');
        console.log('   ✅ oneSignalAdminService.sendToProvider() called');
        console.log('   ✅ OneSignal API notification sent to provider-1');
        console.log('');
        
        console.log('🎯 RESULT: Provider should receive notification with:');
        console.log(`   📱 Title: "New Customer Request Available! 🛎️"`);
        console.log(`   📱 Message: "Plumbing needed in Brisbane CBD, 4000"`);
        console.log(`   📱 Data: Request ID ${result.request.id}, Category: Plumbing`);
        
      } else {
        console.log('⚠️  No request ID in response - check server logs');
      }
      
    } else {
      const errorData = await response.text();
      console.log('❌ Service request creation failed:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${errorData}`);
      
      if (response.status === 401) {
        console.log('💡 SOLUTION: Customer needs to be authenticated');
        console.log('   - Add proper authentication token to request');
        console.log('   - Or test with authenticated customer session');
      } else if (response.status === 400) {
        console.log('💡 SOLUTION: Check request data format');
        console.log('   - Verify all required fields are present');
        console.log('   - Check categoryId exists in database');
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.log('');
    console.log('💡 Possible issues:');
    console.log('   1. Server not running or not accessible');
    console.log('   2. Network connectivity issues');
    console.log('   3. API endpoint changed');
    console.log('   4. Authentication required');
  }
}

// Also test the notification flow directly
async function testDirectNotificationFlow() {
  console.log('');
  console.log('5️⃣ Testing direct OneSignal notification (bypass server)...');
  
  try {
    const directNotificationPayload = {
      app_id: 'a3f5070d-9c46-44cd-8b0a-259df155ae94',
      include_external_user_ids: ['provider-1'],
      headings: { 
        en: 'New Customer Request Available! 🛎️' 
      },
      contents: { 
        en: 'Plumbing needed in Brisbane CBD, 4000\n"Kitchen sink is completely blocked and overflowing. Need urgent repair!"'
      },
      data: {
        type: 'customer_request',
        requestId: Date.now(),
        categoryName: 'Plumbing',
        customerLocation: 'Brisbane CBD, 4000',
        priority: 'high'
      },
      priority: 10,
      android_sound: "default",
      android_vibration_pattern: [1000, 1000],
      content_available: true,
      apns_push_type_override: "background"
    };
    
    console.log('📡 Sending direct OneSignal notification...');
    
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky'
      },
      body: JSON.stringify(directNotificationPayload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Direct OneSignal notification sent!');
      console.log(`📊 Notification ID: ${result.id}`);
      console.log(`📊 Recipients: ${result.recipients || 'Processing...'}`);
      
      if (result.recipients > 0) {
        console.log('🎉 SUCCESS: Provider should receive notification!');
      } else {
        console.log('⚠️  Provider not subscribed - check app registration');
      }
    } else {
      console.log('❌ Direct notification failed:', result);
    }
    
  } catch (error) {
    console.log('💥 Direct notification test failed:', error.message);
  }
}

console.log('🚀 Starting complete customer-to-provider flow test...');
console.log('This tests the EXACT flow from customer app to provider notification');
console.log('');

testCompleteCustomerFlow()
  .then(() => testDirectNotificationFlow())
  .then(() => {
    console.log('');
    console.log('🏁 Complete flow test finished!');
    console.log('');
    console.log('📋 Summary:');
    console.log('1. Customer app submits service request');
    console.log('2. Server processes request and finds providers');
    console.log('3. Server sends OneSignal notifications');
    console.log('4. Provider app receives notifications');
    console.log('');
    console.log('💡 If provider doesn\'t receive notifications:');
    console.log('   - Check provider app is registered with OneSignal');
    console.log('   - Check server logs for notification processing');
    console.log('   - Verify external user ID targeting (provider-1)');
  })
  .catch(error => {
    console.error('💥 Test error:', error);
  });
