const http = require('http');

// Test the provider leads API endpoint with different authentication scenarios
function testProviderLeadsAPI(providerId, description) {
  console.log(`\n${description}`);
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
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        if (Array.isArray(jsonData)) {
          console.log(`✅ Success: ${jsonData.length} leads returned`);
          if (jsonData.length > 0) {
            console.log('Sample lead:');
            console.log(`  - ID: ${jsonData[0].requestId}`);
            console.log(`  - Category: ${jsonData[0].categoryName}`);
            console.log(`  - Status: ${jsonData[0].status}`);
          }
        } else {
          console.log('❌ Unexpected response format:', jsonData);
        }
      } catch (e) {
        console.log('❌ Error parsing response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
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
      console.log('\n--- Now testing provider leads API with different scenarios ---\n');
      
      // Test with provider ID 7 (the current provider)
      testProviderLeadsAPI(7, '=== Testing Provider ID 7 (Current Provider) ===');
      
      // Test with provider ID 2 (which we know has leads in database)
      testProviderLeadsAPI(2, '=== Testing Provider ID 2 (Has Leads in DB) ===');
      
      // Test without authentication header
      testProviderLeadsAPI('', '=== Testing Without Authentication Header ===');
    });
  });

  req.on('error', (error) => {
    console.error('Health check error:', error.message);
  });

  req.end();
}

// Start testing
testHealthEndpoint();
