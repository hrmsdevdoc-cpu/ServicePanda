#!/usr/bin/env node

// Simple fix - you need to provide the full device ID
console.log('🔧 SIMPLE FIX - Please provide full device ID...');
console.log('=' .repeat(60));

async function simpleFix() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  // You need to provide the FULL device ID from your OneSignal dashboard
  // The one you showed is incomplete: 4af08a5b-d6ac-49e3-b781-46152ca3...
  // We need the complete UUID
  
  console.log('📋 Instructions:');
  console.log('1. Go to your OneSignal dashboard');
  console.log('2. Click on your device (Samsung Galaxy F23 5G)');
  console.log('3. Copy the COMPLETE OneSignal ID from the profile page');
  console.log('4. Replace the deviceId below with the complete ID');
  console.log('');
  
  // Your complete device ID
  const deviceId = "4af08a5b-d6ac-49e3-b781-46152ca35eec";
  const externalUserId = "provider-3";
  
  if (deviceId === "REPLACE_WITH_COMPLETE_DEVICE_ID") {
    console.log('❌ Please replace the deviceId with your complete OneSignal ID');
    console.log('   Example: 4af08a5b-d6ac-49e3-b781-46152ca3abcd');
    return;
  }
  
  console.log('📋 Target Device:');
  console.log(`   Device ID: ${deviceId}`);
  console.log(`   External User ID: ${externalUserId}`);
  
  // Update the device
  const updatePayload = {
    app_id: appId,
    external_user_id: externalUserId,
    tags: {
      provider_id: '3',
      app_version: '1.1.0',
      fixed_at: new Date().toISOString()
    }
  };
  
  try {
    console.log('\n🔄 Updating device...');
    const response = await fetch(`https://onesignal.com/api/v1/players/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(updatePayload)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('🎉 SUCCESS! Device updated successfully!');
      console.log(`   External User ID: ${result.external_user_id}`);
      console.log(`   Device Model: ${result.device_model}`);
      
      // Test notification
      console.log('\n📱 Sending test notification...');
      const testPayload = {
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: "🎉 EXTERNAL ID FIXED!" },
        contents: { 
          en: `SUCCESS! External user ID ${externalUserId} is now working!\n\nTime: ${new Date().toLocaleTimeString()}` 
        },
        data: { 
          test: true,
          type: "external_id_fixed",
          provider_id: "3"
        }
      };

      const testResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${restApiKey}`
        },
        body: JSON.stringify(testPayload)
      });

      if (testResponse.ok) {
        const testResult = await testResponse.json();
        console.log('✅ Test notification sent!');
        console.log(`   Notification ID: ${testResult.id}`);
        console.log(`   Recipients: ${testResult.recipients || 0}`);
        
        console.log('\n🎉 PERFECT! Your device is now working!');
        console.log('📱 Check your OneSignal dashboard - External ID should now show provider-3');
        console.log('📱 Check your device for the test notification!');
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Update failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

simpleFix().catch(console.error);
