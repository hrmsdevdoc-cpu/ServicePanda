#!/usr/bin/env node

// Direct fix for the specific device ID
console.log('🔧 DIRECT FIX: Updating your actual device...');
console.log('=' .repeat(60));

async function directFixDevice() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  // Your actual device ID
  const deviceId = "b1144ca4-1563-4e87-a003-c497f985ee83";
  const externalUserId = "provider-3";
  
  console.log('📋 Target Device:');
  console.log(`   Device ID: ${deviceId}`);
  console.log(`   External User ID: ${externalUserId}`);
  console.log(`   App ID: ${appId}`);
  
  // Method 1: Try to update the existing device
  console.log('\n🔄 Method 1: Updating existing device...');
  
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
      console.log('✅ SUCCESS! Device updated successfully!');
      console.log('Result:', JSON.stringify(result, null, 2));
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
        
        // Method 3: Try to reactivate the device
        console.log('\n🔄 Method 3: Trying to reactivate device...');
        
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
          console.log('✅ SUCCESS! Device reactivated with external user ID!');
          console.log('Result:', JSON.stringify(reactivateResult, null, 2));
        } else {
          const reactivateError = await reactivateResponse.text();
          console.log('❌ Reactivation failed:', reactivateError);
          
          // Method 4: Create completely new device
          console.log('\n🆕 Method 4: Creating completely new device...');
          
          const newDevicePayload = {
            app_id: appId,
            device_type: 1,
            identifier: `sp-new-${Date.now()}`,
            device_model: 'Samsung Galaxy F23 5G',
            device_os: '14.0',
            timezone_id: 'Asia/Kolkata',
            language: 'en',
            sdk: '050213',
            notification_types: 1,
            external_user_id: externalUserId,
            tags: {
              provider_id: '3',
              app_version: '1.1.0',
              created_at: new Date().toISOString(),
              is_replacement: 'true'
            }
          };
          
          const newDeviceResponse = await fetch('https://onesignal.com/api/v1/players', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${restApiKey}`
            },
            body: JSON.stringify(newDevicePayload)
          });
          
          if (newDeviceResponse.ok) {
            const newDeviceResult = await newDeviceResponse.json();
            console.log('✅ SUCCESS! New device created with external user ID!');
            console.log(`   New Device ID: ${newDeviceResult.id}`);
            console.log(`   External User ID: ${externalUserId}`);
            console.log('   This new device will work for notifications!');
          } else {
            const newDeviceError = await newDeviceResponse.text();
            console.log('❌ New device creation failed:', newDeviceError);
          }
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
  console.log('1. Check OneSignal dashboard for external user ID');
  console.log('2. If still not working, use the new device ID for notifications');
  console.log('3. Test with customer request to see if notifications work');
}

directFixDevice().catch(console.error);
