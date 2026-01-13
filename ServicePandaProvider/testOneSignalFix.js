/**
 * COMPREHENSIVE OneSignal Test Script
 * Tests all aspects of OneSignal integration
 */

console.log('🧪 === COMPREHENSIVE ONESIGNAL TEST ===');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

// Test 1: Check OneSignal App Status
async function testAppStatus() {
  console.log('1️⃣ Testing OneSignal App Status...');
  
  try {
    const response = await fetch(`https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`, {
      headers: {
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      }
    });

    if (response.ok) {
      const appData = await response.json();
      console.log('✅ App Status Check Successful:');
      console.log(`   📱 App Name: ${appData.name}`);
      console.log(`   👥 Total Players: ${appData.players}`);
      console.log(`   📨 Messageable Players: ${appData.messageable_players}`);
      console.log(`   🕐 Last Updated: ${appData.updated_at}`);
      
      if (appData.players === 0) {
        console.log('⚠️  WARNING: No players registered!');
        return false;
      }
      
      if (appData.messageable_players === 0) {
        console.log('⚠️  WARNING: No messageable players!');
        return false;
      }
      
      return true;
    } else {
      console.log('❌ App status check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ App status error:', error.message);
    return false;
  }
}

// Test 2: List All Players
async function testListPlayers() {
  console.log('\n2️⃣ Testing Player List...');
  
  try {
    const response = await fetch(`https://onesignal.com/api/v1/players?app_id=${ONESIGNAL_APP_ID}&limit=300`, {
      headers: {
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      }
    });

    if (response.ok) {
      const playersData = await response.json();
      const players = playersData.players || [];
      
      console.log(`✅ Found ${players.length} players:`);
      
      if (players.length === 0) {
        console.log('⚠️  No players found - device registration not working');
        return [];
      }
      
      players.forEach((player, index) => {
        console.log(`\n   👤 Player ${index + 1}:`);
        console.log(`      🆔 ID: ${player.id}`);
        console.log(`      ✅ Valid Subscriber: ${player.valid_subscriber}`);
        console.log(`      📱 Device Type: ${player.device_type} (1=Android, 0=iOS)`);
        console.log(`      🔔 Notification Types: ${player.notification_types}`);
        console.log(`      🕐 Last Active: ${player.last_active}`);
        console.log(`      📅 Created: ${player.created_at}`);
        console.log(`      🆔 External User ID: ${player.external_user_id || 'Not set'}`);
        
        if (!player.valid_subscriber) {
          console.log('      ⚠️  WARNING: Player is not a valid subscriber!');
        }
      });
      
      const validPlayers = players.filter(p => p.valid_subscriber);
      console.log(`\n   📊 Summary: ${validPlayers.length}/${players.length} valid subscribers`);
      
      return validPlayers;
    } else {
      console.log('❌ Player list failed:', response.status);
      return [];
    }
  } catch (error) {
    console.log('❌ Player list error:', error.message);
    return [];
  }
}

// Test 3: Send Test Notification to All Users
async function testBroadcastNotification() {
  console.log('\n3️⃣ Testing Broadcast Notification...');
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { en: '🧪 Broadcast Test' },
    contents: { 
      en: `Broadcast test notification!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you received this, OneSignal is working!`
    },
    included_segments: ['Subscribed Users'],
    data: {
      type: 'test',
      test_id: Date.now()
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
      console.log('✅ Broadcast notification sent!');
      console.log(`   📊 Recipients: ${result.recipients || 'Processing...'}`);
      console.log(`   🆔 Notification ID: ${result.id}`);
      
      if (result.recipients === 0) {
        console.log('   ⚠️  WARNING: No recipients - check device registration');
      }
      
      return result;
    } else {
      console.log('❌ Broadcast notification failed:');
      console.log('   📋 Error:', result);
      return null;
    }
  } catch (error) {
    console.log('❌ Broadcast notification error:', error.message);
    return null;
  }
}

// Test 4: Send Targeted Notification
async function testTargetedNotification(externalUserId = 'provider-1') {
  console.log(`\n4️⃣ Testing Targeted Notification to ${externalUserId}...`);
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    include_external_user_ids: [externalUserId],
    headings: { en: '🎯 Targeted Test' },
    contents: { 
      en: `Targeted test to ${externalUserId}!\n\nTime: ${new Date().toLocaleTimeString()}\n\nThis tests external user ID targeting.`
    },
    data: {
      type: 'targeted_test',
      target_user: externalUserId,
      test_id: Date.now()
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
      console.log('✅ Targeted notification sent!');
      console.log(`   📊 Recipients: ${result.recipients || 'Processing...'}`);
      console.log(`   🆔 Notification ID: ${result.id}`);
      
      if (result.recipients === 0) {
        console.log(`   ⚠️  WARNING: User ${externalUserId} not found or not subscribed`);
      }
      
      return result;
    } else {
      console.log('❌ Targeted notification failed:');
      console.log('   📋 Error:', result);
      
      if (result.errors && result.errors.includes("All included players are not subscribed")) {
        console.log(`   💡 SOLUTION: User ${externalUserId} needs to be properly registered`);
      }
      
      return null;
    }
  } catch (error) {
    console.log('❌ Targeted notification error:', error.message);
    return null;
  }
}

