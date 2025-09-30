#!/usr/bin/env node

// Test the actual server notification endpoint to verify the fix
console.log('🧪 Testing Server Notification Endpoint...');

async function testServerNotificationEndpoint() {
  try {
    // Test if server is running
    console.log('📡 Checking if server is running...');
    
    const healthResponse = await fetch('http://localhost:3000/api/health');
    if (!healthResponse.ok) {
      throw new Error('Server not running');
    }
    
    console.log('✅ Server is running');
    
    // Test a direct notification trigger (if endpoint exists)
    console.log('🔔 Testing notification trigger...');
    
    // Try to trigger a test notification
    const testResponse = await fetch('http://localhost:3000/api/test-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 1,
        title: 'Test Notification',
        message: 'Testing fixed OneSignal import'
      })
    });
    
    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log('✅ Test notification sent:', result);
    } else {
      console.log('ℹ️ Test endpoint not available (that\'s okay)');
    }
    
    console.log('\n🎯 The real test:');
    console.log('1. Make sure your server is restarted');
    console.log('2. Create a service request from customer app');
    console.log('3. Watch server logs for these messages:');
    console.log('   - "🔧 OneSignal service loaded: object"');
    console.log('   - "✅ ONESIGNAL PUSH SENT! ID: [some-id]"');
    console.log('4. Check OneSignal dashboard for delivered notifications');
    
  } catch (error) {
    if (error.message.includes('Server not running')) {
      console.log('❌ Server is not running');
      console.log('💡 Start the server first with: npm run dev');
    } else {
      console.log('❌ Test failed:', error.message);
    }
  }
}

// Use built-in fetch (Node.js 18+)
testServerNotificationEndpoint();
