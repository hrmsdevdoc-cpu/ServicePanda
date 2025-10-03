// Test the newly created device
import fetch from 'node-fetch';

async function testNewDevice() {
  console.log('🧪 Testing newly created device...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  const newDeviceId = 'fbaf848f-9641-4116-bae9-6a538af37bd3';
  
  // Test 1: Targeted notification to provider-6
  console.log('1️⃣ Testing targeted notification to provider-6...');
  
  const targetedPayload = {
    app_id: appId,
    include_external_user_ids: ['provider-6'],
    headings: { en: '🎯 TARGETED - New Device' },
    contents: { 
      en: `TARGETED notification to NEW device!\n\nSent at ${new Date().toLocaleTimeString()}\n\nThis should work now!`
    },
    data: {
      type: 'targeted_new_device',
      deviceId: newDeviceId,
      timestamp: new Date().toISOString()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  const targetedResponse = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(targetedPayload)
  });

  const targetedResult = await targetedResponse.json();
  console.log('📊 Targeted result:', targetedResult);
  
  // Test 2: Direct device ID notification
  console.log('2️⃣ Testing direct device ID notification...');
  
  const directPayload = {
    app_id: appId,
    include_player_ids: [newDeviceId],
    headings: { en: '📱 DIRECT - New Device' },
    contents: { 
      en: `DIRECT notification to device ID!\n\nSent at ${new Date().toLocaleTimeString()}\n\nThis should definitely work!`
    },
    data: {
      type: 'direct_device',
      deviceId: newDeviceId,
      timestamp: new Date().toISOString()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  const directResponse = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(directPayload)
  });

  const directResult = await directResponse.json();
  console.log('📊 Direct result:', directResult);
  
  // Test 3: Broadcast notification
  console.log('3️⃣ Testing broadcast notification...');
  
  const broadcastPayload = {
    app_id: appId,
    included_segments: ['Subscribed Users'],
    headings: { en: '📢 BROADCAST - All Devices' },
    contents: { 
      en: `BROADCAST notification to ALL subscribed devices!\n\nSent at ${new Date().toLocaleTimeString()}\n\nThis should reach all devices!`
    },
    data: {
      type: 'broadcast_all',
      timestamp: new Date().toISOString()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  const broadcastResponse = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(broadcastPayload)
  });

  const broadcastResult = await broadcastResponse.json();
  console.log('📊 Broadcast result:', broadcastResult);
  
  console.log('✅ All tests completed!');
  console.log('📱 Check your device for notifications!');
  console.log('🔍 Check OneSignal dashboard to see the new device!');
}

testNewDevice().catch(console.error);
