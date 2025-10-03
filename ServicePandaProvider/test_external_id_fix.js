// Test script to verify OneSignal external user ID fix
const { fixedOneSignalService } = require('./src/services/fixedOneSignalService');

async function testExternalIdFix() {
  console.log('🧪 Testing OneSignal External ID Fix...\n');
  
  try {
    // Test 1: Check current registration status
    console.log('📊 Step 1: Checking current registration status...');
    const status = await fixedOneSignalService.getRegistrationStatus();
    console.log('Current status:', JSON.stringify(status, null, 2));
    
    if (!status.providerId) {
      console.log('❌ No provider ID found. Please login first.');
      return;
    }
    
    // Test 2: Force update external user ID
    console.log('\n🔄 Step 2: Force updating external user ID...');
    const result = await fixedOneSignalService.forceUpdateExternalUserId(status.providerId);
    
    if (result.success) {
      console.log('✅ External user ID updated successfully!');
      console.log('Result:', JSON.stringify(result.result, null, 2));
    } else {
      console.log('❌ Failed to update external user ID:', result.error);
      return;
    }
    
    // Test 3: Send test notification
    console.log('\n📱 Step 3: Sending test notification...');
    const notificationResult = await fixedOneSignalService.sendTestNotification(status.providerId);
    
    if (notificationResult.success) {
      console.log('✅ Test notification sent successfully!');
      console.log('Recipients:', notificationResult.recipients);
    } else {
      console.log('❌ Test notification failed:', notificationResult.error);
    }
    
    // Test 4: Final status check
    console.log('\n📊 Step 4: Final status check...');
    const finalStatus = await fixedOneSignalService.getRegistrationStatus();
    console.log('Final status:', JSON.stringify(finalStatus, null, 2));
    
    console.log('\n🎉 Test completed! Check your OneSignal dashboard to verify the external user ID is now set.');
    console.log('Expected external user ID:', `provider-${status.providerId}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testExternalIdFix();
