const http = require('http');

// Force test a real OneSignal push notification
async function testRealPush() {
  console.log('🔔 Testing REAL OneSignal Push from Server...\n');
  
  const testData = JSON.stringify({
    providerId: 1,
    title: "🚨 REAL Test from Server",
    message: "This should appear in your phone notification bar!"
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

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('📡 Server Response Status:', res.statusCode);
      console.log('📡 Server Response:', data);
      
      if (res.statusCode === 200) {
        console.log('\n✅ Server says notification sent!');
        console.log('📱 Check your phone notification bar');
        console.log('📱 If you don\'t see it, the OneSignal API call failed');
        
        // Now check server logs
        console.log('\n🔍 Check your server console logs for:');
        console.log('   - "🚀 Sending REAL push notification from SERVER"');
        console.log('   - "📤 Sending OneSignal push notification"');
        console.log('   - "✅ OneSignal notification sent"');
      } else {
        console.log('\n❌ Server failed to send notification');
        console.log('Response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
  });
  
  req.write(testData);
  req.end();
}

// Test what happens when we check polling after sending
async function testPollingAfterPush() {
  console.log('\n📡 Checking if notification appears in polling...');
  
  setTimeout(() => {
    const pollOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/provider/notifications/poll',
      method: 'GET',
      headers: {
        'x-provider-id': '1'
      }
    };

    const req = http.request(pollOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('📡 Polling Response:', data);
        
        try {
          const result = JSON.parse(data);
          if (result.notifications && result.notifications.length > 0) {
            console.log(`\n📨 Found ${result.notifications.length} notifications in queue:`);
            result.notifications.forEach((notif, i) => {
              console.log(`   ${i+1}. ${notif.title}: ${notif.message}`);
            });
            
            console.log('\n💡 This proves server is creating notifications');
            console.log('💡 But check if OneSignal API was actually called');
          } else {
            console.log('\n📭 No notifications in polling queue');
          }
        } catch (e) {
          console.log('\n❌ Could not parse polling response');
        }
      });
    });
    
    req.end();
  }, 1000);
}

testRealPush();
testPollingAfterPush();
