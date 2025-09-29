/**
 * Test notifications to the 2 subscribed users
 * Since dashboard shows "Subscribed to Push: 2"
 */

console.log('🧪 Testing Notifications to Subscribed Users...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function testSubscribedUsers() {
  console.log('🎯 YOUR DASHBOARD SHOWS 2 SUBSCRIBED USERS!');
  console.log('📊 Testing different targeting methods...');
  console.log('');
  
  // Test 1: Target by specific Player ID
  console.log('📱 TEST 1: Target Specific Player ID');
  console.log('🆔 Targeting: bf78a978-b759-48b9-a4b2-94d4b7647d02');
  
  const test1Payload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['bf78a978-b759-48b9-a4b2-94d4b7647d02'],
    headings: { en: '🎯 SPECIFIC PLAYER TEST' },
    contents: { 
      en: `Testing specific player targeting!\n\nTime: ${new Date().toLocaleTimeString()}\n\nYou have 2 subscribed users - this should work now! 🎉`
    },
    data: {
      testType: 'specific-player-test',
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
      body: JSON.stringify(test1Payload)
    });
    
    const result1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Specific player test sent!');
      console.log(`   📊 Recipients: ${result1.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result1.id}`);
      if (result1.errors && result1.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result1.errors)}`);
      }
    } else {
      console.log('❌ Specific player test failed:', result1);
    }
  } catch (error) {
    console.log('💥 Test 1 error:', error.message);
  }
  
  console.log('');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: External User ID targeting
  console.log('📱 TEST 2: External User ID Targeting');
  console.log('🆔 Targeting: provider-1');
  
  const test2Payload = {
    app_id: ONESIGNAL_APP_ID,
    include_external_user_ids: ['provider-1'],
    headings: { en: '🎯 EXTERNAL ID TEST' },
    contents: { 
      en: `Testing external user ID targeting!\n\nTime: ${new Date().toLocaleTimeString()}\n\nThis targets provider-1 specifically! 🎉`
    },
    data: {
      testType: 'external-user-id-test',
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
      body: JSON.stringify(test2Payload)
    });
    
    const result2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ External ID test sent!');
      console.log(`   📊 Recipients: ${result2.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result2.id}`);
      if (result2.errors && result2.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result2.errors)}`);
      }
    } else {
      console.log('❌ External ID test failed:', result2);
    }
  } catch (error) {
    console.log('💥 Test 2 error:', error.message);
  }
  
  console.log('');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 3: Broadcast to all subscribed users (should reach 2 users)
  console.log('📱 TEST 3: Broadcast to All Subscribed Users');
  console.log('🎯 Should reach all 2 subscribed users');
  
  const test3Payload = {
    app_id: ONESIGNAL_APP_ID,
    included_segments: ['Subscribed Users'],
    headings: { en: '📢 BROADCAST TO ALL!' },
    contents: { 
      en: `Broadcasting to all subscribed users!\n\nTime: ${new Date().toLocaleTimeString()}\n\nYour dashboard shows 2 subscribed users - both should get this! 🎉🎉`
    },
    data: {
      testType: 'broadcast-test',
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
      body: JSON.stringify(test3Payload)
    });
    
    const result3 = await response3.json();
    
    if (response3.ok) {
      console.log('✅ Broadcast test sent!');
      console.log(`   📊 Recipients: ${result3.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result3.id}`);
      if (result3.errors && result3.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result3.errors)}`);
      }
      
      if (result3.recipients > 0) {
        console.log('');
        console.log('🎉🎉🎉 SUCCESS! NOTIFICATIONS ARE WORKING! 🎉🎉🎉');
        console.log('📱 Check your mobile device(s) for notifications!');
        console.log('🚀 Your server notification system should now work!');
      }
    } else {
      console.log('❌ Broadcast test failed:', result3);
    }
  } catch (error) {
    console.log('💥 Test 3 error:', error.message);
  }
  
  console.log('');
  console.log('🎯 SUBSCRIBED USERS TEST COMPLETE!');
  console.log('');
  console.log('💡 Results Summary:');
  console.log('   - If any test shows recipients > 0: NOTIFICATIONS WORK! 🎉');
  console.log('   - Your dashboard shows 2 subscribed users');
  console.log('   - At least one targeting method should work now');
}

testSubscribedUsers();
