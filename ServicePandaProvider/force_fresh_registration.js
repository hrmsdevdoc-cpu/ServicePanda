/**
 * Force Fresh OneSignal Registration
 * Run this in provider app to get fresh active device registration
 */

const React = require('react');
const { Alert } = require('react-native');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// Import services
const fixedOneSignalService = require('./src/services/fixedOneSignalService').default;
const fallbackOneSignalService = require('./src/services/fallbackOneSignalService').default;

async function forceFreshRegistration() {
  try {
    console.log('🔄 FORCING FRESH ONESIGNAL REGISTRATION...');
    console.log('=' .repeat(50));
    
    // Step 1: Complete cleanup
    console.log('1️⃣ Complete cleanup of old registration...');
    await AsyncStorage.clear(); // Clear everything
    console.log('✅ AsyncStorage cleared');
    
    // Step 2: Set fresh provider ID
    console.log('2️⃣ Setting fresh provider ID...');
    await AsyncStorage.setItem('providerId', '1');
    console.log('✅ Provider ID set to 1');
    
    // Step 3: Initialize fixed OneSignal service (primary)
    console.log('3️⃣ Initializing fixed OneSignal service...');
    try {
      await fixedOneSignalService.initialize();
      console.log('✅ Fixed OneSignal service initialized');
      
      // Wait a bit for registration to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check status
      const status = await fixedOneSignalService.getRegistrationStatus();
      console.log('📊 Fixed service registration status:', status);
      
      if (status.isRegistered && status.playerId) {
        console.log('🎉 SUCCESS! Fresh device registered with fixed service');
        console.log(`📱 New Player ID: ${status.playerId}`);
        console.log(`🆔 External User ID: ${status.externalUserId}`);
        
        // Test notification to new device
        console.log('4️⃣ Testing notification to fresh device...');
        const testResult = await fixedOneSignalService.sendTestNotification(1);
        console.log('📋 Test result:', testResult);
        
        return { success: true, service: 'fixed', playerId: status.playerId };
      } else {
        throw new Error('Fixed service registration failed');
      }
      
    } catch (fixedError) {
      console.log('⚠️ Fixed service failed, trying fallback...');
      console.log('❌ Fixed service error:', fixedError.message);
      
      // Step 4: Try fallback service
      console.log('4️⃣ Trying fallback OneSignal service...');
      await fallbackOneSignalService.initialize();
      console.log('✅ Fallback OneSignal service initialized');
      
      // Wait for registration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check fallback status
      const fallbackStatus = await fallbackOneSignalService.getRegistrationStatus();
      console.log('📊 Fallback service registration status:', fallbackStatus);
      
      if (fallbackStatus.isRegistered && fallbackStatus.playerId) {
        console.log('🎉 SUCCESS! Fresh device registered with fallback service');
        console.log(`📱 New Player ID: ${fallbackStatus.playerId}`);
        console.log(`🆔 External User ID: ${fallbackStatus.externalUserId}`);
        
        return { success: true, service: 'fallback', playerId: fallbackStatus.playerId };
      } else {
        throw new Error('Both services failed to register');
      }
    }
    
  } catch (error) {
    console.error('❌ Fresh registration failed:', error);
    return { success: false, error: error.message };
  }
}

// Function to check fresh registration result
async function checkFreshRegistrationResult() {
  try {
    console.log('\n🔍 CHECKING FRESH REGISTRATION RESULT...');
    
    // Check both services
    const fixedStatus = await fixedOneSignalService.getRegistrationStatus();
    const fallbackStatus = await fallbackOneSignalService.getRegistrationStatus();
    
    console.log('📊 Fixed service status:', fixedStatus);
    console.log('📊 Fallback service status:', fallbackStatus);
    
    // Return best status
    if (fixedStatus.isRegistered) {
      return fixedStatus;
    } else if (fallbackStatus.isRegistered) {
      return fallbackStatus;
    } else {
      return { isRegistered: false, error: 'No service registered' };
    }
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
    return { isRegistered: false, error: error.message };
  }
}

// Export functions for use in provider app
module.exports = {
  forceFreshRegistration,
  checkFreshRegistrationResult
};

// Auto-run if called directly
if (require.main === module) {
  forceFreshRegistration()
    .then(result => {
      console.log('\n📊 Final Result:', result);
      if (result.success) {
        console.log('🎉 Fresh registration completed!');
        console.log('💡 Now test server notifications - customer request bhejo!');
      } else {
        console.log('❌ Fresh registration failed');
        console.log('🔧 Try manual OneSignal setup in app');
      }
    })
    .catch(console.error);
}
