/**
 * FORCE FIX: Make devices valid subscribers
 * Fix karte hain dono devices ko
 */

console.log('🔧 FORCE FIXING DEVICE SUBSCRIPTIONS...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function forceFixSubscriptions() {
  console.log('🎯 FORCE FIXING BOTH DEVICES FROM DEBUG RESULTS');
  console.log('');
  
  // Both device IDs from debug output
  const devicesToFix = [
    {
      id: '93571930-9bef-430c-ac24-01c210fc83b7',
      name: 'Device 1 (provider-1)'
    },
    {
      id: '80a5e8a8-86bd-4cf2-84af-8335e370798e', 
      name: 'Device 2 (provider-1)'
    }
  ];
  
  for (let i = 0; i < devicesToFix.length; i++) {
    const device = devicesToFix[i];
    console.log(`🔧 FIXING ${device.name}:`);
    console.log(`   🆔 ID: ${device.id}`);
    
    try {
      // FORCE subscription with all required fields
      const fixPayload = {
        notification_types: 1, // FORCE subscribed
        // Try multiple approaches
      };
      
      console.log('   📡 Sending fix request...');
      
      const response = await fetch(`https://onesignal.com/api/v1/players/${device.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify(fixPayload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ ${device.name} fix successful!`);
        console.log(`   📋 Response:`, result);
      } else {
        const error = await response.json();
        console.log(`   ❌ ${device.name} fix failed:`, error);
      }
      
    } catch (error) {
      console.log(`   💥 ${device.name} error:`, error.message);
    }
    
    console.log('');
    
    // Wait between requests
    if (i < devicesToFix.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('⏳ Waiting for changes to take effect...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test notification to first device
  console.log('🧪 TESTING NOTIFICATION AFTER FIX...');
  
  const testPayload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['93571930-9bef-430c-ac24-01c210fc83b7'], // First device
    headings: { en: '🎉 SUBSCRIPTION FORCE FIXED!' },
    contents: { 
      en: `Bhai! Subscription force fix ho gaya!\n\nTime: ${new Date().toLocaleTimeString()}\n\nAgar ye notification aa gaya to sab theek! 🎉💥`
    },
    data: {
      testType: 'force-fix-test',
      timestamp: Date.now(),
      message: 'subscription-fixed'
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  try {
    const testResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(testPayload)
    });
    
    const testResult = await testResponse.json();
    
    if (testResponse.ok) {
      console.log('✅ FORCE FIX TEST SENT!');
      console.log(`   📊 Recipients: ${testResult.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${testResult.id}`);
      
      if (testResult.recipients > 0) {
        console.log('');
        console.log('🎉🎉🎉 BHAI! FIX HO GAYA! NOTIFICATIONS WORKING! 🎉🎉🎉');
        console.log('📱 Check your mobile device RIGHT NOW!');
        console.log('🚀 Your server should work now!');
      } else {
        console.log('');
        console.log('😤 Still showing 0 recipients...');
        if (testResult.errors && testResult.errors.length > 0) {
          console.log(`   ⚠️ Errors: ${JSON.stringify(testResult.errors)}`);
        }
      }
    } else {
      console.log('❌ Test failed:', testResult);
    }
  } catch (error) {
    console.log('💥 Test error:', error.message);
  }
  
  // Try broadcast test too
  console.log('');
  console.log('🧪 TRYING BROADCAST TEST...');
  
  const broadcastPayload = {
    app_id: ONESIGNAL_APP_ID,
    included_segments: ['Subscribed Users'],
    headings: { en: '📢 BROADCAST AFTER FIX!' },
    contents: { 
      en: `Broadcast test after force fix!\n\nTime: ${new Date().toLocaleTimeString()}\n\nSab devices ko milna chahiye! 🎯`
    },
    data: {
      testType: 'broadcast-after-fix',
      timestamp: Date.now()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  try {
    const broadcastResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(broadcastPayload)
    });
    
    const broadcastResult = await broadcastResponse.json();
    
    if (broadcastResponse.ok) {
      console.log('✅ BROADCAST TEST SENT!');
      console.log(`   📊 Recipients: ${broadcastResult.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${broadcastResult.id}`);
      
      if (broadcastResult.recipients > 0) {
        console.log('');
        console.log('🔥🔥🔥 BROADCAST WORKING! ALL FIXED! 🔥🔥🔥');
      }
    } else {
      console.log('❌ Broadcast failed:', broadcastResult);
    }
  } catch (error) {
    console.log('💥 Broadcast error:', error.message);
  }
  
  console.log('');
  console.log('🎯 FORCE FIX COMPLETE!');
  console.log('💡 Agar abhi bhi nahi aaya to device settings check karo:');
  console.log('   Settings → Apps → ServicePandaProvider → Notifications → ON');
}

forceFixSubscriptions();
