// Fix device subscription - Force register device as subscribed
import fetch from 'node-fetch';

async function fixDeviceSubscription() {
  console.log('🔧 Fixing device subscription...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  // Force register device as properly subscribed
  const registrationPayload = {
    app_id: appId,
    device_type: 1, // Android
    identifier: `sp-fixed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    device_model: 'Samsung Galaxy F23 5G',
    device_os: '14.0',
    timezone_id: 'Asia/Kolkata',
    language: 'en',
    sdk: '050213',
    notification_types: 1, // Enable notifications
    external_user_id: 'provider-6', // Use your provider ID
    tags: {
      provider_id: '6',
      app_version: '1.1.0',
      subscribed: 'true',
      created_via: 'subscription_fix'
    },
    // CRITICAL: Force subscription status
    subscribed: true,
    session_count: 1,
    session_time: 60,
    timezone: 0,
    country: 'IN'
  };
  
  console.log('📦 Registration payload:', JSON.stringify(registrationPayload, null, 2));
  
  const response = await fetch('https://onesignal.com/api/v1/players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(registrationPayload)
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Device registered successfully!');
    console.log('📱 Player ID:', result.id);
    console.log('🔔 Subscription status:', result.subscribed);
    console.log('👤 External ID:', result.external_user_id);
    
    // Now test broadcast notification
    console.log('🧪 Testing broadcast notification...');
    
    const testPayload = {
      app_id: appId,
      included_segments: ['Subscribed Users'],
      headings: { en: '🎉 FIXED! Notification Test' },
      contents: { 
        en: `SUCCESS! Device is now properly subscribed!\n\nTest sent at ${new Date().toLocaleTimeString()}\n\nYou should receive this notification!`
      },
      data: {
        type: 'subscription_fix_test',
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
    console.log('📊 Test result:', testResult);
    
    if (testResponse.ok) {
      console.log('🎉 SUCCESS! Notification sent successfully!');
      console.log('📱 Check your device for the notification!');
    } else {
      console.log('❌ Test failed:', testResult);
    }
    
  } else {
    console.log('❌ Registration failed:', result);
  }
}

fixDeviceSubscription().catch(console.error);
