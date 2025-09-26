// Simple test to see if notifications work
const https = require('https');

async function testSimpleNotification() {
  console.log('🧪 Testing Simple OneSignal Notification...\n');

  // Simple notification without android_channel_id
  const payload = {
    app_id: "f64bf04a-b174-4862-a7b4-62b8d93f159b",
    include_external_user_ids: ["1"], // Provider ID 1
    headings: { en: "🧪 ServicePanda Test" },
    contents: { en: "Test notification from server - Lead expired!" },
    data: {
      test: true,
      type: "expired_lead",
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

  console.log('📤 Sending simplified OneSignal request...');
  console.log('📋 Payload:', JSON.stringify(payload, null, 2));

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('\n📡 Response Status:', res.statusCode);
      console.log('📡 Response Body:', data);
      
      try {
        const result = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('\n✅ SUCCESS! Notification sent');
          console.log('📨 ID:', result.id);
          console.log('👥 Recipients:', result.recipients);
          
          if (result.recipients === 0) {
            console.log('\n⚠️  No recipients found. This means:');
            console.log('   1. Device not registered with OneSignal yet');
            console.log('   2. App needs to be opened and configured');
            console.log('   3. Provider ID "1" not linked to any device');
          } else {
            console.log('\n🎉 Notification delivered to', result.recipients, 'device(s)!');
          }
        } else {
          console.log('\n❌ FAILED:', result);
        }
      } catch (e) {
        console.log('\n❌ Parse error:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
  });

  req.write(postData);
  req.end();
}

// Test the server's actual cron job
async function testCronNotification() {
  console.log('\n🔧 Testing if server cron notifications would work...\n');
  
  // This simulates what happens in the server when a lead expires
  console.log('📋 Simulating expired lead notification:');
  console.log('   - Lead ID: 123');
  console.log('   - Provider ID: 1'); 
  console.log('   - Event: Lead offer expired');
  console.log('   - Server would call OneSignal API...');
  
  await testSimpleNotification();
}

testCronNotification();
