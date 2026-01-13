#!/usr/bin/env node

// Test with actual OneSignal device IDs from the dashboard
console.log('🎯 Testing with Actual Device IDs from Dashboard...');
console.log('=' .repeat(60));

async function testActualDeviceIDs() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  // Actual OneSignal IDs from your dashboard
  const actualDeviceIds = [
    "0cdbc9df-2c70-4caf-9410-fc9684a4e3cd", // First device from dashboard
    "91779456-5f0a-435c-a406-d3d3a9ce8875"  // Second device from dashboard
  ];
  
  console.log('📋 Configuration:');
  console.log(`   App ID: ${appId}`);
  console.log(`   API Key: ${restApiKey.substring(0, 20)}...`);
  console.log(`   Target Device IDs: ${actualDeviceIds.length} devices`);
  
  try {
    // Test 1: Send to specific device IDs (from dashboard)
    console.log('\n🎯 Test 1: Sending to actual device IDs from dashboard...');
    
    const devicePayload = {
      app_id: appId,
      include_player_ids: actualDeviceIds,
      headings: { en: "🎯 Direct Device Test" },
      contents: { en: "Testing direct device ID targeting - " + new Date().toLocaleTimeString() + "\n\nThis should reach your provider devices!" },
      data: { 
        test: true,
        type: "device_id_test",
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Sending to device IDs:', actualDeviceIds);
    const deviceResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(devicePayload)
    });

    if (deviceResponse.ok) {
      const deviceResult = await deviceResponse.json();
      console.log('✅ Direct device notification sent!');
      console.log(`   Notification ID: ${deviceResult.id}`);
      console.log(`   Recipients: ${deviceResult.recipients || 0}`);
      
      if (deviceResult.recipients > 0) {
        console.log('🎉 SUCCESS! Devices received the notification!');
        console.log('📱 Check your provider app - you should see the notification!');
      } else {
        console.log('⚠️ No recipients - devices might be inactive');
      }
    } else {
      const error = await deviceResponse.text();
      console.log('❌ Direct device notification failed:', error);
    }

    // Test 2: Set external user IDs for these devices
    console.log('\n🔧 Test 2: Setting external user IDs for devices...');
    
    for (let i = 0; i < actualDeviceIds.length; i++) {
      const deviceId = actualDeviceIds[i];
      const externalUserId = `provider-${i + 1}`;
      
      console.log(`📝 Setting external user ID for device ${i + 1}:`);
      console.log(`   Device ID: ${deviceId}`);
      console.log(`   External User ID: ${externalUserId}`);
      
      try {
        const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${restApiKey}`
          },
          body: JSON.stringify({
            app_id: appId,
            external_user_id: externalUserId
          })
        });

        if (updateResponse.ok) {
          console.log(`   ✅ External user ID set successfully!`);
        } else {
          const error = await updateResponse.text();
          console.log(`   ❌ Failed to set external user ID:`, error);
        }
      } catch (error) {
        console.log(`   ❌ Error setting external user ID:`, error.message);
      }
    }

    // Test 3: Now test external user ID targeting
    console.log('\n🎯 Test 3: Testing external user ID targeting...');
    
    const externalPayload = {
      app_id: appId,
      include_external_user_ids: ["provider-1", "provider-2"],
      headings: { en: "🎯 External User ID Test" },
      contents: { en: "Testing external user ID targeting after setting IDs - " + new Date().toLocaleTimeString() },
      data: { 
        test: true,
        type: "external_id_test",
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Sending to external user IDs: provider-1, provider-2');
    const externalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(externalPayload)
    });

    if (externalResponse.ok) {
      const externalResult = await externalResponse.json();
      console.log('✅ External user ID notification sent!');
      console.log(`   Notification ID: ${externalResult.id}`);
      console.log(`   Recipients: ${externalResult.recipients || 0}`);
      
      if (externalResult.recipients > 0) {
        console.log('🎉 PERFECT! External user ID targeting now works!');
        console.log('🚀 Server notifications should now work from customer requests!');
      } else {
        console.log('⚠️ External user IDs might need time to propagate');
      }
    } else {
      const error = await externalResponse.text();
      console.log('❌ External user ID notification failed:', error);
    }

    console.log('\n📊 Summary:');
    console.log('1. Check OneSignal dashboard for new notifications');
    console.log('2. Check your provider app for received notifications');
    console.log('3. If external user ID test worked, server notifications should work now!');
    console.log('4. Try making a customer request to test the full flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testActualDeviceIDs();
