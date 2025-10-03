#!/usr/bin/env node

// Find and fix your actual device
console.log('🔍 FINDING AND FIXING YOUR ACTUAL DEVICE...');
console.log('=' .repeat(60));

async function findAndFixDevice() {
  const appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94";
  const restApiKey = "os_v2_app_up2qodm4izcm3cykewo7cvnosrsd36rvce4eflmycu4fn43i6oojl4ogz4actqkqx3z5vnrrflsxoluzqxjdod7qhzxgrsfj7ec7h6a";
  
  console.log('📋 Searching for your device...');
  
  // Get all devices from OneSignal
  try {
    const response = await fetch(`https://onesignal.com/api/v1/players?app_id=${appId}&limit=50`, {
      headers: {
        'Authorization': `Basic ${restApiKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const players = data.players || [];
      
      console.log(`📱 Found ${players.length} devices`);
      
      // Find your device (Samsung Galaxy F23 5G)
      const yourDevice = players.find(player => 
        player.device_model && 
        player.device_model.includes('Samsung Galaxy F23 5G') &&
        (!player.external_user_id || player.external_user_id === '')
      );
      
      if (yourDevice) {
        console.log('🎯 FOUND YOUR DEVICE!');
        console.log(`   Device ID: ${yourDevice.id}`);
        console.log(`   Device Model: ${yourDevice.device_model}`);
        console.log(`   Current External ID: ${yourDevice.external_user_id || 'None'}`);
        console.log(`   Last Session: ${yourDevice.last_session}`);
        
        // Fix the device
        console.log('\n🔧 Fixing your device...');
        
        const updatePayload = {
          app_id: appId,
          external_user_id: 'provider-3',
          tags: {
            provider_id: '3',
            app_version: '1.1.0',
            fixed_at: new Date().toISOString()
          }
        };
        
        const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${yourDevice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${restApiKey}`
          },
          body: JSON.stringify(updatePayload)
        });
        
        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          console.log('🎉 SUCCESS! Your device fixed!');
          console.log(`   External User ID: ${updateResult.external_user_id}`);
          console.log(`   Device Model: ${updateResult.device_model}`);
          
          // Test notification
          console.log('\n📱 Sending test notification...');
          const testPayload = {
            app_id: appId,
            include_external_user_ids: ['provider-3'],
            headings: { en: "🎉 YOUR DEVICE FIXED!" },
            contents: { 
              en: `SUCCESS! External user ID provider-3 is now working!\n\nDevice: ${yourDevice.device_model}\nTime: ${new Date().toLocaleTimeString()}` 
            },
            data: { 
              test: true,
              type: "device_fixed",
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
          const error = await updateResponse.text();
          console.log('❌ Failed to fix device:', error);
        }
        
      } else {
        console.log('❌ Could not find your device (Samsung Galaxy F23 5G)');
        console.log('\n📱 Available devices:');
        players.forEach((player, index) => {
          console.log(`   ${index + 1}. ID: ${player.id}`);
          console.log(`      Model: ${player.device_model || 'Unknown'}`);
          console.log(`      External ID: ${player.external_user_id || 'None'}`);
          console.log(`      Last Session: ${player.last_session}`);
          console.log('');
        });
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Failed to get devices:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📊 Next Steps:');
  console.log('1. Check OneSignal dashboard - External ID should now show provider-3');
  console.log('2. Check your device for test notification');
  console.log('3. If working, server notifications will now work!');
}

findAndFixDevice().catch(console.error);
