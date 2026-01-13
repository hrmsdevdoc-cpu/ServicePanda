#!/usr/bin/env node

// Test if the OneSignal fix is actually loaded in the running server
console.log('🔍 Testing if OneSignal fix is actually applied...');

async function testIfFixApplied() {
  try {
    // Check server timestamp to see when it was last restarted
    console.log('📡 Checking server status...');
    const response = await fetch('http://localhost:3000/api/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Server is running');
      console.log(`🕐 Server timestamp: ${data.timestamp}`);
      
      const serverTime = new Date(data.timestamp);
      const now = new Date();
      const minutesAgo = Math.floor((now - serverTime) / (1000 * 60));
      
      console.log(`⏰ Server was last restarted: ${minutesAgo} minutes ago`);
      
      if (minutesAgo > 10) {
        console.log('⚠️ WARNING: Server was started more than 10 minutes ago');
        console.log('💡 The OneSignal fix might not be applied yet');
        console.log('🔄 SOLUTION: Restart the server to apply the fix');
        console.log('   1. Stop server (Ctrl+C)');
        console.log('   2. Run: npm run dev');
      } else {
        console.log('✅ Server was recently restarted - fix should be applied');
      }
      
    } else {
      console.log('❌ Server health check failed');
    }
    
    // Test the actual OneSignal API call with new key
    console.log('\n🔔 Testing OneSignal API with new key...');
    const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
    const newApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
    
    const testPayload = {
      app_id: appId,
      included_segments: ["Subscribed Users"],
      headings: { en: "🧪 Fix Test" },
      contents: { en: "Testing if server fix is applied - " + new Date().toLocaleTimeString() },
      data: { test: true }
    };

    const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${newApiKey}`
      },
      body: JSON.stringify(testPayload)
    });

    if (oneSignalResponse.ok) {
      const result = await oneSignalResponse.json();
      console.log('✅ New OneSignal API key works!');
      console.log(`📊 Recipients: ${result.recipients || 0}`);
      
      if (result.recipients > 0) {
        console.log('🎉 Great! New API key is working and has recipients!');
      } else {
        console.log('⚠️ API key works but no active recipients found');
      }
    } else {
      const error = await oneSignalResponse.text();
      console.log('❌ New OneSignal API key failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testIfFixApplied();
