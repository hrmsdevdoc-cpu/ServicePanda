#!/usr/bin/env node

// Test Android emulator connection to localhost server
console.log('🧪 Testing Android Emulator Connection to Localhost...');

async function testEmulatorConnection() {
  const testUrls = [
    'http://localhost:3000/api/health',
    'http://127.0.0.1:3000/api/health',
    'http://10.0.2.2:3000/api/health'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${url}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${data.message}`);
      } else {
        console.log(`❌ FAILED: ${url} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${url} - ${error.message}`);
    }
  }
  
  console.log('\n📋 Results Summary:');
  console.log('✅ If localhost:3000 works → Server is running');
  console.log('✅ If 10.0.2.2:3000 works → Android emulator can connect');
  console.log('❌ If all fail → Server not running or network issue');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Make sure server is running: npm run dev');
  console.log('2. Restart customer app');
  console.log('3. App should now connect to 10.0.2.2:3000');
}

testEmulatorConnection();
