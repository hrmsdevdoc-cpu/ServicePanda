async function testMobileLogin() {
  console.log('🧪 Testing Mobile Login API with real credentials...');
  
  try {
    const response = await fetch('http://localhost:4000/api/provider/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ServicePandaProvider/1.0'
      },
      body: JSON.stringify({
        email: 'test@servicepanda.com',
        password: 'test123'
      })
    });

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Headers:', response.headers);
    
    const data = await response.text();
    console.log('📥 Response Body:', data);
    
    if (response.ok) {
      console.log('✅ Login API is working correctly');
    } else {
      console.log('❌ Login API returned error status');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Wait a bit for server to start, then test
setTimeout(testMobileLogin, 3000);