// Test 5: Manual Device Registration Test
async function testManualDeviceRegistration() {
  console.log('\n5️⃣ Testing Manual Device Registration...');
  
  const testExternalUserId = `provider-test-${Date.now()}`;
  const testPushToken = `test-token-${Date.now()}`;
  
  const registrationPayload = {
    app_id: ONESIGNAL_APP_ID,
    device_type: 1, // Android
    identifier: testPushToken,
    device_model: 'ServicePandaProvider-Test',
    device_os: '13.0',
    timezone_id: 'Asia/Karachi',
    language: 'en',
    sdk: '050213',
    notification_types: 1, // Subscribed
    external_user_id: testExternalUserId,
  };

  try {
    console.log(`   🔄 Registering test device with external ID: ${testExternalUserId}`);
    
    const response = await fetch('https://onesignal.com/api/v1/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Manual registration successful!');
      console.log(`   👤 Player ID: ${result.id}`);
      console.log(`   🆔 External User ID: ${testExternalUserId}`);
      
      // Now test sending notification to this test user
      console.log('   🧪 Testing notification to registered test user...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const testResult = await testTargetedNotification(testExternalUserId);
      
      if (testResult && testResult.recipients > 0) {
        console.log('   ✅ Test user registration and targeting WORKING!');
      } else {
        console.log('   ⚠️  Test user registered but targeting failed');
      }
      
      return result.id;
    } else {
      const error = await response.text();
      console.log('❌ Manual registration failed:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Manual registration error:', error.message);
    return null;
  }
}

// Main test function
async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive OneSignal Test...');
  console.log('');
  
  const results = {
    appStatus: false,
    playersFound: 0,
    validSubscribers: 0,
    broadcastSent: false,
    targetedSent: false,
    manualRegistration: false
  };
  
  // Test 1: App Status
  results.appStatus = await testAppStatus();
  
  // Test 2: List Players
  const validPlayers = await testListPlayers();
  results.playersFound = validPlayers.length;
  results.validSubscribers = validPlayers.filter(p => p.valid_subscriber).length;
  
  // Test 3: Broadcast Notification
  const broadcastResult = await testBroadcastNotification();
  results.broadcastSent = !!broadcastResult;
  
  // Test 4: Targeted Notification
  const targetedResult = await testTargetedNotification();
  results.targetedSent = !!targetedResult;
  
  // Test 5: Manual Registration
  const manualResult = await testManualDeviceRegistration();
  results.manualRegistration = !!manualResult;
  
  // Final Summary
  console.log('\n📊 === TEST SUMMARY ===');
  console.log(`✅ App Status: ${results.appStatus ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Players Found: ${results.playersFound} (${results.validSubscribers} valid)`);
  console.log(`✅ Broadcast Notification: ${results.broadcastSent ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Targeted Notification: ${results.targetedSent ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Manual Registration: ${results.manualRegistration ? 'PASS' : 'FAIL'}`);
  
  console.log('\n💡 === RECOMMENDATIONS ===');
  
  if (!results.appStatus) {
    console.log('❌ OneSignal app configuration issue - check App ID and API key');
  }
  
  if (results.playersFound === 0) {
    console.log('❌ No devices registered - app is not properly registering with OneSignal');
    console.log('   🔧 Solution: Use the fixed OneSignal service in your app');
  }
  
  if (results.validSubscribers === 0 && results.playersFound > 0) {
    console.log('❌ Devices registered but not valid subscribers');
    console.log('   🔧 Solution: Check notification permissions and push token validity');
  }
  
  if (!results.broadcastSent) {
    console.log('❌ Broadcast notifications not working');
    console.log('   🔧 Solution: Check API key permissions and app configuration');
  }
  
  if (!results.targetedSent) {
    console.log('❌ Targeted notifications not working');
    console.log('   🔧 Solution: Ensure external user IDs are set correctly during registration');
  }
  
  if (results.manualRegistration) {
    console.log('✅ Manual registration works - use this method in your app');
  }
  
  console.log('\n🎯 === NEXT STEPS ===');
  console.log('1. Replace oneSignalService.ts with fixedOneSignalService.ts');
  console.log('2. Test the app on a real device (not emulator)');
  console.log('3. Check OneSignal dashboard for new registrations');
  console.log('4. Test notifications from both dashboard and API');
  
  console.log('\n🏁 Test completed!');
}

// Run the comprehensive test
runComprehensiveTest().catch(error => {
  console.error('💥 Test failed:', error);
});
