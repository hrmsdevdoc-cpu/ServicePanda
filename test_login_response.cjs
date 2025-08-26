// Using built-in fetch (Node.js 18+)

async function testLoginResponse() {
  console.log('🧪 Testing Login Response to see exact data returned...');

  try {
    const response = await fetch('http://192.168.1.57:4000/api/provider/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ServicePandaProvider/1.0'
      },
      body: JSON.stringify({
        email: 'hrms.devdoc@gmail.com',
        password: '123456'
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', response.headers);

    const data = await response.json();
    console.log('📊 Full Response Data:', JSON.stringify(data, null, 2));
    
    // Check the specific fields we need
    console.log('\n🔍 Profile Completion Fields:');
    console.log('  - documentsUploaded:', data.documentsUploaded, '(', typeof data.documentsUploaded, ')');
    console.log('  - termsAccepted:', data.termsAccepted, '(', typeof data.termsAccepted, ')');
    console.log('  - status:', data.status, '(', typeof data.status, ')');
    console.log('  - providerStatus:', data.providerStatus, '(', typeof data.providerStatus, ')');
    
    // Test the logic from the mobile app
    const needsStepCompletion = (data.documentsUploaded === false) || 
                               (data.termsAccepted === false) || 
                               (data.status === 'pending') ||
                               (data.providerStatus === 'deactivated');
    
    console.log('\n🧮 Mobile App Logic Test:');
    console.log('  - needsStepCompletion:', needsStepCompletion);
    console.log('  - Will show profile setup dialog:', needsStepCompletion);
    console.log('  - Will navigate to dashboard:', !needsStepCompletion);

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testLoginResponse();
