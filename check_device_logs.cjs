/**
 * Check Device and OneSignal Integration
 * Debug why device is not appearing in OneSignal dashboard
 */

console.log('🔍 Debugging OneSignal Device Registration...');
console.log('');

console.log('📱 DEVICE REGISTRATION CHECKLIST:');
console.log('');

console.log('1. ✅ OneSignal SDK Installation:');
console.log('   → npm install react-native-onesignal ✓');
console.log('   → SDK imported in service ✓');
console.log('');

console.log('2. 📋 CHECK THESE IN YOUR APP LOGS:');
console.log('   → "🔔 Initializing REAL OneSignal SDK..."');
console.log('   → "📱 Requesting notification permissions..."');
console.log('   → "🔔 Permission status: true"');
console.log('   → "✅ OneSignal App ID set"');
console.log('   → "👤 External User ID set: 1"');
console.log('   → "🎉 SUCCESS: Device registered with OneSignal!"');
console.log('   → "🔑 Player ID: [some-id]"');
console.log('');

console.log('3. 🔧 CORRECT BUILD COMMANDS:');
console.log('   → cd ServicePandaProvider');
console.log('   → npx react-native run-android    (for emulator)');
console.log('   → adb devices    (check connected devices)');
console.log('   → npx react-native run-android    (auto-detects device)');
console.log('');

console.log('4. 📱 CHECK ON DEVICE:');
console.log('   → App should ask for notification permission');
console.log('   → Allow notifications when prompted');
console.log('   → Check app logs in React Native debugger');
console.log('');

console.log('5. 🚨 COMMON ISSUES & FIXES:');
console.log('   → Notification permission denied → Re-install app');
console.log('   → Google Play Services missing → Update device');
console.log('   → Internet connection required → Check WiFi');
console.log('   → OneSignal SDK not linked → Rebuild app');
console.log('');

async function testOneSignalDirectly() {
  console.log('🧪 Testing OneSignal API to confirm server works...');
  
  try {
    const payload = {
      app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
      headings: { en: '🔧 Device Registration Test' },
      contents: { 
        en: \`Testing device registration...\n\nIf you see this, server is working!\n\nNow we need device to register with OneSignal.\n\nTime: \${new Date().toLocaleTimeString()}\`
      },
      included_segments: ['Subscribed Users']
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ OneSignal API working - server side OK');
      console.log('📊 Notification sent, but no users to receive it');
      console.log('💡 Focus on device registration now');
    } else {
      console.log('❌ OneSignal API issue:', result);
    }
  } catch (error) {
    console.log('💥 API Error:', error.message);
  }
}

function provideNextSteps() {
  console.log('');
  console.log('🎯 IMMEDIATE NEXT STEPS:');
  console.log('');
  console.log('STEP 1: Build app correctly');
  console.log('   cd ServicePandaProvider');
  console.log('   npx react-native run-android');
  console.log('');
  console.log('STEP 2: Watch app logs carefully');
  console.log('   → Look for OneSignal initialization messages');
  console.log('   → Check if permission prompt appears');
  console.log('   → Note any error messages');
  console.log('');
  console.log('STEP 3: Check device settings');
  console.log('   → Go to device Settings → Apps → Your App → Notifications');
  console.log('   → Ensure notifications are enabled');
  console.log('');
  console.log('STEP 4: Manual registration test');
  console.log('   → If automatic fails, manually add test user in OneSignal dashboard');
  console.log('   → Audience → All Users → Add User');
  console.log('');
  console.log('💡 MOST LIKELY ISSUE: Notification permission not granted on device');
}

// Run checks
async function runDeviceCheck() {
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('');
  
  await testOneSignalDirectly();
  provideNextSteps();
  
  console.log('');
  console.log('📞 Bhai, ye steps follow karo aur batao kya hota hai!');
  console.log('🔍 App logs check karna sabse important hai!');
}

runDeviceCheck();
