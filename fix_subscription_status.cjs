/**
 * Fix OneSignal Subscription Status
 * Force all registered devices to be subscribed
 */

console.log('🔧 Fixing OneSignal Subscription Status...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function fixSubscriptionStatus() {
  console.log('🎯 FORCING DEVICE SUBSCRIPTION STATUS');
  console.log('');
  
  // List of your known OneSignal Player IDs that need to be subscribed
  const playerIds = [
    'bf78a978-b759-48b9-a4b2-94d4b7647d02', // Latest working device (provider-1)
    '0a21c9be-2a45-40bf-b9a3-b2b70d78da27', // Other device
    '0e88a6e5-4efc-4317-8902-bc9629d83d1b', // Other device
    '3e08404b-8fd6-4b71-af49-f6f207b79243', // Other device
    '3bb2d266-4fbe-459a-8216-739b28db0a91'  // Other device
  ];
  
  console.log(`📱 Found ${playerIds.length} devices to fix subscription status`);
  console.log('');
  
  for (let i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    console.log(`🔧 Device ${i + 1}/${playerIds.length}: ${playerId}`);
    
    try {
      // Update player to be subscribed
      const updatePayload = {
        app_id: ONESIGNAL_APP_ID, // Required app_id parameter
        notification_types: 1, // 1 = subscribed, -2 = unsubscribed
        test_type: null, // Remove test flag if present
      };
      
      const response = await fetch(`https://onesignal.com/api/v1/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Successfully subscribed device ${i + 1}`);
      } else {
        const error = await response.json();
        console.log(`   ❌ Failed to subscribe device ${i + 1}:`, error);
      }
      
    } catch (error) {
      console.log(`   💥 Error updating device ${i + 1}:`, error.message);
    }
    
    // Wait between requests to avoid rate limiting
    if (i < playerIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('');
  console.log('🧪 Testing notifications after subscription fix...');
  console.log('');
  
  // Wait a moment for changes to take effect
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test notification to the main device
  const testPayload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['bf78a978-b759-48b9-a4b2-94d4b7647d02'],
    headings: { en: '🎉 SUBSCRIPTION FIXED!' },
    contents: { 
      en: `Subscription status has been fixed!\n\nTime: ${new Date().toLocaleTimeString()}\n\nIf you receive this, notifications are now working! 🎉🎉🎉`
    },
    data: {
      testType: 'subscription-fix-test',
      timestamp: Date.now()
    },
    priority: 10,
    android_sound: "default",
    content_available: true
  };
  
  try {
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
      console.log('🎉 SUBSCRIPTION FIX TEST SENT!');
      console.log(`   📊 Recipients: ${testResult.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${testResult.id}`);
      
      if (testResult.recipients > 0) {
        console.log('');
        console.log('🎉🎉🎉 SUCCESS! NOTIFICATIONS ARE NOW WORKING! 🎉🎉🎉');
        console.log('📱 Check your mobile device for the test notification!');
      } else {
        console.log('');
        console.log('⚠️ Still no recipients. May need manual device subscription.');
      }
      
      if (testResult.errors && testResult.errors.length > 0) {
        console.log(`   ⚠️ Errors: ${JSON.stringify(testResult.errors)}`);
      }
    } else {
      console.log('❌ Test notification failed:', testResult);
    }
  } catch (error) {
    console.log('💥 Test error:', error.message);
  }
  
  console.log('');
  console.log('🎯 SUBSCRIPTION FIX COMPLETE!');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Check your mobile device for the test notification');
  console.log('   2. If it works, test your server notifications');
  console.log('   3. If not, manually enable notifications in device settings');
}

fixSubscriptionStatus();
