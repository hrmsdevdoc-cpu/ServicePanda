// Simple OneSignal push notification test
// Tests if server can send push notifications to device

async function testPushNotification() {
  console.log('🚀 Testing OneSignal push notification...');
  
  const appId = 'f64bf04a-b174-4862-a7b4-62b8d93f159b';
  const restApiKey = 'os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy';
  
  const payload = {
    app_id: appId,
    contents: {
      en: "🔥 TEST: Push notification when app is closed!"
    },
    headings: {
      en: "🚨 Server Test"
    },
    // Target all subscribed users
    included_segments: ["Subscribed Users"]
  };
  
  try {
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
      console.log('✅ Push notification sent successfully!');
      console.log('📊 Result:', result);
    } else {
      console.log('❌ Push notification failed:', result);
    }
  } catch (error) {
    console.log('❌ Error sending push notification:', error);
  }
}

// Run the test
testPushNotification();
