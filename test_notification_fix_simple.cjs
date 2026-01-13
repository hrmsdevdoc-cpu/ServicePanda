/**
 * Simple test for fixed OneSignal notifications
 * Tests the exact device IDs from the dashboard
 */

console.log('🧪 Testing Fixed OneSignal Notifications (Simple)...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function testNotificationFix() {
  console.log('🎯 TESTING FIXED NOTIFICATION TARGETING');
  console.log('');
  
  // Test 1: Target first user by OneSignal ID
  console.log('📱 TEST 1: Provider 1 (OneSignal ID: 0a21c9be-2a45-40bf-b9a3-b2b70d78da27)');
  
  const payload1 = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['0a21c9be-2a45-40bf-b9a3-b2b70d78da27'], // First user from dashboard
    headings: { en: '🎯 FIXED TEST - Provider 1' },
    contents: { 
      en: `Notification fix test for Provider 1!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you receive this, the device mapping fix is working! 🎉`
    },
    data: {
      providerId: 1,
      testType: 'device-mapping-fix',
      timestamp: Date.now()
    },
    // Enhanced delivery settings
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
      body: JSON.stringify(payload1)
    });
    
    const result1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Provider 1 notification sent successfully!');
      console.log(`   📊 Recipients: ${result1.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result1.id}`);
      if (result1.errors && result1.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result1.errors)}`);
      }
    } else {
      console.log('❌ Provider 1 notification failed:');
      console.log('   📋 Error:', result1);
    }
  } catch (error) {
    console.log('💥 Provider 1 test error:', error.message);
  }
  
  console.log('');
  
  // Wait a bit before next test
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Target second user by OneSignal ID
  console.log('📱 TEST 2: Provider 2 (OneSignal ID: 0e88a6e5-4efc-4317-8902-bc9629d83d1b)');
  
  const payload2 = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['0e88a6e5-4efc-4317-8902-bc9629d83d1b'], // Second user from dashboard
    headings: { en: '🎯 FIXED TEST - Provider 2' },
    contents: { 
      en: `Notification fix test for Provider 2!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you receive this, the device mapping fix is working! 🎉`
    },
    data: {
      providerId: 2,
      testType: 'device-mapping-fix',
      timestamp: Date.now()
    },
    // Enhanced delivery settings
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
      body: JSON.stringify(payload2)
    });
    
    const result2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ Provider 2 notification sent successfully!');
      console.log(`   📊 Recipients: ${result2.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result2.id}`);
      if (result2.errors && result2.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result2.errors)}`);
      }
    } else {
      console.log('❌ Provider 2 notification failed:');
      console.log('   📋 Error:', result2);
    }
  } catch (error) {
    console.log('💥 Provider 2 test error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Try targeting by external user IDs (fallback test)
  console.log('📱 TEST 3: External User ID targeting (fallback test)');
  
  const payload3 = {
    app_id: ONESIGNAL_APP_ID,
    include_external_user_ids: [
      'provider-1759142062541-y7p5z', // First external user ID from dashboard
      'provider-1759141887918-7tqdv'  // Second external user ID from dashboard
    ],
    headings: { en: '🔗 EXTERNAL ID TEST' },
    contents: { 
      en: `External User ID targeting test!\n\nTime: ${new Date().toLocaleTimeString()}\n\nThis tests the fallback targeting method.`
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
    const response3 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(payload3)
    });
    
    const result3 = await response3.json();
    
    if (response3.ok) {
      console.log('✅ External ID notification sent successfully!');
      console.log(`   📊 Recipients: ${result3.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result3.id}`);
      if (result3.errors && result3.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(result3.errors)}`);
      }
    } else {
      console.log('❌ External ID notification failed:');
      console.log('   📋 Error:', result3);
    }
  } catch (error) {
    console.log('💥 External ID test error:', error.message);
  }
  
  console.log('');
  console.log('🎯 NOTIFICATION FIX TEST COMPLETE!');
  console.log('');
  console.log('💡 If any of the above tests show recipients > 0, the fix is working!');
  console.log('📱 Check your mobile devices for the test notifications.');
}

testNotificationFix();
