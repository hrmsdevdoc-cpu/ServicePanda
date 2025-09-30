/**
 * Force Device Re-registration Script
 * Run this in the provider app to force re-registration with proper external user ID
 */

const React = require('react');
const { Alert } = require('react-native');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// Import the fallback service directly
const fallbackOneSignalService = require('./src/services/fallbackOneSignalService').default;

async function forceReregisterDevice() {
  try {
    console.log('🔄 FORCE RE-REGISTRATION STARTING...');
    
    // Step 1: Clear existing registration
    console.log('1️⃣ Clearing existing OneSignal registration...');
    await AsyncStorage.removeItem('oneSignalPlayerId');
    await AsyncStorage.removeItem('deviceRegistered');
    console.log('✅ Cleared existing registration data');
    
    // Step 2: Set provider ID if not set
    console.log('2️⃣ Setting provider ID...');
    await AsyncStorage.setItem('providerId', '1');
    console.log('✅ Provider ID set to 1');
    
    // Step 3: Force re-registration with fallback service
    console.log('3️⃣ Force re-registering with fallback OneSignal service...');
    await fallbackOneSignalService.initialize();
    console.log('✅ Fallback OneSignal service initialized');
    
    // Step 4: Check registration status
    console.log('4️⃣ Checking registration status...');
    const status = await fallbackOneSignalService.getRegistrationStatus();
    console.log('📊 Registration Status:', status);
    
    if (status.isRegistered) {
      console.log('🎉 SUCCESS: Device re-registered successfully!');
      console.log(`🆔 Player ID: ${status.playerId}`);
      console.log(`👤 External User ID: ${status.externalUserId}`);
      console.log('📱 Device should now receive notifications targeted at provider-1');
      
      Alert.alert(
        'Re-registration Complete! ✅',
        `Device successfully re-registered with OneSignal!\n\nExternal User ID: ${status.externalUserId}\n\nYou should now receive notifications.`,
        [{ text: 'OK' }]
      );
    } else {
      console.log('❌ Re-registration failed');
      Alert.alert('Re-registration Failed', 'Please try again or check logs.');
    }
    
  } catch (error) {
    console.error('❌ Force re-registration error:', error);
    Alert.alert('Error', `Re-registration failed: ${error.message}`);
  }
}

// Export for use in app
module.exports = {
  forceReregisterDevice
};
