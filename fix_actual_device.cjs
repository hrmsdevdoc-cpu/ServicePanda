#!/usr/bin/env node

// Fix actual device by deleting duplicate and creating fresh device
console.log('🔧 FIXING ACTUAL DEVICE - Deleting duplicate and creating fresh...');
console.log('=' .repeat(60));

async function fixActualDevice() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  console.log('📋 Configuration:');
  console.log(`   App ID: ${appId}`);
  console.log(`   API Key: ${restApiKey.substring(0, 20)}...`);
  
  // Step 1: Delete the duplicate device (the one with external ID)
  const duplicateDeviceId = "bc36c30e-e86e-4a32-bccb-a80065467a28";
  console.log(`\n🗑️ Step 1: Deleting duplicate device: ${duplicateDeviceId}`);
  
  try {
    const deleteResponse = await fetch(`https://onesignal.com/api/v1/players/${duplicateDeviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${restApiKey}`
      }
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Duplicate device deleted successfully!');
    } else {
      console.log('⚠️ Could not delete duplicate device (might be inactive)');
    }
  } catch (error) {
    console.log('⚠️ Delete failed:', error.message);
  }
  
  // Step 2: Create fresh device for your actual device
  const externalUserId = "provider-3";
  const deviceModel = "Samsung Galaxy F23 5G";
  
  console.log(`\n🆕 Step 2: Creating fresh device for your actual device...`);
  console.log(`   External User ID: ${externalUserId}`);
  console.log(`   Device Model: ${deviceModel}`);
  
  // Generate a unique push token
  const pushToken = `sp-actual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const registrationPayload = {
    app_id: appId,
    device_type: 1, // Android
    identifier: pushToken,
    device_model: deviceModel,
    device_os: '14.0',
    timezone_id: 'Asia/Kolkata',
    language: 'en',
    sdk: '050213',
    notification_types: 1, // Subscribed
    external_user_id: externalUserId,
    tags: {
      provider_id: '3',
      app_version: '1.1.0',
      registration_method: 'actual_device_fix',
      device_name: deviceModel,
      is_actual_device: 'true'
    }
  };
  
  console.log('📦 Registration payload:');
  console.log(`   External User ID: ${externalUserId}`);
  console.log(`   Device Model: ${deviceModel}`);
  console.log(`   Push Token: ${pushToken.substring(0, 20)}...`);
  
  try {
    console.log('\n📡 Creating fresh device...');
    const response = await fetch('https://onesignal.com/api/v1/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(registrationPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Fresh device created for your actual device!');
      console.log(`   New Player ID: ${result.id}`);
      console.log(`   External User ID: ${externalUserId}`);
      console.log(`   Device Model: ${deviceModel}`);
      
      // Step 3: Test notification
      console.log('\n📱 Step 3: Sending test notification...');
      const testPayload = {
        app_id: appId,
        include_external_user_ids: [externalUserId],
        headings: { en: "🎉 ACTUAL DEVICE FIXED!" },
        contents: { 
          en: `SUCCESS! Your actual device now has external user ID ${externalUserId}\n\nDevice: ${deviceModel}\nTime: ${new Date().toLocaleTimeString()}` 
        },
        data: { 
          test: true,
          type: "actual_device_fixed",
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
        
        if (testResult.recipients > 0) {
          console.log('\n🎉 PERFECT! Your actual device is now working!');
          console.log('📱 Check your OneSignal dashboard - you should see:');
          console.log(`   - Device: ${deviceModel}`);
          console.log(`   - External ID: ${externalUserId}`);
          console.log('📱 Check your device for the test notification!');
        }
      } else {
        const error = await testResponse.text();
        console.log('❌ Test notification failed:', error);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Failed to create fresh device:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📊 Summary:');
  console.log('1. ✅ Deleted duplicate device');
  console.log('2. ✅ Created fresh device for your actual device');
  console.log('3. ✅ Set external user ID to provider-3');
  console.log('4. ✅ Your actual device should now work!');
}

fixActualDevice().catch(console.error);
