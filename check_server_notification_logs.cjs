#!/usr/bin/env node

// Check if server notification code is being executed
console.log('🔍 Checking Server Notification Code Execution...');
console.log('=' .repeat(50));

async function checkServerNotificationExecution() {
  console.log('📋 Instructions for debugging:');
  console.log('');
  console.log('1️⃣ Watch your SERVER CONSOLE carefully');
  console.log('2️⃣ Make a customer request from your customer app');
  console.log('3️⃣ Look for these specific messages:');
  console.log('');
  console.log('✅ EXPECTED MESSAGES in server console:');
  console.log('   "Starting automatic lead distribution for request [ID]"');
  console.log('   "Finding eligible providers for category X, postcode XXXX"');
  console.log('   "Found X providers via postcode coverage"');
  console.log('   "🛎️ Notifying X providers of new customer request #[ID]"');
  console.log('   "🔔 Sending REAL notification to provider X: New Customer Request Available!"');
  console.log('   "🚀 SENDING REAL ONESIGNAL PUSH NOTIFICATION to provider X"');
  console.log('   "🔧 OneSignal service loaded: object"');
  console.log('   "✅ ONESIGNAL PUSH SENT! ID: [notification-id]"');
  console.log('');
  console.log('❌ PROBLEM INDICATORS:');
  console.log('   - No messages at all → Request not reaching server');
  console.log('   - No "Starting automatic lead distribution" → Lead distribution not triggered');
  console.log('   - No "Finding eligible providers" → No providers in postcode area');
  console.log('   - No "Notifying X providers" → No eligible providers found');
  console.log('   - "Cannot read properties of undefined" → Server OneSignal import still broken');
  console.log('');
  
  // Test current server notification manually
  console.log('🧪 Testing server notification code directly...');
  
  try {
    // Try to import and test the server notification service
    console.log('📤 Attempting to test server OneSignal directly...');
    
    const testPayload = {
      app_id: "a3f5070d-9c46-44cd-8b0a-259df155ae94",
      include_external_user_ids: ["provider-1"],
      headings: { en: "🧪 Server Test" },
      contents: { en: "Testing server OneSignal service directly - " + new Date().toLocaleTimeString() },
      data: { test: true, source: "server_test" }
    };

    console.log('🔧 Using same API key as server...');
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a'
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Server API key works from external test');
      console.log(`   Notification ID: ${result.id}`);
      console.log(`   Recipients: ${result.recipients || 0}`);
      
      if (result.recipients > 0) {
        console.log('🎉 Provider devices can receive notifications!');
      } else {
        console.log('⚠️ Provider devices not receiving (but API works)');
      }
    } else {
      const error = await response.text();
      console.log('❌ Server API key test failed:', error);
    }

  } catch (error) {
    console.log('❌ Direct server test failed:', error.message);
  }

  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('1. Make customer request from app');
  console.log('2. Watch server console output');
  console.log('3. Tell me which messages you see (or don\'t see)');
  console.log('4. Based on that, we\'ll know exactly where the problem is');
  console.log('');
  console.log('📍 Possible issues:');
  console.log('   A) Customer request not reaching server at all');
  console.log('   B) Lead distribution not being triggered');
  console.log('   C) No eligible providers found for the request');
  console.log('   D) Notification service not being called');
  console.log('   E) OneSignal import still broken in server');
}

checkServerNotificationExecution();
