#!/usr/bin/env node

// Set external user IDs for existing OneSignal devices
console.log('🔧 Setting External User IDs for OneSignal Devices...');
console.log('=' .repeat(60));

async function setExternalUserIDs() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  // Device IDs from your OneSignal dashboard
  const devices = [
    {
      id: "0cdbc9df-2c70-4caf-9410-fc9684a4e3cd",
      externalUserId: "provider-1"
    },
    {
      id: "91779456-5f0a-435c-a406-d3d3a9ce8875", 
      externalUserId: "provider-2"
    }
  ];
  
  console.log('📋 Configuration:');
  console.log(`   App ID: ${appId}`);
  console.log(`   API Key: ${restApiKey.substring(0, 20)}...`);
  console.log(`   Devices to update: ${devices.length}`);
  
  for (const device of devices) {
    try {
      console.log(`\n🔧 Setting external user ID for device:`);
      console.log(`   Device ID: ${device.id}`);
      console.log(`   External User ID: ${device.externalUserId}`);
      
      const updatePayload = {
        app_id: appId,
        external_user_id: device.externalUserId
      };
      
      console.log('📤 Sending update request...');
      const response = await fetch(`https://onesignal.com/api/v1/players/${device.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${restApiKey}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ External user ID set successfully!');
        console.log(`   Updated device: ${result.id || device.id}`);
      } else {
        const error = await response.text();
        console.log('❌ Failed to set external user ID:', error);
        
        // If device not found, it might be inactive - let's try to reactivate
        if (error.includes('No user with this id found')) {
          console.log('💡 Device might be inactive, trying alternative approach...');
          
          // Try to get device info first
          const getResponse = await fetch(`https://onesignal.com/api/v1/players/${device.id}?app_id=${appId}`, {
            headers: {
              'Authorization': `Basic ${restApiKey}`
            }
          });
          
          if (getResponse.ok) {
            const deviceInfo = await getResponse.json();
            console.log('📱 Device info:', {
              id: deviceInfo.id,
              device_type: deviceInfo.device_type,
              active: deviceInfo.session_count > 0 ? 'Active' : 'Inactive',
              last_session: deviceInfo.last_session
            });
          } else {
            console.log('❌ Could not get device info');
          }
        }
      }
      
    } catch (error) {
      console.log(`❌ Error updating device ${device.id}:`, error.message);
    }
  }
  
  // Test targeting after setting external user IDs
  console.log('\n🎯 Testing external user ID targeting...');
  
  const testPayload = {
    app_id: appId,
    include_external_user_ids: ["provider-1", "provider-2"],
    headings: { en: "🎯 External ID Test - FIXED!" },
    contents: { en: "Testing external user ID targeting after setting IDs - " + new Date().toLocaleTimeString() + "\n\nThis should now work!" },
    data: { 
      test: true,
      type: "external_id_fixed_test",
      timestamp: new Date().toISOString()
    }
  };

  console.log('📤 Sending test notification to provider-1 and provider-2...');
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
      console.log('🎉 SUCCESS! External user ID targeting now works!');
      console.log('📱 Check your provider devices for the notification!');
      console.log('🚀 Server notifications from customer requests should now work!');
    } else {
      console.log('⚠️ Still 0 recipients - devices might need to be reactivated');
    }
  } else {
    const error = await testResponse.text();
    console.log('❌ Test notification failed:', error);
  }
  
  console.log('\n📊 Next Steps:');
  console.log('1. Check OneSignal dashboard - External ID column should now show provider-1, provider-2');
  console.log('2. Check your provider devices for test notification');
  console.log('3. If test notification worked, try customer request → server notifications');
  console.log('4. If still not working, provider devices might need fresh registration');
}

setExternalUserIDs().catch(console.error);
