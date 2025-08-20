const axios = require('axios');

// Direct SMS test to user's number
async function testSmsDirect() {
  console.log('🧪 Testing SMS Service Directly to Your Number...\n');
  
  // Use provided Dialpad credentials directly (no .env)
  const smsApiUrl = 'https://dialpad.com/api/v2/sms';
  const smsApiKey = '3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc';
  
  // User's phone number (with country code)
  const userPhone = '+61485901939';
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

    if (responseData && typeof responseData.id === 'string' && responseData.id.trim() !== '') {
      console.log('\n🎉 SUCCESS! SMS sent successfully!');
      console.log('Message ID:', responseData.id);
      console.log('To:', userPhone);
      console.log('\n✅ API acknowledged send.');
      console.log('\n📱 Please confirm the SMS arrived on +61 485 901 939.');
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

