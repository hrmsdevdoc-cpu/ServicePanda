/**
 * Test After Error Fix
 * App error fix karne ke baad notification test
 */

console.log('🔧 Testing notifications after error fix...');
console.log('📱 App should now run without Firebase errors');
console.log('');

async function testNotificationAfterFix() {
  const payload = {
    app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
    headings: { en: '🔧 Error Fixed!' },
    contents: { 
      en: `App error fix ho gaya!\n\n✅ Firebase error resolved\n✅ OneSignal working with broadcast\n✅ No device registration needed\n\nTime: ${new Date().toLocaleTimeString()}\n\nBroadcast notification test!`
    },
    included_segments: ['Subscribed Users']
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Post-fix notification sent successfully!');
      console.log('📊 Result:', {
        id: result.id || 'Generated',
        recipients: result.recipients || 'Processing...'
      });
      console.log('');
      console.log('🎉 App should now run without errors!');
      console.log('📱 Logs should show: "Broadcast approach: Ready for notifications"');
    } else {
      console.log('❌ Post-fix test failed:', result);
    }
  } catch (error) {
    console.log('💥 Error in post-fix test:', error.message);
  }
}

console.log('⏰ Current time:', new Date().toLocaleString());
console.log('🚀 Running post-fix notification test...');
console.log('');

testNotificationAfterFix();
