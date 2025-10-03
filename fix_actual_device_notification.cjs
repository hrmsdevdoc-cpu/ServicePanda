#!/usr/bin/env node

// Fix actual device to receive notifications
console.log('🔧 FIXING ACTUAL DEVICE FOR NOTIFICATIONS...');
console.log('=' .repeat(60));

async function fixActualDeviceNotification() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  // Your actual device ID (the one that receives notifications)
  const actualDeviceId = "e01dc497-bdde-4154-83c8-bd565f2b988e";
  const externalUserId = "provider-3";
  
  console.log('📋 Target Device:');
  console.log(`   Device ID: ${actualDeviceId}`);
  console.log(`   External User ID: ${externalUserId}`);
  
  // Method 1: Try to update the actual device
  console.log('\n🔄 Method 1: Updating actual device...');
  
  const updatePayload = {
    app_id: appId,
    external_user_id: externalUserId,
    tags: {
      provider_id: '3',
      app_version: '1.1.0',
      is_actual_device: 'true',
      fixed_at: new Date().toISOString()
    }
  };
  
  try {
    const response = await fetch(`https://onesignal.com/api/v1/players/${actualDeviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(updatePayload)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('🎉 SUCCESS! Actual device updated!');
      console.log(`   External User ID: ${result.external_user_id}`);
      console.log(`   Device Model: ${result.device_model}`);
      console.log(`   Last Session: ${result.last_session}`);
      
      // Test notification to actual device
      console.log('\n📱 Sending test notification to actual device...');
      const testPayload = {
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: "🎉 ACTUAL DEVICE FIXED!" },
        contents: { 
          en: `SUCCESS! Your actual device now has external user ID ${externalUserId}\n\nThis device will receive all notifications!\nTime: ${new Date().toLocaleTimeString()}` 
        },
        data: { 
          test: true,
          type: "actual_device_fixed",
          provider_id: "3",
          is_actual_device: true
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
          console.log('\n🎉 PERFECT! Your actual device is now working!');
          console.log('📱 Check your device for the test notification!');
          console.log('📱 All future notifications will come to this device!');
        } else {
          console.log('⚠️ 0 recipients - device might need time to activate');
        }
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Update failed:', error);
      
      // Method 2: Try to get device info
      console.log('\n🔍 Method 2: Getting device info...');
      
      const getResponse = await fetch(`https://onesignal.com/api/v1/players/${actualDeviceId}?app_id=${appId}`, {
        headers: {
          'Authorization': `Basic ${restApiKey}`
        }
      });
      
      if (getResponse.ok) {
        const deviceInfo = await getResponse.json();
        console.log('📱 Device info:');
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
            is_actual_device: 'true',
            reactivated_at: new Date().toISOString()
          }
        };
        
        const reactivateResponse = await fetch(`https://onesignal.com/api/v1/players/${actualDeviceId}`, {
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
          console.log('Result:', reactivateResult);
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
  console.log('1. Check OneSignal dashboard - External ID should show provider-3');
  console.log('2. Check your device for test notification');
  console.log('3. If working, all future notifications will come to this device!');
}

fixActualDeviceNotification().catch(console.error);
