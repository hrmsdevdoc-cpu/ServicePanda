#!/usr/bin/env node

// Quick fix for external user ID - Create new device with external ID
console.log('🚀 QUICK FIX: Creating new device with external user ID...');
console.log('=' .repeat(60));

async function quickFixExternalId() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  console.log('📋 Configuration:');
  console.log(`   App ID: ${appId}`);
  console.log(`   API Key: ${restApiKey.substring(0, 20)}...`);
  
  // Create new device with external user ID
  const externalUserId = "provider-3";
  const deviceModel = "Samsung Galaxy F23 5G";
  
  console.log(`\n🆕 Creating new device with external user ID: ${externalUserId}`);
  
  // Generate a unique push token
  const pushToken = `sp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const registrationPayload = {
    app_id: appId,
    device_type: 1, // Android
    identifier: pushToken,
    device_model: deviceModel,
    device_os: '14.0',
    timezone_id: 'Asia/Kolkata',
    language: 'en',
    sdk: '050213',
    notification_types: 1, // Subscribed
    external_user_id: externalUserId,
    tags: {
      provider_id: '3',
      app_version: '1.1.0',
      registration_method: 'quick_fix',
      device_name: deviceModel
    }
  };
  
  console.log('📦 Registration payload:');
  console.log(`   External User ID: ${externalUserId}`);
  console.log(`   Device Model: ${deviceModel}`);
  console.log(`   Push Token: ${pushToken.substring(0, 20)}...`);
  
  try {
    console.log('\n📡 Creating device...');
    const response = await fetch('https://onesignal.com/api/v1/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(registrationPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! New device created with external user ID!');
      console.log(`   New Player ID: ${result.id}`);
      console.log(`   External User ID: ${externalUserId}`);
      console.log(`   Device Model: ${deviceModel}`);
      
      // Test notification
      console.log('\n📱 Sending test notification...');
      const testPayload = {
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: "🎉 External ID FIXED!" },
        contents: { 
          en: `SUCCESS! External user ID is now set to ${externalUserId}\n\nDevice: ${deviceModel}\nTime: ${new Date().toLocaleTimeString()}` 
        },
        data: { 
          test: true,
          type: "external_id_fixed",
          provider_id: "3"
        }
      };

      const testResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${restApiKey}`
        },
        body: JSON.stringify(testPayload)
      });

      if (testResponse.ok) {
        const testResult = await testResponse.json();
        console.log('✅ Test notification sent!');
        console.log(`   Notification ID: ${testResult.id}`);
        console.log(`   Recipients: ${testResult.recipients || 0}`);
        
        if (testResult.recipients > 0) {
          console.log('\n🎉 PERFECT! External user ID is working!');
          console.log('📱 Check your OneSignal dashboard - you should see:');
          console.log(`   - Device: ${deviceModel}`);
          console.log(`   - External ID: ${externalUserId}`);
          console.log('📱 Check your device for the test notification!');
        }
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Failed to create device:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📊 Next Steps:');
  console.log('1. Check OneSignal dashboard - should show new device with external ID');
  console.log('2. Check your device for test notification');
  console.log('3. If working, server notifications should now work!');
}

quickFixExternalId().catch(console.error);
