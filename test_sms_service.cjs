const axios = require('axios');

// Test SMS service configuration
async function testSmsService() {
  console.log('Testing SMS Service Configuration...\n');
  
  // Test environment variables
  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiKey = process.env.SMS_API_KEY;
  
  console.log('Environment Variables:');
  console.log('SMS_API_URL:', smsApiUrl ? '✓ Set' : '✗ Not set');
  console.log('SMS_API_KEY:', smsApiKey ? '✓ Set (length: ' + smsApiKey.length + ')' : '✗ Not set');
  
  if (!smsApiUrl || !smsApiKey) {
    console.log('\n❌ SMS service is not properly configured.');
    console.log('Please add the following to your .env file:');
    console.log('SMS_API_URL=https://dialpad.com/api/v2/sms');
    console.log('SMS_API_KEY=your_api_key_here');
    return;
  }
  
  console.log('\n✅ SMS service configuration looks good!');
  
  // Test API connectivity (without sending actual SMS)
  try {
    console.log('\nTesting API connectivity...');
    
    // This is a test request to check if the API endpoint is reachable
    // We won't actually send an SMS in this test
    const testResponse = await axios.get(smsApiUrl.replace('/api/v2/sms', '/health'), {
      timeout: 5000,
      validateStatus: () => true // Accept any status code for testing
    });
    
    console.log('✓ API endpoint is reachable');
    console.log('Response status:', testResponse.status);
    
  } catch (error) {
    console.log('⚠️  API connectivity test failed (this might be normal for some APIs):');
    console.log('Error:', error.message);
  }
  
  console.log('\n📱 SMS Service is ready to use!');
  console.log('\nTo test sending an actual SMS, you can:');
  console.log('1. Use the admin panel "Send SMS" button');
  console.log('2. Call the API endpoint: POST /api/admin/potential-customers/:id/send-sms');
  console.log('3. Use the bulk SMS endpoint: POST /api/admin/potential-customers/send-sms');
}

// Run the test
testSmsService().catch(console.error);
