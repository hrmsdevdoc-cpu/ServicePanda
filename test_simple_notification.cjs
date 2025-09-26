/**
 * SIMPLE NOTIFICATION TEST
 * Bhai, ye sabse simple test hai - bas ek command run karo
 */

const fetch = require('node-fetch');

console.log('🔥 Bhai, notification test kar rahe hain...');
console.log('📱 Make sure app is CLOSED on emulator!');
console.log('');

async function sendSimpleNotification() {
  const payload = {
    app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
    headings: { en: '🔥 Test Notification!' },
    contents: { 
      en: `Bhai ye notification server se aa raha hai!\n\nApp closed hai lekin notification aa gaya!\n\nTime: ${new Date().toLocaleTimeString()}`
    },
    include_player_ids: ['37b92c0a-63a7-44b4-b1b6-561e80301b21'],
    data: {
      type: 'simple_test',
      message: 'Server se direct aa raha hai!'
    }
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
      console.log('✅ SUCCESS! Notification bhej diya!');
      console.log('📱 Emulator check karo - notification aa jana chahiye!');
      console.log('🔥 App closed hai lekin notification aa jayega!');
    } else {
      console.log('❌ Problem hai:', result);
    }
  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

sendSimpleNotification();