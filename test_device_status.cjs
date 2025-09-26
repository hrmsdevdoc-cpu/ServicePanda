// Test script to check OneSignal device registration status
const http = require('http');

async function checkServerDeviceStatus() {
  console.log('🔍 Checking OneSignal Device Registration Status...\n');
  
  // First, send a test notification
  console.log('📤 Step 1: Sending test notification to trigger device check...');
  
  const testData = JSON.stringify({
    providerId: 1,
    title: "🔍 Device Status Check",
    message: "Testing if device is registered with OneSignal"
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/test-push-notification',
    method: 'POST',
    headers: {
      'x-admin-token': 'test-token',
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('📡 Server Response:', JSON.parse(data));
        
        console.log('\n📱 Important: Check your app logs for:');
        console.log('   - "📱 OneSignal Device Status:"');
        console.log('   - "Is Subscribed: true/false"');
        console.log('   - "Player ID: xxx"');
        console.log('   - "🎉 Device successfully registered" OR "⚠️ Device NOT registered"');
        
        console.log('\n💡 If device is NOT registered:');
        console.log('   1. Make sure OneSignal SDK is properly installed');
        console.log('   2. Check app permissions for notifications');
        console.log('   3. Verify OneSignal App ID is correct');
        console.log('   4. Make sure app has been opened at least once');
        
        console.log('\n🧪 Test the OneSignal API response:');
        testOneSignalAPI();
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      resolve();
    });
    
    req.write(testData);
    req.end();
  });
}

function testOneSignalAPI() {
  const https = require('https');
  
  const payload = {
    app_id: "f64bf04a-b174-4862-a7b4-62b8d93f159b",
    include_external_user_ids: ["1"], // Provider ID 1
    headings: { en: "🧪 Direct API Test" },
    contents: { en: "Testing if Provider ID 1 is registered" }
  };

  const postData = JSON.stringify(payload);
  const options = {
    hostname: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n📡 OneSignal API Test Result:');
      console.log('Response:', data);
      
      try {
        const result = JSON.parse(data);
        if (result.errors && result.errors.includes("All included players are not subscribed")) {
          console.log('\n❌ PROBLEM CONFIRMED: Provider ID 1 is NOT registered with OneSignal');
          console.log('📱 This means the ServicePanda app has not registered the device');
        } else if (result.recipients > 0) {
          console.log('\n✅ SUCCESS: Provider ID 1 is registered and can receive notifications!');
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('API test error:', error.message);
  });

  req.write(postData);
  req.end();
}

checkServerDeviceStatus();
