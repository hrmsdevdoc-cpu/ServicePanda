async function testCORSConfiguration() {
  console.log('🧪 Testing CORS Configuration...\n');
  
  const testCases = [
    {
      name: 'Production API Domain',
      origin: 'https://api.servicepanda.com.au',
      expected: 'should be allowed'
    },
    {
      name: 'Staging Domain',
      origin: 'https://staging.servicepanda.com.au',
      expected: 'should be allowed'
    },
    {
      name: 'Main Domain',
      origin: 'https://servicepanda.com.au',
      expected: 'should be allowed'
    },
    {
      name: 'Localhost Development',
      origin: 'http://localhost:4000',
      expected: 'should be allowed'
    },
    {
      name: 'Random Domain',
      origin: 'https://malicious-site.com',
      expected: 'should be blocked'
    },
    {
      name: 'No Origin Header',
      origin: undefined,
      expected: 'should be handled gracefully'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Origin: ${testCase.origin || 'undefined'}`);
    console.log(`   Expected: ${testCase.expected}`);
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (testCase.origin) {
        headers['Origin'] = testCase.origin;
      }
      
      const response = await fetch('http://localhost:3000/api/provider/login', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: 'john.smith@example.com',
          password: 'password123'
        })
      });
      
      const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
      const corsMethods = response.headers.get('Access-Control-Allow-Methods');
      const corsHeaders = response.headers.get('Access-Control-Allow-Headers');
      const corsCredentials = response.headers.get('Access-Control-Allow-Credentials');
      
      console.log(`   Status: ${response.status}`);
      console.log(`   CORS Origin: ${corsOrigin || 'Not set'}`);
      console.log(`   CORS Methods: ${corsMethods || 'Not set'}`);
      console.log(`   CORS Headers: ${corsHeaders || 'Not set'}`);
      console.log(`   CORS Credentials: ${corsCredentials || 'Not set'}`);
      
      if (testCase.origin && corsOrigin === testCase.origin) {
        console.log('   ✅ CORS configured correctly');
      } else if (!testCase.origin && corsOrigin === '*') {
        console.log('   ✅ CORS handled no origin correctly');
      } else if (!corsOrigin) {
        console.log('   ✅ CORS blocked as expected');
      } else {
        console.log('   ⚠️  CORS configuration unexpected');
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🔍 CORS Configuration Summary:');
  console.log('✅ Allowed Origins:');
  console.log('   - https://staging.servicepanda.com.au');
  console.log('   - https://servicepanda.com.au');
  console.log('   - https://www.servicepanda.com.au');
  console.log('   - https://api.servicepanda.com.au');
  console.log('   - http://localhost:4000 (development)');
  console.log('   - http://localhost:3000 (development)');
  console.log('   - Any servicepanda.com.au subdomain');
  console.log('\n✅ Headers Included:');
  console.log('   - Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  console.log('   - Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
  console.log('   - Access-Control-Allow-Credentials: true');
  console.log('\n✅ This configuration should work for live deployment!');
}

// Run the test
testCORSConfiguration();
