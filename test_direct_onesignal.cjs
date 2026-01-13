const https = require('https');

// Direct OneSignal API test - send to ALL devices
async function testDirectOneSignal() {
  console.log('🔥 DIRECT OneSignal API Test - Send to ALL devices...\n');

  const payload = {
    app_id: "f64bf04a-b174-4862-a7b4-62b8d93f159b",
    included_segments: ["Subscribed Users"], // Send to ALL subscribed users
    headings: { en: "🚨 DIRECT OneSignal Test" },
    contents: { en: "This is sent directly from server to ALL devices. If you see this, OneSignal works!" },
    data: {
      direct_test: true,
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

  console.log('📤 Sending direct OneSignal API request...');
  console.log('🎯 Target: ALL subscribed users');
  console.log('📋 Payload:', JSON.stringify(payload, null, 2));

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('\n📡 OneSignal Direct API Response:');
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', data);
        
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('\n🎉 SUCCESS! OneSignal API call worked!');
            console.log('📨 Notification ID:', result.id);
            console.log('👥 Recipients:', result.recipients || 'Unknown');
            
            if (result.recipients === 0) {
              console.log('\n⚠️  NO RECIPIENTS - This means:');
              console.log('   1. Your emulator/device is not registered with OneSignal');
              console.log('   2. The ServicePanda app needs OneSignal SDK properly setup');
              console.log('   3. App must be opened at least once to register with OneSignal');
              console.log('\n💡 TO FIX:');
              console.log('   1. Install the ServicePanda app on emulator');
              console.log('   2. Open the app (this registers with OneSignal)');
              console.log('   3. Then test again');
            } else {
              console.log('\n🚀 NOTIFICATION DELIVERED! Check your device notification bar!');
            }
          } else {
            console.log('\n❌ OneSignal API Error:');
            console.log(result);
          }
        } catch (e) {
          console.log('\n❌ Response parse error:', e.message);
          console.log('Raw response:', data);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('\n❌ Network error:', error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

testDirectOneSignal();
