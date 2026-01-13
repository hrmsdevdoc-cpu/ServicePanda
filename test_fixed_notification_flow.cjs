#!/usr/bin/env node

// Quick test to verify the OneSignal import fix
console.log('🔧 Testing Fixed OneSignal Import...');

async function testOneSignalImport() {
  try {
    // Test the same import pattern that was failing
    console.log('📦 Testing OneSignal service import...');
    
    const oneSignalAdminServiceModule = await import('./server/oneSignalAdminService.ts');
    const oneSignalAdminService = oneSignalAdminServiceModule.default;
    
    console.log('✅ Import successful!');
    console.log('🔧 Service type:', typeof oneSignalAdminService);
    console.log('🔧 Has sendToProvider method:', typeof oneSignalAdminService.sendToProvider === 'function');
    
    if (oneSignalAdminService && typeof oneSignalAdminService.sendToProvider === 'function') {
      console.log('✅ OneSignal service is ready to use!');
      console.log('\n🎉 The import fix should work now!');
      console.log('\n📋 Next steps:');
      console.log('1. Restart your server');
      console.log('2. Make a customer request from the app');
      console.log('3. Check server logs for success messages');
      console.log('4. Check OneSignal dashboard for delivered notifications');
    } else {
      console.log('❌ OneSignal service not properly loaded');
    }
    
  } catch (error) {
    console.error('❌ Import test failed:', error.message);
    console.log('\n💡 Make sure server is compiled/built properly');
  }
}

testOneSignalImport();
