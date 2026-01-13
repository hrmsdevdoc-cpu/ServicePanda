#!/usr/bin/env node

// Test external user ID setting
console.log('🧪 TESTING EXTERNAL USER ID SETTING...');
console.log('=' .repeat(60));

async function testExternalIdSetting() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  console.log('📋 Testing with provider-3...');
  
  // Create a test device with external user ID
  const testPayload = {
    app_id: appId,
    device_type: 1,
    identifier: `test-${Date.now()}`,
    device_model: 'Samsung Galaxy F23 5G',
    device_os: '14.0',
    timezone_id: 'Asia/Kolkata',
    language: 'en',
    sdk: '050213',
    notification_types: 1,
    external_user_id: 'provider-3',
    tags: {
      provider_id: '3',
      app_version: '1.1.0',
      test_device: 'true',
      created_at: new Date().toISOString()
    }
  };
  
  try {
    console.log('📡 Creating test device...');
    const response = await fetch('https://onesignal.com/api/v1/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test device created successfully!');
      console.log(`   Device ID: ${result.id}`);
      console.log(`   External User ID: ${result.external_user_id}`);
      console.log(`   Device Model: ${result.device_model}`);
      
      // Test notification
      console.log('\n📱 Sending test notification...');
      const testNotificationPayload = {
        app_id: appId,
        include_external_user_ids: ['provider-3'],
        headings: { en: "🧪 EXTERNAL ID TEST" },
        contents: { 
          en: `Test notification for provider-3\n\nDevice ID: ${result.id}\nTime: ${new Date().toLocaleTimeString()}` 
        },
        data: { 
          test: true,
          type: "external_id_test",
          provider_id: "3"
        }
      };

      const testResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${restApiKey}`
        },
        body: JSON.stringify(testNotificationPayload)
      });

      if (testResponse.ok) {
        const testResult = await testResponse.json();
        console.log('✅ Test notification sent!');
        console.log(`   Notification ID: ${testResult.id}`);
        console.log(`   Recipients: ${testResult.recipients || 0}`);
        
        if (testResult.recipients > 0) {
          console.log('\n🎉 SUCCESS! External user ID is working!');
          console.log('📱 Check your OneSignal dashboard - you should see:');
          console.log(`   - Device: Samsung Galaxy F23 5G`);
          console.log(`   - External ID: provider-3`);
          console.log('📱 Check your device for the test notification!');
        } else {
          console.log('⚠️ 0 recipients - device might need time to activate');
        }
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Test device creation failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📊 Next Steps:');
  console.log('1. Check OneSignal dashboard for the test device');
  console.log('2. If test works, the app should also work');
  console.log('3. Login to your app and check console logs');
}

testExternalIdSetting().catch(console.error);
