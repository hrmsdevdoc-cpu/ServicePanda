// Clear old OneSignal data and force fresh registration
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearAndFixOneSignal() {
  console.log('🧹 Clearing old OneSignal data and forcing fresh registration...\n');
  
  try {
    // Clear old player ID
    console.log('🗑️ Clearing old player ID...');
    await AsyncStorage.removeItem('oneSignalPlayerId');
    console.log('✅ Old player ID cleared');
    
    // Get provider ID
    const providerId = await AsyncStorage.getItem('providerId');
    if (!providerId) {
      console.log('❌ No provider ID found. Please login first.');
      return;
    }
    
    console.log('🆔 Provider ID:', providerId);
    
    // Import the fixed OneSignal service
    const { fixedOneSignalService } = require('./src/services/fixedOneSignalService');
    
    // Force create new device with external user ID
    console.log('🔄 Creating new device with external user ID...');
    const result = await fixedOneSignalService.forceUpdateExternalUserId(providerId);
    
    if (result.success) {
      console.log('✅ SUCCESS! New device created with external user ID');
      console.log('📱 Method:', result.result.method);
      console.log('🆔 Player ID:', result.result.id);
      console.log('🆔 External User ID: provider-' + providerId);
      
      // Send test notification
      console.log('\n📱 Sending test notification...');
      const notificationResult = await fixedOneSignalService.sendTestNotification(providerId);
      
      if (notificationResult.success) {
        console.log('✅ Test notification sent successfully!');
        console.log('📊 Recipients:', notificationResult.recipients);
        
        if (notificationResult.recipients > 0) {
          console.log('🎉 PERFECT! External user ID is working!');
          console.log('📱 Check your device for the test notification');
        } else {
          console.log('⚠️ 0 recipients - device might need time to activate');
        }
      } else {
        console.log('❌ Test notification failed:', notificationResult.error);
      }
      
    } else {
      console.log('❌ Failed to create device:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the fix
clearAndFixOneSignal();
