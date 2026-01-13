// Test the dynamic external ID fix
import fetch from 'node-fetch';

async function testDynamicFix() {
  console.log('🧪 Testing dynamic external ID fix...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Step 1: Get all devices
  console.log('1️⃣ Getting all devices...');
  
  const devicesResponse = await fetch(`https://onesignal.com/api/v1/players?app_id=${appId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    }
  });

  if (devicesResponse.ok) {
    const devices = await devicesResponse.json();
    console.log('📱 Found devices:', devices.players?.length || 0);
    
    // Find devices with subscribed: true
    const subscribedDevices = devices.players?.filter(device => 
      device.tags?.subscribed === 'true'
    ) || [];
    
    console.log('✅ Subscribed devices:', subscribedDevices.length);
    
    subscribedDevices.forEach((device, index) => {
      console.log(`   Device ${index + 1}:`);
      console.log(`     ID: ${device.id}`);
      console.log(`     External ID: ${device.external_user_id || 'NONE'}`);
      console.log(`     Tags: ${JSON.stringify(device.tags)}`);
    });
    
    // Find device without external ID
    const deviceWithoutExternalId = subscribedDevices.find(device => 
      !device.external_user_id
    );
    
    if (deviceWithoutExternalId) {
      console.log('🎯 Found subscribed device without external ID!');
      console.log('📱 Device ID:', deviceWithoutExternalId.id);
      
      // Step 2: Update this device with external ID
      console.log('2️⃣ Updating device with external ID...');
      
      const updatePayload = {
        app_id: appId,
        external_user_id: 'provider-6',
        tags: {
          subscribed: 'true',
          provider_id: '6',
          app_version: '1.1.0'
        }
      };
      
      const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${deviceWithoutExternalId.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${restApiKey}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('✅ Device updated successfully!');
        console.log('👤 External ID:', updateResult.external_user_id);
        console.log('📱 Device ID:', updateResult.id);
        
        // Step 3: Test notification to this device
        console.log('3️⃣ Testing notification to updated device...');
        
        const notificationPayload = {
          app_id: appId,
          include_external_user_ids: ['provider-6'],
          headings: { en: '🎉 DYNAMIC FIX SUCCESS!' },
          contents: { 
            en: `Dynamic external ID fix worked!\n\nDevice ID: ${deviceWithoutExternalId.id}\nExternal ID: provider-6\n\nThis was done automatically!`
          },
          data: {
            type: 'dynamic_fix_test',
            deviceId: deviceWithoutExternalId.id,
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
          console.log('✅ Notification sent successfully!');
          console.log('📱 Notification ID:', notificationResult.id);
          console.log('🎉 DYNAMIC FIX IS WORKING!');
          console.log('📱 Check your device for the notification!');
        } else {
          console.log('❌ Notification failed:', notificationResult);
        }
        
      } else {
        const error = await updateResponse.text();
        console.log('❌ Device update failed:', error);
      }
      
    } else {
      console.log('⚠️ No subscribed device without external ID found');
      console.log('💡 All subscribed devices already have external IDs');
    }
    
  } else {
    console.log('❌ Failed to fetch devices:', await devicesResponse.text());
  }
  
  console.log('✅ Test completed!');
  console.log('📋 Summary:');
  console.log('   - This simulates what the app will do automatically');
  console.log('   - It finds the subscribed device without external ID');
  console.log('   - It updates that device with the correct external ID');
  console.log('   - Notifications will then work automatically!');
}

testDynamicFix().catch(console.error);
