// Verify if the external ID was actually set correctly
import fetch from 'node-fetch';

async function verifyExternalIdFix() {
  console.log('🔍 Verifying external ID fix...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Get all devices to check current state
  console.log('1️⃣ Getting current device state...');
  
  const devicesResponse = await fetch(`https://onesignal.com/api/v1/players?app_id=${appId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    }
  });

  if (devicesResponse.ok) {
    const devices = await devicesResponse.json();
    console.log('📱 Total devices:', devices.players?.length || 0);
    
    // Find the specific device we updated
    const targetDeviceId = '2d60da7c-f8f5-424b-9f29-a3b2bf6168b9';
    const targetDevice = devices.players?.find(device => device.id === targetDeviceId);
    
    if (targetDevice) {
      console.log('🎯 Target device found:');
      console.log(`   ID: ${targetDevice.id}`);
      console.log(`   External ID: ${targetDevice.external_user_id || 'NONE'}`);
      console.log(`   Subscribed: ${targetDevice.subscribed}`);
      console.log(`   Tags: ${JSON.stringify(targetDevice.tags)}`);
      
      if (targetDevice.external_user_id === 'provider-6') {
        console.log('✅ SUCCESS! External ID is correctly set to provider-6');
        
        // Test notification to confirm it works
        console.log('2️⃣ Testing notification to confirm it works...');
        
        const notificationPayload = {
          app_id: appId,
          include_external_user_ids: ['provider-6'],
          headings: { en: '✅ VERIFICATION SUCCESS!' },
          contents: { 
            en: `External ID fix is working correctly!\n\nDevice ID: ${targetDevice.id}\nExternal ID: ${targetDevice.external_user_id}\n\nThis proves the fix is working!`
          },
          data: {
            type: 'verification_test',
            deviceId: targetDevice.id,
            externalId: targetDevice.external_user_id,
            timestamp: new Date().toISOString()
          },
          priority: 10,
          android_sound: "default",
          content_available: true
        };
        
        const notificationResponse = await fetch('https://onesignal.com/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${restApiKey}`
          },
          body: JSON.stringify(notificationPayload)
        });

        const notificationResult = await notificationResponse.json();
        
        if (notificationResponse.ok) {
          console.log('✅ VERIFICATION NOTIFICATION SENT!');
          console.log('📱 Notification ID:', notificationResult.id);
          console.log('🎉 EXTERNAL ID FIX IS CONFIRMED WORKING!');
          console.log('📱 Check your device for the verification notification!');
        } else {
          console.log('❌ Verification notification failed:', notificationResult);
        }
        
      } else {
        console.log('❌ External ID is NOT set correctly');
        console.log(`   Expected: provider-6`);
        console.log(`   Actual: ${targetDevice.external_user_id || 'NONE'}`);
        
        // Try to fix it again
        console.log('3️⃣ Attempting to fix external ID again...');
        
        const updatePayload = {
          app_id: appId,
          external_user_id: 'provider-6',
          tags: {
            subscribed: 'true',
            provider_id: '6',
            app_version: '1.1.0'
          }
        };
        
        const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${targetDeviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${restApiKey}`
          },
          body: JSON.stringify(updatePayload)
        });

        const updateResult = await updateResponse.json();
        console.log('📦 Update result:', updateResult);
        
        if (updateResponse.ok) {
          console.log('✅ External ID updated successfully!');
        } else {
          console.log('❌ External ID update failed:', updateResult);
        }
      }
      
    } else {
      console.log('❌ Target device not found');
    }
    
  } else {
    console.log('❌ Failed to fetch devices:', await devicesResponse.text());
  }
  
  console.log('✅ Verification completed!');
}

verifyExternalIdFix().catch(console.error);
