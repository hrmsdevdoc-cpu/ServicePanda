// Test broadcast notification to ALL devices (no specific provider needed)
const https = require('https');

async function testBroadcastNotification() {
  console.log('🧪 Testing Broadcast Notification to ALL devices...\n');

  // Broadcast to all subscribed devices
  const payload = {
    app_id: "f64bf04a-b174-4862-a7b4-62b8d93f159b",
    included_segments: ["Subscribed Users"], // Send to all subscribed users
    headings: { en: "🧪 ServicePanda Server Test" },
    contents: { en: "Server-side push notifications are working! This proves the system works." },
    data: {
      test: true,
      broadcast: true,
      server_test: true,
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
      'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
    }
  };

  console.log('📤 Sending broadcast notification...');
  console.log('📋 Target: All subscribed users');
  console.log('📋 Message: Server-side push notifications test');

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('\n📡 OneSignal API Response:');
      console.log('Status:', res.statusCode);
      console.log('Body:', data);
      
      try {
        const result = JSON.parse(data);
        if (res.statusCode === 200 && result.id) {
          console.log('\n🎉 SUCCESS! Broadcast notification sent!');
          console.log('📨 Notification ID:', result.id);
          console.log('👥 Recipients:', result.recipients || 'Unknown');
          
          console.log('\n📱 If you have the ServicePanda app installed:');
          console.log('   - Check your notification bar');
          console.log('   - You should see the test notification');
          console.log('   - This proves server-side push works!');
          
          if (result.recipients > 0) {
            console.log('\n✅ CONFIRMED: Push notifications are working!');
            console.log('   The server can now send notifications when:');
            console.log('   - Leads expire ⏰');
            console.log('   - Prices drop 💸');
            console.log('   - New requests arrive 🛎️');
          }
        } else {
          console.log('\n❌ Something went wrong:', result);
        }
      } catch (e) {
        console.log('\n❌ Parse error:', e.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
  });

  req.write(postData);
  req.end();
}

testBroadcastNotification();
