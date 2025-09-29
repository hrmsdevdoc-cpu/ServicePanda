/**
 * Test notifications to the working device from OneSignal dashboard
 * Using the exact OneSignal ID and External User ID we can see working
 */

console.log('🧪 Testing Notifications to Working Device...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function testWorkingDevice() {
  console.log('🎯 TESTING THE WORKING DEVICE FROM DASHBOARD');
  console.log('');
  
  // Test 1: Target by OneSignal Player ID (from dashboard)
  console.log('📱 TEST 1: Target by OneSignal Player ID');
  console.log('🆔 Using ID: bf78a978-b759-4869-a4b2-... (from dashboard)');
  
  const playerIdPayload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['bf78a978-b759-48b9-a4b2-94d4b7647d02'], // Complete ID from dashboard
    headings: { en: '🎯 PLAYER ID TEST' },
    contents: { 
      en: `Testing direct Player ID targeting!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you receive this, Player ID targeting works! 🎉`
    },
    data: {
      testType: 'player-id-targeting',
      timestamp: Date.now()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  try {
    const response1 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(playerIdPayload)
    });
    
    const result1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Player ID targeting sent successfully!');
      console.log(`   📊 Recipients: ${result1.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result1.id}`);
      if (result1.errors && result1.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result1.errors)}`);
      }
    } else {
      console.log('❌ Player ID targeting failed:');
      console.log('   📋 Error:', result1);
    }
  } catch (error) {
    console.log('💥 Player ID test error:', error.message);
  }
  
  console.log('');
  
  // Wait a bit before next test
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Target by External User ID (provider-1)
  console.log('📱 TEST 2: Target by External User ID');
  console.log('🆔 Using External ID: provider-1 (from dashboard)');
  
  const externalIdPayload = {
    app_id: ONESIGNAL_APP_ID,
    include_external_user_ids: ['provider-1'], // External ID from dashboard
    headings: { en: '🎯 EXTERNAL ID TEST' },
    contents: { 
      en: `Testing External User ID targeting!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you receive this, External ID targeting works! 🎉`
    },
    data: {
      testType: 'external-user-id-targeting',
      timestamp: Date.now()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  try {
    const response2 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(externalIdPayload)
    });
    
    const result2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ External ID targeting sent successfully!');
      console.log(`   📊 Recipients: ${result2.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result2.id}`);
      if (result2.errors && result2.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result2.errors)}`);
      }
    } else {
      console.log('❌ External ID targeting failed:');
      console.log('   📋 Error:', result2);
    }
  } catch (error) {
    console.log('💥 External ID test error:', error.message);
  }
  
  console.log('');
  
  // Wait a bit before next test
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 3: Broadcast to all subscribed users
  console.log('📱 TEST 3: Broadcast to All Subscribed Users');
  
  const broadcastPayload = {
    app_id: ONESIGNAL_APP_ID,
    included_segments: ['Subscribed Users'], // Broadcast to all
    headings: { en: '📢 BROADCAST TEST' },
    contents: { 
      en: `Testing broadcast to all users!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you receive this, broadcast targeting works! 🎉`
    },
    data: {
      testType: 'broadcast-targeting',
      timestamp: Date.now()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  try {
    const response3 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(broadcastPayload)
    });
    
    const result3 = await response3.json();
    
    if (response3.ok) {
      console.log('✅ Broadcast targeting sent successfully!');
      console.log(`   📊 Recipients: ${result3.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result3.id}`);
      if (result3.errors && result3.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result3.errors)}`);
      }
    } else {
      console.log('❌ Broadcast targeting failed:');
      console.log('   📋 Error:', result3);
    }
  } catch (error) {
    console.log('💥 Broadcast test error:', error.message);
  }
  
  console.log('');
  console.log('🎯 WORKING DEVICE TEST COMPLETE!');
  console.log('');
  console.log('💡 Expected Results:');
  console.log('   - If recipients > 0: That targeting method works!');
  console.log('   - If recipients = 0: Device may not be properly subscribed');
  console.log('   - Check your mobile device for notifications');
  console.log('');
  console.log('📱 Based on your dashboard, the device IS connected and active!');
}

testWorkingDevice();
