// Force fix existing device subscription
import fetch from 'node-fetch';

async function forceFixExistingDevice() {
  console.log('🔧 Force fixing existing device subscription...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Try to update the existing device with provider-6 external ID
  const deviceId = '7f4-9ed341d6b3e3'; // From your dashboard
  
  console.log('🔄 Updating existing device:', deviceId);
  
  const updatePayload = {
    app_id: appId,
    external_user_id: 'provider-6',
    tags: {
      provider_id: '6',
      app_version: '1.1.0',
      subscribed: 'true',
      fixed_via: 'force_update'
    },
    // Force subscription
    notification_types: 1,
    subscribed: true,
    session_count: 1,
    session_time: 60
  };
  
  console.log('📦 Update payload:', JSON.stringify(updatePayload, null, 2));
  
  const response = await fetch(`https://onesignal.com/api/v1/players/${deviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(updatePayload)
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Device updated successfully!');
    console.log('📱 Result:', result);
    
    // Test targeted notification to this specific device
    console.log('🧪 Testing targeted notification...');
    
    const testPayload = {
      app_id: appId,
      include_external_user_ids: ['provider-6'],
      headings: { en: '🎯 TARGETED Test - Fixed!' },
      contents: { 
        en: `TARGETED notification sent at ${new Date().toLocaleTimeString()}\n\nThis should reach your device now!`
      },
      data: {
        type: 'targeted_fix_test',
        timestamp: new Date().toISOString()
      },
      priority: 10,
      android_sound: "default",
      content_available: true
    };
    
    const testResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(testPayload)
    });

    const testResult = await testResponse.json();
    console.log('📊 Targeted test result:', testResult);
    
    if (testResponse.ok) {
      console.log('🎉 TARGETED notification sent successfully!');
      console.log('📱 Check your device for the notification!');
    } else {
      console.log('❌ Targeted test failed:', testResult);
    }
    
  } else {
    console.log('❌ Update failed:', result);
    
    // If update fails, try creating a completely new device
    console.log('🔄 Trying to create new device...');
    
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
      external_user_id: 'provider-6',
      tags: {
        provider_id: '6',
        app_version: '1.1.0',
        subscribed: 'true',
        created_via: 'force_create'
      },
      subscribed: true
    };
    
    const newResponse = await fetch('https://onesignal.com/api/v1/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(newDevicePayload)
    });

    const newResult = await newResponse.json();
    console.log('📱 New device result:', newResult);
  }
}

forceFixExistingDevice().catch(console.error);
