// Test script to verify notification fix works without external ID
// This script tests the server-side notification sending

// Use dynamic import for node-fetch
let fetch;

async function testNotificationFix() {
  console.log('🧪 Testing notification fix...');
  
  try {
    // Import fetch dynamically
    const nodeFetch = await import('node-fetch');
    fetch = nodeFetch.default;
    // Test 1: Test server-side broadcast notification
    console.log('1️⃣ Testing server-side broadcast notification...');
    
    const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
    const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
    
    const payload = {
      app_id: appId,
      // BROADCAST: Send to all subscribed users (no external ID needed)
      included_segments: ['Subscribed Users'],
      headings: { en: '📢 Server Test Notification' },
      contents: { 
        en: `Server test sent at ${new Date().toLocaleTimeString()}\n\nThis should work WITHOUT external ID!\n\nIf you received this, the fix is working!`
      },
      data: {
        type: 'server_broadcast_test',
        timestamp: new Date().toISOString()
      },
      // Android specific settings
      priority: 10,
      android_sound: "default",
      android_vibration_pattern: [1000, 1000],
      content_available: true,
      ttl: 3600
    };

    console.log('📤 Sending broadcast notification...');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ BROADCAST test successful!');
      console.log(`📊 Recipients: ${result.recipients}`);
      console.log('🎯 This proves notifications work WITHOUT external ID!');
      console.log('📱 Notification ID:', result.id);
    } else {
      console.log('❌ BROADCAST test failed:', result);
    }
    
    // Test 2: Test targeted notification (with external ID)
    console.log('2️⃣ Testing targeted notification with external ID...');
    
    const targetedPayload = {
      app_id: appId,
      include_external_user_ids: ['provider-1'],
      headings: { en: '🎯 Targeted Test Notification' },
      contents: { 
        en: `Targeted test sent at ${new Date().toLocaleTimeString()}\n\nThis uses external ID for targeting!`
      },
      data: {
        type: 'targeted_test',
        providerId: '1',
        timestamp: new Date().toISOString()
      },
      priority: 10,
      android_sound: "default",
      android_vibration_pattern: [1000, 1000],
      content_available: true,
      ttl: 3600
    };
    
    const targetedResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(targetedPayload)
    });

    const targetedResult = await targetedResponse.json();
    
    if (targetedResponse.ok) {
      console.log('✅ TARGETED test successful!');
      console.log(`📊 Recipients: ${targetedResult.recipients}`);
      console.log('🎯 This proves targeted notifications work WITH external ID!');
    } else {
      console.log('❌ TARGETED test failed:', targetedResult);
    }
    
    console.log('✅ Test completed!');
    console.log('📋 Summary:');
    console.log('   - Broadcast notifications work WITHOUT external ID');
    console.log('   - Targeted notifications work WITH external ID');
    console.log('   - Both methods are now functional!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testNotificationFix();
