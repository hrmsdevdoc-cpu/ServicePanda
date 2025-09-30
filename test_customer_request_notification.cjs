/**
 * Test Customer Request Notification Flow
 * Simulates a customer making a request and sending notification to provider
 */

console.log('🧪 Testing Customer Request → Provider Notification Flow');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

async function testCustomerRequestNotification() {
  try {
    console.log('1️⃣ Simulating customer request...');
    
    // Simulate customer request data
    const customerRequest = {
      customerId: 'customer-123',
      serviceType: 'Plumbing',
      location: 'Brisbane CBD',
      description: 'Urgent plumbing repair needed - kitchen sink blocked',
      urgency: 'high',
      providerId: 1 // Target provider ID 1
    };
    
    console.log('📋 Customer Request Details:');
    console.log(`   - Service: ${customerRequest.serviceType}`);
    console.log(`   - Location: ${customerRequest.location}`);
    console.log(`   - Description: ${customerRequest.description}`);
    console.log(`   - Target Provider: ${customerRequest.providerId}`);
    console.log('');
    
    console.log('2️⃣ Sending OneSignal notification to provider...');
    
    // Send notification using OneSignal API directly
    const notificationPayload = {
      app_id: 'a3f5070d-9c46-44cd-8b0a-259df155ae94',
      include_external_user_ids: [`provider-${customerRequest.providerId}`],
      headings: { 
        en: `🔧 New ${customerRequest.serviceType} Request` 
      },
      contents: { 
        en: `${customerRequest.description}\n\n📍 Location: ${customerRequest.location}\n⏰ Time: ${new Date().toLocaleTimeString()}\n\n💰 Tap to view details and quote!`
      },
      data: {
        type: 'customer_request',
        customerId: customerRequest.customerId,
        serviceType: customerRequest.serviceType,
        location: customerRequest.location,
        urgency: customerRequest.urgency,
        requestId: `req-${Date.now()}`
      },
      // Android specific settings for better delivery
      priority: 10,
      android_sound: "default",
      android_vibration_pattern: [1000, 1000],
      content_available: true,
      apns_push_type_override: "background"
    };
    
    console.log('📡 Sending to OneSignal API...');
    console.log(`🎯 Target: provider-${customerRequest.providerId}`);
    
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky'
      },
      body: JSON.stringify(notificationPayload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Customer request notification sent successfully!');
      console.log(`📊 Notification ID: ${result.id}`);
      console.log(`📊 Recipients: ${result.recipients || 'Processing...'}`);
      
      if (result.recipients === 0) {
        console.log('');
        console.log('⚠️  WARNING: 0 recipients - possible issues:');
        console.log('   1. Provider app not installed or not registered');
        console.log('   2. Provider not subscribed to notifications');
        console.log('   3. External user ID mismatch');
        console.log('   4. App needs to be restarted to register properly');
      } else {
        console.log('');
        console.log('🎉 SUCCESS: Notification should reach provider device!');
        console.log('📱 Provider should receive notification even if app is closed');
      }
      
    } else {
      console.log('❌ Customer request notification failed:');
      console.log('📋 Error:', result);
      
      if (result.errors && result.errors.includes("All included players are not subscribed")) {
        console.log('');
        console.log('💡 SOLUTION: Provider needs to:');
        console.log('   1. Install and open the ServicePandaProvider app');
        console.log('   2. Grant notification permissions');
        console.log('   3. Let the app register with OneSignal');
        console.log('   4. Check OneSignal dashboard for valid subscribers');
      }
    }
    
  } catch (error) {
    console.log('💥 Test failed:', error.message);
  }
}

console.log('🚀 Starting customer request notification test...');
console.log('');

testCustomerRequestNotification().then(() => {
  console.log('');
  console.log('🏁 Test completed!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Check provider app for notification');
  console.log('2. Check OneSignal dashboard for delivery status');
  console.log('3. Check server logs for notification processing');
}).catch(error => {
  console.error('💥 Test error:', error);
});
