/**
 * WORKING BROADCAST NOTIFICATION
 * Ye definitely kaam karega - sabko milta hai
 */

const fetch = require('node-fetch');

console.log('📢 Broadcast notification test kar rahe hain...');
console.log('🔥 Ye definitely kaam karega!');
console.log('');

async function sendWorkingNotification() {
  const payload = {
    app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
    headings: { en: '🔥 WORKING NOTIFICATION!' },
    contents: { 
      en: `Bhai ye notification definitely aa jayega!\n\nBroadcast notification hai - sabko milta hai!\n\nApp closed hai lekin notification aa raha hai!\n\nTime: ${new Date().toLocaleTimeString()}`
    },
    // Broadcast to ALL subscribed users
    included_segments: ['Subscribed Users'],
    data: {
      type: 'broadcast_test',
      message: 'Server se broadcast notification!'
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
      console.log('✅ SUCCESS! Broadcast notification bhej diya!');
      console.log('📊 Recipients:', result.recipients || 'Processing...');
      console.log('📱 Emulator check karo - notification AA JANA CHAHIYE!');
      console.log('🔥 App closed hai lekin notification aa jayega!');
      console.log('');
      console.log('💡 Ye approach sabse reliable hai!');
    } else {
      console.log('❌ Problem hai:', result);
    }
  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

sendWorkingNotification();
