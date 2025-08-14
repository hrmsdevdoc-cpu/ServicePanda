const axios = require('axios');
require('dotenv').config();

// Direct SMS test to user's number
async function testSmsDirect() {
  console.log('🧪 Testing SMS Service Directly to Your Number...\n');
  
  // Test environment variables
  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiKey = process.env.SMS_API_KEY;
  
  console.log('Environment Variables:');
  console.log('SMS_API_URL:', smsApiUrl ? '✓ Set' : '✗ Not set');
  console.log('SMS_API_KEY:', smsApiKey ? '✓ Set (length: ' + smsApiKey.length + ')' : '✗ Not set');
  
  if (!smsApiUrl || !smsApiKey) {
    console.log('\n❌ SMS service is not properly configured.');
    console.log('Please check your .env file has:');
    console.log('SMS_API_URL=https://dialpad.com/api/v2/sms');
    console.log('SMS_API_KEY=your_api_key_here');
    return;
  }
  
  console.log('\n✅ SMS service configuration looks good!');
  
  // User's phone number (with country code)
  const userPhone = '+918077158797'; // Added +91 for India
  const testMessage = `🧪 Test SMS from ServicePanda!

This is a direct test message to verify our SMS service is working correctly.

Time: ${new Date().toLocaleString()}
Service: Dialpad SMS API
Status: Direct Test

If you receive this, our SMS integration is working! 🎉

Best regards,
ServicePanda Team`;

  console.log('\n📱 Sending Direct Test SMS...');
  console.log('To:', userPhone);
  console.log('Message:', testMessage.substring(0, 100) + '...');
  
  try {
    console.log('\n🚀 Making API request to Dialpad...');
    
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
      console.log('\n📱 Check your phone for the test message');
      console.log('\n📋 Next steps:');
      console.log('1. Verify you received the SMS');
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
    console.log('5. Verify the phone number format (+918077158797)');
  }
}

// Run the test
console.log('🚀 Starting Direct SMS Test...\n');
testSmsDirect().catch(console.error);
