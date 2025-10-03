// Test server notification with correct external user ID
import fetch from 'node-fetch';

async function testServerNotification() {
  console.log('🧪 Testing server notification with provider-6...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Test the exact same payload that the server would send
  const payload = {
    app_id: appId,
    include_external_user_ids: ['provider-6'],
    headings: { en: '🛎️ New Customer Request!' },
    contents: { 
      en: `Plumbing needed in Sydney, 2000\n"Test service request for notification testing..."`
    },
    data: {
      requestId: 123,
      categoryName: 'Plumbing',
      customerLocation: 'Sydney, 2000',
      description: 'Test service request for notification testing',
      timestamp: new Date().toISOString(),
      priority: 'high'
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
    console.log('✅ Server notification sent successfully!');
    console.log('📱 Notification ID:', result.id);
    console.log('📊 Recipients:', result.recipients);
    console.log('🎯 This is exactly what your server sends!');
    console.log('📱 Check your device for the notification!');
  } else {
    console.log('❌ Server notification failed:', result);
  }
  
  console.log('✅ Test completed!');
  console.log('📋 Next steps:');
  console.log('   1. Start your server: npm start (in server directory)');
  console.log('   2. Create a customer service request');
  console.log('   3. Check your provider app for notifications');
  console.log('   4. The notification should work now!');
}

testServerNotification().catch(console.error);
