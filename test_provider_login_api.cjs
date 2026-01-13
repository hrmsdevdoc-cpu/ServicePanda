async function testProviderLoginAPI() {
  console.log('🧪 Testing Provider Login API...');
  console.log('📋 Test Details:');
  console.log('   URL: https://api.servicepanda.com.au/api/provider/login');
  console.log('   Email: john.smith@example.com');
  console.log('   Password: password123');
  console.log('   Content-Type: application/json');
  console.log('   Referer: https://staging.servicepanda.com.au/');
  console.log('=====================================');
  
  try {
    // Test with the exact URL and headers from the user's request
    const response = await fetch('https://api.servicepanda.com.au/api/provider/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://staging.servicepanda.com.au/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://staging.servicepanda.com.au'
      },
      body: JSON.stringify({
        email: 'john.smith@example.com',
        password: 'password123'
      })
    });

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Status Text:', response.statusText);
    console.log('📥 Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`);
    }
    
    const responseText = await response.text();
    console.log('📥 Response Body:', responseText);
    
    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('📥 Parsed JSON Response:', JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.log('⚠️  Response is not valid JSON');
    }
    
    // Analyze response
    if (response.ok) {
      console.log('✅ API Request Successful!');
      if (responseData) {
        console.log('✅ Login appears to be successful');
        console.log('📋 Provider Details:');
        console.log(`   ID: ${responseData.id || 'N/A'}`);
        console.log(`   Email: ${responseData.email || 'N/A'}`);
        console.log(`   Name: ${responseData.firstName || 'N/A'} ${responseData.lastName || 'N/A'}`);
        console.log(`   Status: ${responseData.status || 'N/A'}`);
        console.log(`   Provider Status: ${responseData.providerStatus || 'N/A'}`);
        console.log(`   Terms Accepted: ${responseData.termsAccepted || 'N/A'}`);
        console.log(`   Documents Uploaded: ${responseData.documentsUploaded || 'N/A'}`);
      }
    } else {
      console.log('❌ API Request Failed');
      console.log(`❌ Status: ${response.status} ${response.statusText}`);
      if (responseData && responseData.message) {
        console.log(`❌ Error Message: ${responseData.message}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.error('💥 Error details:', error);
    
    // Check if it's a network error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('🌐 Network Error - The API endpoint might not be accessible');
      console.log('💡 Suggestions:');
      console.log('   1. Check if the API server is running');
      console.log('   2. Verify the URL is correct');
      console.log('   3. Check network connectivity');
    }
  }
}

// Also test with localhost as fallback
async function testLocalProviderLoginAPI() {
  console.log('\n🔄 Testing with localhost fallback...');
  console.log('📋 Local Test Details:');
  console.log('   URL: http://localhost:3000/api/provider/login');
  console.log('   Email: john.smith@example.com');
  console.log('   Password: password123');
  console.log('=====================================');
  
  try {
    const response = await fetch('http://localhost:3000/api/provider/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ServicePandaProvider/1.0'
      },
      body: JSON.stringify({
        email: 'john.smith@example.com',
        password: 'password123'
      })
    });

    console.log('📥 Local Response Status:', response.status);
    console.log('📥 Local Response Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📥 Local Response Body:', responseText);
    
    if (response.ok) {
      console.log('✅ Local API Request Successful!');
    } else {
      console.log('❌ Local API Request Failed');
    }
    
  } catch (error) {
    console.error('💥 Local test failed:', error.message);
  }
}

// Run the tests
console.log('🚀 Starting Provider Login API Tests...\n');
testProviderLoginAPI().then(() => {
  // Wait a bit before testing localhost
  setTimeout(testLocalProviderLoginAPI, 2000);
});
