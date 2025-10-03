#!/usr/bin/env node

// Fix the specific device that's showing in your screenshot
console.log('🔧 FIXING YOUR ACTUAL DEVICE...');
console.log('=' .repeat(60));

async function fixThisDevice() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  // Your actual device ID from screenshot
  const deviceId = "4af08a5b-d6ac-49e3-b781-46152ca3";
  const externalUserId = "provider-3";
  
  console.log('📋 Target Device:');
  console.log(`   Device ID: ${deviceId}`);
  console.log(`   External User ID: ${externalUserId}`);
  
  // Method 1: Try to update the device directly
  console.log('\n🔄 Method 1: Updating device directly...');
  
  const updatePayload = {
    app_id: appId,
    external_user_id: externalUserId,
    tags: {
      provider_id: '3',
      app_version: '1.1.0',
      fixed_at: new Date().toISOString()
    }
  };
  
  try {
    const response = await fetch(`https://onesignal.com/api/v1/players/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(updatePayload)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('🎉 SUCCESS! Device updated successfully!');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Test notification
      console.log('\n📱 Sending test notification...');
      const testPayload = {
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: "🎉 EXTERNAL ID FIXED!" },
        contents: { 
          en: `SUCCESS! External user ID ${externalUserId} is now working!\n\nTime: ${new Date().toLocaleTimeString()}` 
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
        
        console.log('\n🎉 PERFECT! Your device is now working!');
        console.log('📱 Check your OneSignal dashboard - External ID should now show provider-3');
        console.log('📱 Check your device for the test notification!');
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Update failed:', error);
      
      // Method 2: Try to get device info first
      console.log('\n🔍 Method 2: Getting device info...');
      
      const getResponse = await fetch(`https://onesignal.com/api/v1/players/${deviceId}?app_id=${appId}`, {
        headers: {
          'Authorization': `Basic ${restApiKey}`
        }
      });
      
      if (getResponse.ok) {
        const deviceInfo = await getResponse.json();
        console.log('📱 Device info found:');
        console.log(`   ID: ${deviceInfo.id}`);
        console.log(`   Device Type: ${deviceInfo.device_type}`);
        console.log(`   Last Session: ${deviceInfo.last_session}`);
        console.log(`   External User ID: ${deviceInfo.external_user_id || 'None'}`);
        console.log(`   Tags: ${JSON.stringify(deviceInfo.tags || {})}`);
        
        // Try to reactivate with external ID
        console.log('\n🔄 Method 3: Reactivating device with external ID...');
        
        const reactivatePayload = {
          app_id: appId,
          device_type: 1,
          identifier: deviceInfo.identifier || 'reactivated-device',
          external_user_id: externalUserId,
          tags: {
            provider_id: '3',
            app_version: '1.1.0',
            reactivated_at: new Date().toISOString()
          }
        };
        
        const reactivateResponse = await fetch(`https://onesignal.com/api/v1/players/${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${restApiKey}`
          },
          body: JSON.stringify(reactivatePayload)
        });
        
        if (reactivateResponse.ok) {
          const reactivateResult = await reactivateResponse.json();
          console.log('🎉 SUCCESS! Device reactivated with external user ID!');
          console.log('Result:', JSON.stringify(reactivateResult, null, 2));
        } else {
          const reactivateError = await reactivateResponse.text();
          console.log('❌ Reactivation failed:', reactivateError);
        }
        
      } else {
        const getError = await getResponse.text();
        console.log('❌ Could not get device info:', getError);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📊 Next Steps:');
  console.log('1. Check OneSignal dashboard - External ID should now show provider-3');
  console.log('2. Check your device for test notification');
  console.log('3. If working, server notifications will now work!');
}

fixThisDevice().catch(console.error);
