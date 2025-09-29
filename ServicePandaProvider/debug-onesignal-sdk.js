// OneSignal SDK Debug Script
// Run this to check which OneSignal API methods are available

console.log('🔍 === ONESIGNAL SDK DEBUG ===');

try {
  // Try to import OneSignal
  const OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal imported successfully');
  console.log('📦 OneSignal object type:', typeof OneSignal);
  
  // Check available methods and properties
  console.log('📋 Available OneSignal methods/properties:');
  Object.keys(OneSignal).forEach(key => {
    console.log(`  - ${key}: ${typeof OneSignal[key]}`);
  });
  
  // Check v5 specific APIs
  console.log('🔍 Checking v5 APIs:');
  console.log('  - OneSignal.initialize:', typeof OneSignal.initialize);
  console.log('  - OneSignal.User:', typeof OneSignal.User);
  console.log('  - OneSignal.Notifications:', typeof OneSignal.Notifications);
  console.log('  - OneSignal.Debug:', typeof OneSignal.Debug);
  console.log('  - OneSignal.login:', typeof OneSignal.login);
  
  // Check v4 fallback APIs
  console.log('🔍 Checking v4 fallback APIs:');
  console.log('  - OneSignal.setAppId:', typeof OneSignal.setAppId);
  console.log('  - OneSignal.setExternalUserId:', typeof OneSignal.setExternalUserId);
  console.log('  - OneSignal.getDeviceState:', typeof OneSignal.getDeviceState);
  console.log('  - OneSignal.promptForPushNotificationsWithUserResponse:', typeof OneSignal.promptForPushNotificationsWithUserResponse);
  
  // Try to initialize (test)
  console.log('🧪 Testing initialization...');
  if (typeof OneSignal.initialize === 'function') {
    console.log('✅ OneSignal.initialize is available');
  } else {
    console.log('❌ OneSignal.initialize is not available');
  }
  
} catch (error) {
  console.error('❌ Error importing OneSignal:', error);
  console.log('💡 This suggests OneSignal is not properly linked');
  console.log('🔧 Try running: npx react-native run-android');
}

console.log('🔍 === END ONESIGNAL SDK DEBUG ===');
