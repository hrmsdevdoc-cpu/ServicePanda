/**
 * Test Targeted Notification to Specific Device
 * Uses the manually registered OneSignal Player ID
 */

const fetch = require('node-fetch');

const ONESIGNAL_APP_ID = 'f64bf04a-b174-4862-a7b4-62b8d93f159b';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy';

// Your manually registered device ID
const TARGET_DEVICE_ID = '37b92c0a-63a7-44b4-b1b6-561e80301b21';

async function sendTargetedNotification() {
  console.log('🎯 Sending TARGETED notification to your device...');
  console.log('📱 Device ID:', TARGET_DEVICE_ID);
  console.log('');
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { 
      en: '🎯 Targeted Notification!' 
    },
    contents: { 
      en: `✅ SUCCESS! This notification was sent directly to YOUR device!\n\nDevice ID: ${TARGET_DEVICE_ID}\n\nTime: ${new Date().toLocaleTimeString()}\n\n🔥 App can be CLOSED and you'll still get this!`
    },
    // Target specific device by Player ID
    include_player_ids: [TARGET_DEVICE_ID],
    data: {
      type: 'targeted_test',
      deviceId: TARGET_DEVICE_ID,
      source: 'direct_targeting',
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
      console.log('✅ SUCCESS: Targeted notification sent!');
      console.log('📊 Result:', {
        id: result.id,
        recipients: result.recipients,
        invalid_player_ids: result.invalid_player_ids || 'None'
      });
      console.log('');
      console.log('🎉 Perfect! Now notifications work for specific devices!');
      console.log('📱 Check your emulator - notification should appear!');
    } else {
      console.log('❌ Failed to send targeted notification');
      console.log('📋 Response:', result);
    }
  } catch (error) {
    console.error('💥 Error sending targeted notification:', error.message);
  }
}

async function sendProviderSpecificNotification() {
  console.log('');
  console.log('🔔 Sending Provider-specific notification...');
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { 
      en: '💼 New Lead for Provider 1!' 
    },
    contents: { 
      en: `New service request received!\n\nCustomer: Sarah Johnson\nService: Electrical Work\nLocation: Brisbane, QLD\nBudget: $200-300\n\nQuote now to win this lead!\n\nTime: ${new Date().toLocaleTimeString()}`
    },
    include_player_ids: [TARGET_DEVICE_ID],
    data: {
      type: 'new_lead',
      providerId: '1',
      leadId: '123',
      source: 'lead_distribution',
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
      console.log('✅ SUCCESS: Provider lead notification sent!');
      console.log('📊 Notification ID:', result.id);
      console.log('');
      console.log('🎯 This is exactly how real lead notifications work!');
    } else {
      console.log('❌ Failed to send provider notification');
      console.log('📋 Response:', result);
    }
  } catch (error) {
    console.error('💥 Error sending provider notification:', error.message);
  }
}

// Test both targeted and provider-specific notifications
async function runTargetedTests() {
  console.log('🚀 Testing TARGETED notifications with your registered device...');
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('');
  
  // Send targeted notification
  await sendTargetedNotification();
  
  // Wait 3 seconds
  console.log('⏳ Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Send provider-specific notification
  await sendProviderSpecificNotification();
  
  console.log('');
  console.log('🎉 TARGETED NOTIFICATION TESTS COMPLETED!');
  console.log('📱 Check emulator for BOTH notifications!');
  console.log('🔥 These work even when app is CLOSED!');
}

runTargetedTests();
