const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing Potential Providers API...\n');

    // Test the API endpoint
    const response = await fetch('http://localhost:4000/api/admin/potential-providers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This might be the issue - need proper auth
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();
