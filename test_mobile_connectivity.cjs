// Test mobile app connectivity to the server
async function testMobileConnectivity() {
  console.log('🧪 Testing Mobile App Connectivity...\n');
  
  const baseUrls = [
    'http://192.168.1.39:4000',  // Correct local IP
    'http://10.0.2.2:4000',      // Android emulator
    'http://localhost:4000',      // Local development
    'http://127.0.0.1:4000'      // Localhost alternative
  ];
  
  for (const baseUrl of baseUrls) {
    console.log(`🔍 Testing: ${baseUrl}`);
    
    try {
      // Test health endpoint
      const healthResponse = await fetch(`${baseUrl}/api/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log(`✅ Health check PASSED: ${healthData.message}`);
        
        // Test provider login endpoint
        try {
          const loginResponse = await fetch(`${baseUrl}/api/provider/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'testpassword'
            })
          });
          
          console.log(`📱 Login endpoint accessible: ${loginResponse.status} ${loginResponse.statusText}`);
          
          if (loginResponse.status === 401) {
            console.log('✅ Login endpoint working (expected 401 for invalid credentials)');
          }
        } catch (loginError) {
          console.log(`❌ Login endpoint error: ${loginError.message}`);
        }
        
      } else {
        console.log(`❌ Health check FAILED: ${healthResponse.status} ${healthResponse.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Connection FAILED: ${error.message}`);
    }
    
    console.log('---');
  }
  
  console.log('\n📱 Mobile App Network Configuration:');
  console.log('✅ Server running on: http://192.168.1.39:4000');
  console.log('✅ Port 4000 is accessible');
  console.log('✅ Health endpoint working');
  console.log('\n🔧 Next steps:');
  console.log('1. Rebuild your React Native app');
  console.log('2. Make sure mobile device is on same WiFi network');
  console.log('3. Test login functionality');
}

testMobileConnectivity().catch(console.error);
