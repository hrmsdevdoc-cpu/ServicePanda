#!/usr/bin/env node

// Direct test of OneSignal API to verify it's working
console.log('🔔 Testing OneSignal API Directly...');
console.log('=' .repeat(50));

async function testDirectOneSignalAPI() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  console.log('📋 OneSignal Configuration:');
  console.log(`   App ID: ${appId}`);
  console.log(`   API Key: ${restApiKey.substring(0, 20)}...`);
  
  try {
    // Test 1: Send to all subscribed users (broadcast)
    console.log('\n🚀 Test 1: Sending broadcast notification...');
    
    const broadcastPayload = {
      app_id: appId,
      included_segments: ["Subscribed Users"],
      headings: { en: "🧪 Test Notification - Broadcast" },
      contents: { en: "Testing OneSignal API directly from server - " + new Date().toLocaleTimeString() },
      data: { 
        test: true,
        type: "api_test",
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Sending broadcast notification...');
    const broadcastResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(broadcastPayload)
    });

    if (broadcastResponse.ok) {
      const broadcastResult = await broadcastResponse.json();
      console.log('✅ Broadcast notification sent successfully!');
      console.log(`   Notification ID: ${broadcastResult.id}`);
      console.log(`   Recipients: ${broadcastResult.recipients || 0}`);
      
      if (broadcastResult.recipients > 0) {
        console.log('🎉 Great! OneSignal API is working and has active subscribers!');
      } else {
        console.log('⚠️ No recipients found - check if provider devices are subscribed');
      }
    } else {
      const error = await broadcastResponse.text();
      console.log('❌ Broadcast failed:', error);
    }

    // Test 2: Send to specific external user ID (provider-1)
    console.log('\n🎯 Test 2: Sending to specific provider (external user ID)...');
    
    const targetedPayload = {
      app_id: appId,
      include_external_user_ids: ["provider-1"],
      headings: { en: "🎯 Test Notification - Targeted" },
      contents: { en: "Testing targeted notification to provider-1 - " + new Date().toLocaleTimeString() },
      data: { 
        test: true,
        type: "targeted_test",
        providerId: 1,
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Sending targeted notification to provider-1...');
    const targetedResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(targetedPayload)
    });

    if (targetedResponse.ok) {
      const targetedResult = await targetedResponse.json();
      console.log('✅ Targeted notification sent successfully!');
      console.log(`   Notification ID: ${targetedResult.id}`);
      console.log(`   Recipients: ${targetedResult.recipients || 0}`);
      
      if (targetedResult.recipients > 0) {
        console.log('🎯 Provider-1 is subscribed and should receive the notification!');
      } else {
        console.log('⚠️ Provider-1 not found - device might not be registered with external user ID');
      }
    } else {
      const error = await targetedResponse.text();
      console.log('❌ Targeted notification failed:', error);
    }

    console.log('\n📊 Results Summary:');
    console.log('   1. Check OneSignal dashboard for NEW notifications');
    console.log('   2. If you see new notifications, OneSignal API is working');
    console.log('   3. If no new notifications, there might be API key or app ID issues');
    console.log('\n🌐 OneSignal Dashboard: https://dashboard.onesignal.com/apps/a3f5070d-9c46-44cd-8b0a-259df155ae94/push');

  } catch (error) {
    console.error('❌ OneSignal API test failed:', error.message);
    console.log('\n🔧 Check:');
    console.log('   1. Internet connection');
    console.log('   2. OneSignal API key validity');
    console.log('   3. App ID correctness');
  }
}

testDirectOneSignalAPI();
