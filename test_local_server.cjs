const http = require('http');

// Test local server notification endpoint
async function testLocalServer() {
  console.log('🧪 Testing Local Server Notification System...\n');
  
  // Test 1: Check if notification polling works
  console.log('📡 Testing notification polling endpoint...');
  
  const pollOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/provider/notifications/poll',
    method: 'GET',
    headers: {
      'x-provider-id': '1',
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve) => {
    const req = http.request(pollOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('📡 Poll Response Status:', res.statusCode);
        console.log('📡 Poll Response:', data);
        
        if (res.statusCode === 200) {
          console.log('✅ Polling endpoint working!');
          
          // Test 2: Try to trigger a test notification
          testPushNotification();
        } else {
          console.log('❌ Polling endpoint failed');
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Connection failed:', error.message);
      console.log('💡 Make sure server is running: npm run dev');
      resolve();
    });
    
    req.end();
  });
}

// Test sending a push notification via the admin endpoint
async function testPushNotification() {
  console.log('\n🔔 Testing Push Notification via Admin Endpoint...');
  
  const testData = JSON.stringify({
    providerId: 1,
    title: "🧪 Test from Local Server",
    message: "Testing server-side push notification!"
  });

  const pushOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/test-push-notification',
    method: 'POST',
    headers: {
      'x-admin-token': 'test-token',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testData)
    }
  };

  const req = http.request(pushOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('📤 Push Test Status:', res.statusCode);
      console.log('📤 Push Test Response:', data);
      
      if (res.statusCode === 200) {
        console.log('\n🎉 SUCCESS! Server can send push notifications!');
        console.log('💡 This means when leads expire, notifications will be sent');
      } else {
        console.log('\n❌ Push notification test failed');
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Push test error:', error.message);
  });
  
  req.write(testData);
  req.end();
}

// Test if server processes expired leads
async function triggerCronTest() {
  console.log('\n⏰ Testing Cron Job Trigger...');
  
  // This would trigger the lead processing
  const cronData = JSON.stringify({
    leadId: 74 // Use a test lead ID
  });

  const cronOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/test-lead-processing',
    method: 'POST',
    headers: {
      'x-admin-token': 'test-token',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(cronData)
    }
  };

  const req = http.request(cronOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('⏰ Cron Test Status:', res.statusCode);
      console.log('⏰ Cron Test Response:', data);
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Cron test error:', error.message);
  });
  
  req.write(cronData);
  req.end();
}

// Run all tests
testLocalServer().then(() => {
  setTimeout(() => {
    triggerCronTest();
  }, 2000);
});
