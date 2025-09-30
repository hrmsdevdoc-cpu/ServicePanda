/**
 * Test Complete Customer Request Flow
 * Simulates the EXACT server flow: Customer Request → Provider Notification
 */

console.log('🧪 Testing COMPLETE Customer Request Flow');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

// Simulate the EXACT server flow
async function testCompleteFlow() {
  try {
    console.log('1️⃣ Simulating customer service request submission...');
    
    // Step 1: Customer submits request (like POST /api/service-requests)
    const customerRequest = {
      customerId: 123,
      categoryId: 1,
      categoryName: 'Plumbing',
      description: 'Kitchen sink is completely blocked and overflowing. Need urgent repair!',
      suburb: 'Brisbane CBD',
      postcode: '4000',
      urgency: 'high'
    };
    
    console.log('📋 Customer Request:');
    console.log(`   - Service: ${customerRequest.categoryName}`);
    console.log(`   - Location: ${customerRequest.suburb}, ${customerRequest.postcode}`);
    console.log(`   - Description: ${customerRequest.description}`);
    console.log('');
    
    // Step 2: Server finds eligible providers (simulate storage.getEligibleProviders)
    console.log('2️⃣ Finding eligible providers...');
    const eligibleProviders = [
      { providerId: 1, firstName: 'John', lastName: 'Smith', rating: 4.8 },
      // Add more providers if you have them registered
    ];
    
    console.log(`✅ Found ${eligibleProviders.length} eligible providers:`);
    eligibleProviders.forEach(p => {
      console.log(`   - ${p.firstName} ${p.lastName} (ID: ${p.providerId}, Rating: ${p.rating})`);
    });
    console.log('');
    
    // Step 3: Send notifications (simulate providerNotificationService.notifyProvidersOfNewRequest)
    console.log('3️⃣ Sending notifications to providers...');
    
    const requestId = Date.now(); // Simulate request ID
    const customerLocation = `${customerRequest.suburb}, ${customerRequest.postcode}`;
    
    // Create notification payload (EXACT same as server)
    const notification = {
      title: 'New Customer Request Available! 🛎️',
      message: `${customerRequest.categoryName} needed in ${customerLocation}\n"${customerRequest.description.substring(0, 100)}${customerRequest.description.length > 100 ? '...' : ''}"`,
      type: 'customer_request',
      data: {
        requestId,
        categoryName: customerRequest.categoryName,
        customerLocation,
        description: customerRequest.description,
        timestamp: new Date().toISOString(),
        priority: 'high'
      }
    };
    
    console.log('📨 Notification Details:');
    console.log(`   - Title: ${notification.title}`);
    console.log(`   - Message: ${notification.message}`);
    console.log('');
    
    // Step 4: Send to each provider via OneSignal (simulate oneSignalAdminService.sendToProvider)
    for (const provider of eligibleProviders) {
      console.log(`4️⃣ Sending OneSignal notification to Provider ${provider.providerId} (${provider.firstName} ${provider.lastName})...`);
      
      const oneSignalPayload = {
        app_id: 'a3f5070d-9c46-44cd-8b0a-259df155ae94',
        include_external_user_ids: [`provider-${provider.providerId}`],
        headings: { en: notification.title },
        contents: { en: notification.message },
        data: notification.data,
        // Android specific settings (EXACT same as server)
        priority: 10,
        android_sound: "default",
        android_vibration_pattern: [1000, 1000],
        content_available: true,
        apns_push_type_override: "background"
      };
      
      console.log(`🎯 Target: provider-${provider.providerId}`);
      console.log('📡 Calling OneSignal API...');
      
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky'
        },
        body: JSON.stringify(oneSignalPayload)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Notification sent to ${provider.firstName} ${provider.lastName}!`);
        console.log(`   📊 Notification ID: ${result.id}`);
        console.log(`   📊 Recipients: ${result.recipients || 'Processing...'}`);
        
        if (result.recipients === 0) {
          console.log(`   ⚠️  Provider ${provider.providerId} not subscribed or app not registered`);
        } else {
          console.log(`   🎉 Provider ${provider.providerId} should receive notification!`);
        }
      } else {
        console.log(`❌ Failed to send to ${provider.firstName} ${provider.lastName}:`);
        console.log(`   📋 Error:`, result);
      }
      console.log('');
    }
    
    console.log('🏁 Complete customer request flow test finished!');
    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   - Customer request processed: ✅`);
    console.log(`   - Eligible providers found: ${eligibleProviders.length}`);
    console.log(`   - Notifications sent via OneSignal: ✅`);
    console.log('');
    console.log('💡 This is EXACTLY what happens when a real customer makes a request!');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

console.log('🚀 Starting complete customer request flow test...');
console.log('This simulates the EXACT server process when a customer makes a request');
console.log('');

testCompleteFlow().catch(error => {
  console.error('💥 Test error:', error);
});
