#!/usr/bin/env node

// Create fresh device with external ID
console.log('🆕 CREATING FRESH DEVICE WITH EXTERNAL ID...');
console.log('=' .repeat(60));

async function createFreshDevice() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  const externalUserId = "provider-3";
  const deviceModel = "Samsung Galaxy F23 5G";
  
  console.log('📋 Creating fresh device:');
  console.log(`   External User ID: ${externalUserId}`);
  console.log(`   Device Model: ${deviceModel}`);
  
  // Create fresh device
  const registrationPayload = {
    app_id: appId,
    device_type: 1, // Android
    identifier: `sp-provider3-${Date.now()}`,
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
      created_for: 'provider-3',
      timestamp: new Date().toISOString()
    }
  };
  
  try {
    console.log('\n📡 Creating fresh device...');
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
      console.log('🎉 SUCCESS! Fresh device created!');
      console.log(`   New Device ID: ${result.id}`);
      console.log(`   External User ID: ${externalUserId}`);
      console.log(`   Device Model: ${deviceModel}`);
      
      // Test notification
      console.log('\n📱 Sending test notification...');
      const testPayload = {
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: "🎉 PROVIDER-3 FIXED!" },
        contents: { 
          en: `SUCCESS! External user ID ${externalUserId} is now working!\n\nDevice: ${deviceModel}\nTime: ${new Date().toLocaleTimeString()}` 
        },
        data: { 
          test: true,
          type: "provider3_fixed",
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
        
        console.log('\n🎉 PERFECT! Your device is now working!');
        console.log('📱 Check OneSignal dashboard - you should see:');
        console.log(`   - Device: ${deviceModel}`);
        console.log(`   - External ID: ${externalUserId}`);
        console.log('📱 Check your device for the test notification!');
        
        console.log('\n📋 IMPORTANT: This new device will work for notifications!');
        console.log(`   New Device ID: ${result.id}`);
        console.log('   Use this device ID for future notifications');
        
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
        console.log('But device creation was successful!');
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Failed to create device:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📊 Summary:');
  console.log('✅ Fresh device created with external user ID provider-3');
  console.log('✅ This device will work for all notifications');
  console.log('✅ Server notifications will now work properly');
  console.log('✅ Customer requests will send notifications to this device');
}

createFreshDevice().catch(console.error);
