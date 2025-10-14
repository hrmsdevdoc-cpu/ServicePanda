const axios = require('axios');

async function testSmsSending() {
  const apiKey = '3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc';
  const apiUrl = 'https://dialpad.com/api/v2/sms';
  const fromNumber = '+61452229882';
  const toNumber = '0485901942'; // Your test number
  
  const message = `Test SMS from ServicePanda Campaign System!
  
This is a test message to verify SMS delivery.

If you receive this, the SMS system is working correctly.

Best regards,
ServicePanda Team`;

  console.log('🔍 Testing SMS sending...');
  console.log('📱 To:', toNumber);
  console.log('📱 From:', fromNumber);
  console.log('📝 Message:', message.substring(0, 100) + '...');
  console.log('🔑 API Key:', apiKey.substring(0, 20) + '...');
  console.log('🌐 API URL:', apiUrl);

  try {
    const response = await axios.post(
      `${apiUrl}?apikey=${encodeURIComponent(apiKey)}`,
      {
        infer_country_code: false,
        text: message,
        to_numbers: [toNumber],
        from_number: fromNumber,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ SMS API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.id) {
      console.log('🎉 SMS sent successfully!');
      console.log('SMS ID:', response.data.id);
    } else {
      console.log('❌ SMS failed - No ID returned');
    }
    
  } catch (error) {
    console.error('❌ SMS sending failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSmsSending();