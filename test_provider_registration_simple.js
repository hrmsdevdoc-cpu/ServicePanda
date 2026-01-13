// Simple test to check if provider is registered with OneSignal
// Add this to your provider app and run it

async function testProviderRegistration() {
  console.log('🧪 Testing Provider OneSignal Registration...');
  
  try {
    // Check stored provider ID
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const providerId = await AsyncStorage.getItem('providerId') || '1';
    console.log('👤 Provider ID:', providerId);
    
    // Expected external user ID
    const expectedExternalId = `provider-${providerId}`;
    console.log('🆔 Expected External User ID:', expectedExternalId);
    
    // Check OneSignal status
    if (typeof OneSignal !== 'undefined') {
      console.log('✅ OneSignal is available');
      
      // Try to get player ID
      const playerId = await AsyncStorage.getItem('oneSignalPlayerId');
      console.log('📱 Stored Player ID:', playerId || 'Not stored');
      
    } else {
      console.log('❌ OneSignal not available');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Make sure OneSignal is properly initialized in your app');
    console.log('2. Check notification permissions');
    console.log('3. Verify external user ID is set to:', expectedExternalId);
    console.log('4. Test notifications from OneSignal dashboard');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testProviderRegistration();
