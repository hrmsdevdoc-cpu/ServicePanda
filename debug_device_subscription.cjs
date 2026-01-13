/**
 * Debug Device Subscription Status
 * Check what's really happening with your OneSignal devices
 */

console.log('🔍 Debugging Device Subscription Status...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function debugDeviceSubscription() {
  console.log('🔍 STEP 1: Checking All Players in Your App');
  console.log('');
  
  try {
    // Get all players
    const playersResponse = await fetch(`https://onesignal.com/api/v1/players?app_id=${ONESIGNAL_APP_ID}&limit=20`, {
      headers: {
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      }
    });

    if (playersResponse.ok) {
      const playersData = await playersResponse.json();
      console.log(`📊 Total Players Found: ${playersData.players?.length || 0}`);
      console.log('');
      
      if (playersData.players && playersData.players.length > 0) {
        playersData.players.forEach((player, index) => {
          console.log(`👤 Player ${index + 1}:`);
          console.log(`   🆔 ID: ${player.id}`);
          console.log(`   📱 Device Type: ${player.device_type} (1=Android, 0=iOS)`);
          console.log(`   ✅ Valid Subscriber: ${player.valid_subscriber}`);
          console.log(`   🔔 Notification Types: ${player.notification_types} (1=subscribed, -2=unsubscribed)`);
          console.log(`   📱 Push Token Present: ${player.identifier ? 'YES' : 'NO'}`);
          console.log(`   👤 External User ID: ${player.external_user_id || 'Not set'}`);
          console.log(`   📅 Last Active: ${player.last_active}`);
          console.log(`   🌍 Country: ${player.country || 'Unknown'}`);
          console.log(`   📍 Timezone: ${player.timezone || 'Unknown'}`);
          console.log(`   🎯 Test Type: ${player.test_type || 'None'}`);
          console.log('');
          
          // Identify the issue
          if (!player.valid_subscriber) {
            console.log(`   ❌ ISSUE: Player ${index + 1} is NOT a valid subscriber!`);
          }
          if (player.notification_types !== 1) {
            console.log(`   ❌ ISSUE: Player ${index + 1} notification_types is ${player.notification_types} (should be 1)`);
          }
          if (!player.identifier) {
            console.log(`   ❌ ISSUE: Player ${index + 1} has NO push token!`);
          }
          if (player.test_type) {
            console.log(`   ⚠️ WARNING: Player ${index + 1} is marked as test device`);
          }
        });
        
        // Find the main device
        const mainDevice = playersData.players.find(p => p.id === 'bf78a978-b759-48b9-a4b2-94d4b7647d02');
        if (mainDevice) {
          console.log('🎯 FOUND YOUR MAIN DEVICE:');
          console.log(`   🆔 ID: ${mainDevice.id}`);
          console.log(`   ✅ Valid Subscriber: ${mainDevice.valid_subscriber}`);
          console.log(`   🔔 Notification Types: ${mainDevice.notification_types}`);
          console.log(`   📱 Has Push Token: ${mainDevice.identifier ? 'YES' : 'NO'}`);
          console.log('');
          
          // Try to fix the main device
          if (!mainDevice.valid_subscriber || mainDevice.notification_types !== 1) {
            console.log('🔧 ATTEMPTING TO FIX MAIN DEVICE...');
            
            const fixPayload = {
              notification_types: 1,
              valid_subscriber: true
            };
            
            const fixResponse = await fetch(`https://onesignal.com/api/v1/players/${mainDevice.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
              },
              body: JSON.stringify(fixPayload)
            });
            
            if (fixResponse.ok) {
              console.log('✅ Main device fix attempt successful!');
              
              // Test notification immediately
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              console.log('🧪 Testing notification to fixed device...');
              
              const testPayload = {
                app_id: ONESIGNAL_APP_ID,
                include_player_ids: [mainDevice.id],
                headings: { en: '🔧 DEVICE FIX TEST' },
                contents: { 
                  en: `Device subscription fix test!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you get this, the fix worked! 🎉`
                },
                data: {
                  testType: 'device-fix-test',
                  timestamp: Date.now()
                }
              };
              
              const testResponse = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
                },
                body: JSON.stringify(testPayload)
              });
              
              const testResult = await testResponse.json();
              
              if (testResponse.ok) {
                console.log('✅ Fix test notification sent!');
                console.log(`   📊 Recipients: ${testResult.recipients || 0}`);
                console.log(`   🆔 Notification ID: ${testResult.id}`);
                
                if (testResult.recipients > 0) {
                  console.log('');
                  console.log('🎉🎉🎉 SUCCESS! DEVICE FIX WORKED! 🎉🎉🎉');
                  console.log('📱 Check your mobile device for the test notification!');
                } else {
                  console.log('');
                  console.log('⚠️ Still no recipients. The issue may be deeper...');
                }
              }
              
            } else {
              const fixError = await fixResponse.json();
              console.log('❌ Failed to fix main device:', fixError);
            }
          }
        } else {
          console.log('❌ Main device not found in player list!');
        }
        
      } else {
        console.log('❌ No players found at all!');
      }
    } else {
      console.log('❌ Failed to fetch players');
    }
    
  } catch (error) {
    console.log('💥 Debug failed:', error.message);
  }
  
  console.log('');
  console.log('🎯 DEVICE SUBSCRIPTION DEBUG COMPLETE!');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. If fix worked: Your notifications should now work!');
  console.log('   2. If still failing: Rebuild app with proper permissions');
  console.log('   3. Manual check: Device Settings → Apps → ServicePandaProvider → Notifications');
}

debugDeviceSubscription();
