#!/usr/bin/env node

// Debug script to check why notifications aren't working from customer requests
// This will check the complete flow step by step

console.log('🔍 Debugging Customer Request → OneSignal Notification Flow');
console.log('=' .repeat(60));

// Check 1: Verify server is running and endpoints are working
async function checkServerHealth() {
  console.log('\n📡 Step 1: Checking server health...');
  
  try {
    // Simple built-in fetch for Node.js 18+
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Server is running');
      return true;
    } else {
      console.log('❌ Server health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('💡 Make sure to start the server with: npm run dev');
    return false;
  }
}

// Check 2: Verify OneSignal configuration
async function checkOneSignalConfig() {
  console.log('\n🔔 Step 2: Checking OneSignal configuration...');
  
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky";
  
  console.log(`📱 App ID: ${appId}`);
  console.log(`🔑 API Key: ${restApiKey.substring(0, 20)}...`);
  
  // Test OneSignal API directly
  try {
    const testPayload = {
      app_id: appId,
      included_segments: ["Subscribed Users"],
      headings: { en: "Test Notification" },
      contents: { en: "Testing OneSignal API connection" },
      data: { test: true }
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ OneSignal API is working');
      console.log(`📊 Recipients: ${result.recipients || 0}`);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ OneSignal API failed:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ OneSignal API connection failed:', error.message);
    return false;
  }
}

// Check 3: Look for recent service requests and their notification status
async function checkRecentRequests() {
  console.log('\n📋 Step 3: Checking recent service requests...');
  console.log('💡 This requires database access - check server logs instead');
  console.log('🔍 Look for these log messages in your server console:');
  console.log('   - "Starting automatic lead distribution for request X"');
  console.log('   - "🛎️ Notifying X providers of new customer request"');
  console.log('   - "📤 Sending OneSignal push notification to provider X"');
  console.log('   - "✅ OneSignal notification sent"');
}

// Main debug function
async function debugNotificationFlow() {
  const serverOk = await checkServerHealth();
  if (!serverOk) return;
  
  const oneSignalOk = await checkOneSignalConfig();
  await checkRecentRequests();
  
  console.log('\n📊 Debug Summary:');
  console.log(`   Server Health: ${serverOk ? '✅' : '❌'}`);
  console.log(`   OneSignal API: ${oneSignalOk ? '✅' : '❌'}`);
  
  if (serverOk && oneSignalOk) {
    console.log('\n✅ Basic setup looks good!');
    console.log('\n🔧 Next steps to debug:');
    console.log('   1. Create a service request from customer app');
    console.log('   2. Watch server console logs carefully');
    console.log('   3. Check OneSignal dashboard for new notifications');
    console.log('   4. Verify providers are registered with correct external user IDs');
  } else {
    console.log('\n❌ Found issues that need to be fixed first');
  }
  
  console.log('\n🌐 OneSignal Dashboard: https://dashboard.onesignal.com/apps/a3f5070d-9c46-44cd-8b0a-259df155ae94/push');
}

// Run the debug
debugNotificationFlow().catch(console.error);
