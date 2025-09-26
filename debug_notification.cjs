/**
 * DEBUG NOTIFICATION - Check kya problem hai
 */

const fetch = require('node-fetch');

console.log('🔍 Debug kar rahe hain kya problem hai...');
console.log('');

async function checkOneSignalStatus() {
  console.log('1. OneSignal API status check kar rahe hain...');
  
  try {
    const response = await fetch('https://onesignal.com/api/v1/apps/f64bf04a-b174-4862-a7b4-62b8d93f159b', {
      headers: {
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ OneSignal app working');
      console.log('📊 App Name:', data.name);
      console.log('👥 Players:', data.players || 'Unknown');
    } else {
      console.log('❌ OneSignal app problem');
    }
  } catch (error) {
    console.log('💥 OneSignal API error:', error.message);
  }

  console.log('');
  console.log('2. Device status check kar rahe hain...');
  
  try {
    const deviceResponse = await fetch('https://onesignal.com/api/v1/players/37b92c0a-63a7-44b4-b1b6-561e80301b21?app_id=f64bf04a-b174-4862-a7b4-62b8d93f159b', {
      headers: {
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      }
    });

    if (deviceResponse.ok) {
      const deviceData = await deviceResponse.json();
      console.log('✅ Device found in OneSignal');
      console.log('📱 Device ID:', deviceData.id);
      console.log('🔔 Valid Subscriber:', deviceData.valid_subscriber);
      console.log('📡 Session Count:', deviceData.session_count);
      console.log('⏰ Last Active:', deviceData.last_active);
    } else {
      console.log('❌ Device not found in OneSignal');
      console.log('💡 Device registration nahi hua properly');
    }
  } catch (error) {
    console.log('💥 Device check error:', error.message);
  }

  console.log('');
  console.log('3. Simple broadcast test kar rahe hain...');
  
  const broadcastPayload = {
    app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
    headings: { en: '📢 Broadcast Test' },
    contents: { en: 'Ye broadcast notification hai - sabko milega!' },
    included_segments: ['Subscribed Users']
  };

  try {
    const broadcastResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      },
      body: JSON.stringify(broadcastPayload)
    });

    const broadcastResult = await broadcastResponse.json();
    
    if (broadcastResponse.ok) {
      console.log('✅ Broadcast notification sent');
      console.log('📊 Recipients:', broadcastResult.recipients);
    } else {
      console.log('❌ Broadcast failed:', broadcastResult);
    }
  } catch (error) {
    console.log('💥 Broadcast error:', error.message);
  }
}

checkOneSignalStatus();
