const fetch = require('node-fetch');

async function testProviderReportAPI() {
  try {
    console.log('Testing Provider Report API endpoint...');
    
    // Test the new provider report endpoint
    const response = await fetch('http://localhost:3000/api/admin/providers/report', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'test-token' // You'll need to replace this with a real admin token
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Provider report data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testProviderReportAPI();

