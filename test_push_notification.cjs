// Test script to check if OneSignal push notifications work
const https = require('https');

async function testPushNotification() {
  console.log('🧪 Testing OneSignal Push Notification System...\n');

  const oneSignalData = {
    app_id: "f64bf04a-b174-4862-a7b4-62b8d93f159b",
    include_external_user_ids: ["1"], // Provider ID 1
    headings: { en: "🧪 Test from Server" },
    contents: { en: "This is a test push notification sent directly from the server!" },
    data: {
      test: true,
      timestamp: new Date().toISOString(),
      provider_id: 1
    },
    android_channel_id: "servicepanda-system",
    priority: 10,
    android_sound: "default",
    content_available: true
  };

  const postData = JSON.stringify(oneSignalData);

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

  console.log('📤 Sending OneSignal API request...');
  console.log('🔑 App ID:', oneSignalData.app_id);
  console.log('👤 Target Provider ID:', oneSignalData.include_external_user_ids[0]);
  console.log('📋 Message:', oneSignalData.contents.en);
  console.log('');

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📡 OneSignal API Response:');
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', data);
        console.log('');

        try {
          const responseObj = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ SUCCESS: Push notification sent!');
            console.log('📨 Notification ID:', responseObj.id);
            console.log('👥 Recipients:', responseObj.recipients || 'Unknown');
            
            if (responseObj.recipients === 0) {
              console.log('⚠️  WARNING: 0 recipients - device may not be registered with OneSignal');
            }
          } else {
            console.log('❌ FAILED: OneSignal API returned error');
            console.log('Error:', responseObj);
          }
          
          resolve(responseObj);
        } catch (parseError) {
          console.log('❌ FAILED: Could not parse response');
          console.log('Raw response:', data);
          reject(parseError);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ FAILED: Network error');
      console.error('Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test our server's notification service
async function testServerNotificationService() {
  console.log('\n🔧 Testing Server Notification Service...\n');

  try {
    // Import and test the server's notification service
    const { oneSignalAdminService } = require('./server/oneSignalAdminService');
    
    console.log('📤 Testing server notification service...');
    
    const result = await oneSignalAdminService.sendToProvider(1, {
      title: "🧪 Server Test Notification",
      message: "Testing server-side push notification service!",
      data: {
        test: true,
        serverTest: true,
        timestamp: new Date().toISOString()
      }
    });

    if (result.success) {
      console.log('✅ Server notification service working!');
      console.log('📨 Notification ID:', result.id);
    } else {
      console.log('❌ Server notification service failed');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.log('❌ Could not test server service:', error.message);
  }
}

// Run tests
async function runAllTests() {
  try {
    console.log('🚀 ServicePanda Push Notification Test Suite\n');
    console.log('=' .repeat(60));
    
    // Test 1: Direct OneSignal API
    await testPushNotification();
    
    console.log('=' .repeat(60));
    
    // Test 2: Server notification service
    await testServerNotificationService();
    
    console.log('=' .repeat(60));
    console.log('\n📱 Check your phone for push notifications!');
    console.log('💡 If you don\'t receive notifications:');
    console.log('   1. Make sure the app is installed and has been opened at least once');
    console.log('   2. Ensure notification permissions are granted');
    console.log('   3. Check that OneSignal is properly configured in the app');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runAllTests();
