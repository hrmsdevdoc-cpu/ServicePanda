/**
 * Test Server-Side Push Notifications
 * Sends notifications directly from server - works even when app is CLOSED
 */

const fetch = require('node-fetch');

const ONESIGNAL_APP_ID = 'f64bf04a-b174-4862-a7b4-62b8d93f159b';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy';

async function sendBroadcastNotification() {
  console.log('🚀 Testing SERVER-SIDE push notification...');
  console.log('📱 This will work even if app is CLOSED!');
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { 
      en: '🔔 Server Push Test' 
    },
    contents: { 
      en: '💥 This notification came from SERVER CRON JOB!\n\nApp can be closed - you will still receive this!\n\nTime: ' + new Date().toLocaleTimeString()
    },
    included_segments: ['Subscribed Users'], // Sends to ALL subscribed devices
    data: {
      type: 'server_test',
      source: 'cron_job',
      timestamp: Date.now()
    }
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Server push notification sent!');
      console.log('📊 Result:', {
        id: result.id,
        recipients: result.recipients || 'Unknown',
        external_id: result.external_id
      });
      console.log('');
      console.log('📱 Check your emulator NOW - notification should appear!');
      console.log('🔥 This works even if app is closed/minimized!');
    } else {
      console.log('❌ Failed to send notification');
      console.log('📋 Response:', result);
    }
  } catch (error) {
    console.error('💥 Error sending notification:', error.message);
  }
}

// Test immediately
console.log('🎯 Starting server-side push notification test...');
console.log('⏰ Current time:', new Date().toLocaleString());
console.log('');

sendBroadcastNotification();
