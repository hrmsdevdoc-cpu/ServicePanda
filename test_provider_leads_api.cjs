const http = require('http');

// Test the provider leads API endpoint
function testProviderLeadsAPI(providerId) {
  console.log(`Testing provider leads API endpoint for provider ID ${providerId}...`);
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/provider/leads',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'x-provider-id': providerId.toString()
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:');
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
        
        if (Array.isArray(jsonData)) {
          console.log(`\nTotal leads returned: ${jsonData.length}`);
          if (jsonData.length > 0) {
            console.log('Sample lead data:');
            console.log('- ID:', jsonData[0].requestId);
            console.log('- Category:', jsonData[0].categoryName);
            console.log('- Status:', jsonData[0].status);
            console.log('- Customer:', jsonData[0].customerName);
          }
        }
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error.message);
  });

  req.end();
}

// Test the health endpoint first
function testHealthEndpoint() {
  console.log('Testing health endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/health',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Health Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Health Response:', data);
      console.log('\n--- Now testing provider leads API for provider ID 7 ---\n');
      
      // Test with provider ID 7 (the current provider)
      console.log('=== Testing Provider ID 7 ===');
      testProviderLeadsAPI(7);
    });
  });

  req.on('error', (error) => {
    console.error('Health check error:', error.message);
  });

  req.end();
}

// Start testing
testHealthEndpoint();
