// Quick test to send notification directly via OneSignal API
import fetch from 'node-fetch';

async function sendQuickTest() {
  console.log('🚀 Sending quick notification test...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Test 1: Send to device with external ID (provider-6)
  console.log('1️⃣ Testing targeted notification to provider-6...');
  
  const targetedPayload = {
    app_id: appId,
    include_external_user_ids: ['provider-6'],
    headings: { en: '🎯 TARGETED Test' },
    contents: { 
      en: `TARGETED test sent at ${new Date().toLocaleTimeString()}\n\nThis should reach provider-6 device!`
    },
    data: {
      type: 'targeted_test',
      providerId: '6',
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
  console.log('Targeted result:', targetedResult);
  
  // Test 2: Send broadcast to all subscribed users
  console.log('2️⃣ Testing broadcast notification...');
  
  const broadcastPayload = {
    app_id: appId,
    included_segments: ['Subscribed Users'],
    headings: { en: '📢 BROADCAST Test' },
    contents: { 
      en: `BROADCAST test sent at ${new Date().toLocaleTimeString()}\n\nThis should reach ALL subscribed devices!`
    },
    data: {
      type: 'broadcast_test',
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
  console.log('Broadcast result:', broadcastResult);
  
  console.log('✅ Tests completed! Check your device for notifications.');
}

sendQuickTest().catch(console.error);
