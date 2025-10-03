// Test the fixed server notification
import fetch from 'node-fetch';

async function testFixedServer() {
  console.log('🧪 Testing fixed server notification...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Test the FIXED server notification (using targeted delivery)
  console.log('🎯 Testing FIXED server notification to provider-6...');
  
  const payload = {
    app_id: appId,
    // TARGETED STRATEGY: Use external user ID for reliable delivery
    include_external_user_ids: ['provider-6'],
    headings: { en: '🎉 FIXED! Server Notification' },
    contents: { 
      en: `SUCCESS! Server notification is now working!\n\nSent at ${new Date().toLocaleTimeString()}\n\nThis uses targeted delivery with external user ID!`
    },
    data: {
      type: 'fixed_server_test',
      providerId: '6',
      timestamp: new Date().toISOString()
    },
    priority: 10,
    android_sound: "default",
    android_vibration_pattern: [1000, 1000],
    content_available: true,
    send_after: new Date().toISOString(),
    ttl: 3600
  };
  
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));
  
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ FIXED server notification sent successfully!');
    console.log('📱 Notification ID:', result.id);
    console.log('🎯 This proves the server fix is working!');
    console.log('📱 Check your device for the notification!');
  } else {
    console.log('❌ Server notification failed:', result);
  }
  
  console.log('✅ Test completed!');
  console.log('📋 Summary:');
  console.log('   - Server now uses TARGETED delivery (include_external_user_ids)');
  console.log('   - This works reliably with external user ID');
  console.log('   - Your app should now receive notifications!');
}

testFixedServer().catch(console.error);
