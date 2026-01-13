const fetch = require('node-fetch');

async function testEmailAPI() {
  try {
    console.log('🧪 Testing email API...\n');

    // Test the API endpoint
    const response = await fetch('http://localhost:4000/api/admin/emails?tab=sent&user=all&search=&fromDate=&toDate=', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // You might need to get a real admin token
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const emails = await response.json();
      console.log(`✅ API returned ${emails.length} emails`);
      if (emails.length > 0) {
        console.log('📧 First email:', emails[0]);
      }
    } else {
      const error = await response.text();
      console.log(`❌ API Error: ${error}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmailAPI();
