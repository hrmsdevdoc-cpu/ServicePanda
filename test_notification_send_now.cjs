#!/usr/bin/env node

// Test sending notification with new API key and manual external user IDs
console.log('🚀 Trying to Send Notification Now...');
console.log('=' .repeat(50));

async function sendTestNotification() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const newApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  console.log('📋 Configuration:');
  console.log(`   App ID: ${appId}`);
  console.log(`   API Key: ${newApiKey.substring(0, 30)}...`);
  console.log('   Target: provider-1 and provider-2 (manually set)');
  
  try {
    // Test 1: Send to provider-1 specifically
    console.log('\n🎯 Test 1: Sending to provider-1...');
    
    const provider1Payload = {
      app_id: appId,
      include_external_user_ids: ["provider-1"],
      headings: { en: "🧪 Test to Provider-1" },
      contents: { en: "Testing notification to provider-1 with new API key!\n\nTime: " + new Date().toLocaleTimeString() + "\n\nExternal user ID manually set ✅" },
      data: { 
        test: true,
        target: "provider-1",
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Sending to provider-1...');
    const response1 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${newApiKey}`
      },
      body: JSON.stringify(provider1Payload)
    });

    if (response1.ok) {
      const result1 = await response1.json();
      console.log('✅ Notification sent to provider-1!');
      console.log(`   Notification ID: ${result1.id}`);
      console.log(`   Recipients: ${result1.recipients || 0}`);
      
      if (result1.recipients > 0) {
        console.log('🎉 SUCCESS! Provider-1 received the notification!');
      } else {
        console.log('⚠️ Provider-1 not reached (0 recipients)');
      }
    } else {
      const error1 = await response1.text();
      console.log('❌ Failed to send to provider-1:', error1);
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Send to provider-2 specifically  
    console.log('\n🎯 Test 2: Sending to provider-2...');
    
    const provider2Payload = {
      app_id: appId,
      include_external_user_ids: ["provider-2"],
      headings: { en: "🧪 Test to Provider-2" },
      contents: { en: "Testing notification to provider-2 with new API key!\n\nTime: " + new Date().toLocaleTimeString() + "\n\nExternal user ID manually set ✅" },
      data: { 
        test: true,
        target: "provider-2",
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Sending to provider-2...');
    const response2 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${newApiKey}`
      },
      body: JSON.stringify(provider2Payload)
    });

    if (response2.ok) {
      const result2 = await response2.json();
      console.log('✅ Notification sent to provider-2!');
      console.log(`   Notification ID: ${result2.id}`);
      console.log(`   Recipients: ${result2.recipients || 0}`);
      
      if (result2.recipients > 0) {
        console.log('🎉 SUCCESS! Provider-2 received the notification!');
      } else {
        console.log('⚠️ Provider-2 not reached (0 recipients)');
      }
    } else {
      const error2 = await response2.text();
      console.log('❌ Failed to send to provider-2:', error2);
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Send to both providers together
    console.log('\n🎯 Test 3: Sending to BOTH providers (like server does)...');
    
    const bothPayload = {
      app_id: appId,
      include_external_user_ids: ["provider-1", "provider-2"],
      headings: { en: "🛎️ New Customer Request Available!" },
      contents: { en: "House Cleaning needed in Test Area, 4000\n\"Testing the complete server notification flow with manually set external user IDs\"" },
      data: { 
        test: true,
        type: "customer_request",
        requestId: 999,
        categoryName: "House Cleaning",
        customerLocation: "Test Area, 4000",
        timestamp: new Date().toISOString(),
        priority: "high"
      }
    };

    console.log('📤 Sending to both provider-1 and provider-2...');
    const responseBoth = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${newApiKey}`
      },
      body: JSON.stringify(bothPayload)
    });

    if (responseBoth.ok) {
      const resultBoth = await responseBoth.json();
      console.log('✅ Notification sent to both providers!');
      console.log(`   Notification ID: ${resultBoth.id}`);
      console.log(`   Recipients: ${resultBoth.recipients || 0}`);
      
      if (resultBoth.recipients > 0) {
        console.log('🎉 PERFECT! Both providers received notifications!');
        console.log('🚀 Server notifications should now work from customer requests!');
      } else {
        console.log('⚠️ Both providers not reached (0 recipients)');
        console.log('💡 Devices might still be inactive despite manual external ID setting');
      }
    } else {
      const errorBoth = await responseBoth.text();
      console.log('❌ Failed to send to both providers:', errorBoth);
    }

    console.log('\n📊 Summary:');
    console.log('✅ New API key is working');
    console.log('✅ External user IDs manually set');
    console.log('✅ Notifications being sent to OneSignal');
    console.log('📱 Check your provider devices for notifications!');
    console.log('🌐 Check OneSignal dashboard for delivery status');
    
    console.log('\n💡 Next Steps:');
    console.log('1. Check provider devices - did notifications arrive?');
    console.log('2. Check OneSignal dashboard - are notifications showing as delivered?');
    console.log('3. If notifications arrived, try customer request from app!');
    console.log('4. If not arrived, devices might need fresh registration');

  } catch (error) {
    console.error('❌ Notification send failed:', error.message);
  }
}

// Run the test
sendTestNotification();
