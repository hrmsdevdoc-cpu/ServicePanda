const axios = require('axios');
require('dotenv').config();

// Test SMS service by sending a message to the user's number
async function testSmsToUser() {
  console.log('🧪 Testing SMS Service with User Number...\n');
  
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
    console.log('SMS_API_KEY=3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc');
    return;
  }
  
  console.log('\n✅ SMS service configuration looks good!');
  
  // User's phone number (with country code)
  const userPhone = '+918077158797';
  const testMessage = `🧪 Test SMS from ServicePanda!

This is a test message to verify our SMS service is working correctly.

Time: ${new Date().toLocaleString()}
Service: Dialpad SMS API
Status: Testing

If you receive this, our SMS integration is working! 🎉

Best regards,
ServicePanda Team`;

  console.log('\n📱 Sending Test SMS...');
  console.log('To:', userPhone);
  console.log('Message:', testMessage.substring(0, 100) + '...');
  
  try {
    // Send SMS using Dialpad API
    const response = await axios.post(
      `${smsApiUrl}?apikey=${encodeURIComponent(smsApiKey)}`,
      {
        infer_country_code: false,
        text: testMessage,
        to_numbers: [userPhone],
        from_number: '+61452229882',
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const responseData = response.data;
    console.log('\n📤 SMS API Response:', responseData);

    if (responseData.id && responseData.id.trim() !== '') {
      console.log('\n🎉 SUCCESS! SMS sent successfully!');
      console.log('Message ID:', responseData.id);
      console.log('To:', userPhone);
      console.log('\n✅ Your SMS service is working perfectly!');
      console.log('\n📋 Next steps:');
      console.log('1. Check your phone for the test message');
      console.log('2. Test the admin panel SMS functionality');
      console.log('3. Use the "Send SMS" buttons in your admin panel');
    } else {
      console.log('\n❌ SMS API response error:', responseData);
      console.log('Please check your Dialpad API configuration');
    }
    
  } catch (error) {
    console.log('\n❌ Failed to send SMS:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else if (error.request) {
      console.log('Request error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Verify your Dialpad API key is valid');
    console.log('2. Check if you have sufficient SMS credits');
    console.log('3. Ensure the API endpoint is correct');
    console.log('4. Check your internet connection');
  }
}

// Run the test
console.log('🚀 Starting SMS Test...\n');
testSmsToUser().catch(console.error);
