// Working OneSignal test with built-in modules
const https = require('https');

async function sendWorkingOneSignalNotification() {
  console.log('🚀 Testing WORKING OneSignal Notification...\n');

  const payload = {
    app_id: "f64bf04a-b174-4862-a7b4-62b8d93f159b",
    included_segments: ["Subscribed Users"],
    headings: { en: "🔥 WORKING Server Notification" },
    contents: { en: "This notification should appear on your device if it's registered with OneSignal!" },
    data: {
      test: true,
      timestamp: new Date().toISOString()
    }
  };

  const postData = JSON.stringify(payload);

  const options = {
    hostname: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('📤 Sending OneSignal notification...');
  console.log('🎯 Target: All subscribed users');

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('\n📡 OneSignal Response:');
        console.log('Status:', res.statusCode);
        console.log('Body:', data);
        
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('\n✅ OneSignal API call successful!');
            
            if (result.errors && result.errors.includes("All included players are not subscribed")) {
              console.log('\n⚠️  No devices registered with OneSignal');
              console.log('📱 This means:');
              console.log('   1. ServicePanda app not installed/opened');
              console.log('   2. OneSignal SDK not properly configured in app');
              console.log('   3. Device not registered with OneSignal servers');
              console.log('\n💡 Solution:');
              console.log('   1. Install ServicePanda app on device');
              console.log('   2. Open app (registers with OneSignal)');
              console.log('   3. Then notifications will work!');
            } else if (result.recipients && result.recipients > 0) {
              console.log(`\n🎉 SUCCESS! Delivered to ${result.recipients} device(s)!`);
              console.log('📱 Check your device notification bar!');
            } else {
              console.log('\n📊 Notification sent but no recipients');
            }
          } else {
            console.log('\n❌ OneSignal API error:', result);
          }
        } catch (e) {
          console.log('\n❌ Parse error:', e.message);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('\n❌ Request error:', error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

sendWorkingOneSignalNotification();
