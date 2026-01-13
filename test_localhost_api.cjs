async function testLocalhostAPI() {
  console.log('🧪 Testing Localhost Provider Login API...');
  console.log('📋 Test Details:');
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

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Status Text:', response.statusText);
    
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
        console.log('✅ Login successful!');
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
  }
}

// Run the test
console.log('🚀 Starting Localhost API Test...\n');
testLocalhostAPI();
