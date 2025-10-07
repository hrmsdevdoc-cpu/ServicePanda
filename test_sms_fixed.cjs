const axios = require('axios');

// Function to format phone number to E164 format
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with +61 (Australia)
  if (cleaned.startsWith('0')) {
    cleaned = '+61' + cleaned.substring(1);
  }
  // If it doesn't start with +, add +61
  else if (!cleaned.startsWith('+')) {
    cleaned = '+61' + cleaned;
  }
  
  return cleaned;
}

async function testSmsSending() {
  const apiKey = '3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc';
  const apiUrl = 'https://dialpad.com/api/v2/sms';
  const fromNumber = '+61452229882';
  const toNumber = formatPhoneNumber('0485901942'); // Format to E164
  
  const message = `Test SMS from ServicePanda Campaign System!
  
This is a test message to verify SMS delivery.

If you receive this, the SMS system is working correctly.

Best regards,
ServicePanda Team`;

  console.log('🔍 Testing SMS sending...');
  console.log('📱 To (Original): 0485901942');
  console.log('📱 To (E164):', toNumber);
  console.log('📱 From:', fromNumber);
  console.log('📝 Message:', message.substring(0, 100) + '...');

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
