async function testLeadDisplay() {
  const fetch = (await import('node-fetch')).default;
  try {
    console.log('🔍 Testing Lead Display Debug...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    try {
      const healthResponse = await fetch('http://localhost:3000/api/health');
      if (healthResponse.ok) {
        console.log('✅ Server is running');
      } else {
        console.log('❌ Server health check failed');
        return;
      }
    } catch (error) {
      console.log('❌ Server is not running:', error.message);
      return;
    }

    // Test 2: Check if there are any service requests
    console.log('\n2. Checking service requests...');
    try {
      const requestsResponse = await fetch('http://localhost:3000/api/service-requests');
      const requests = await requestsResponse.json();
      console.log(`📊 Found ${requests.length} service requests`);
      if (requests.length > 0) {
        console.log('Latest request:', {
          id: requests[0].id,
          categoryId: requests[0].categoryId,
          postcode: requests[0].postcode,
          status: requests[0].status,
          createdAt: requests[0].createdAt
        });
      }
    } catch (error) {
      console.log('❌ Error fetching service requests:', error.message);
    }

    // Test 3: Check if there are any lead offers
    console.log('\n3. Checking lead offers...');
    try {
      const offersResponse = await fetch('http://localhost:3000/api/admin/leads');
      const offers = await offersResponse.json();
      console.log(`📊 Found ${offers.length} lead offers`);
      if (offers.length > 0) {
        console.log('Lead offer statuses:', offers.map(o => o.status));
        console.log('Sample offer:', {
          id: offers[0].id,
          requestId: offers[0].requestId,
          providerId: offers[0].providerId,
          status: offers[0].status,
          offerType: offers[0].offerType
        });
      }
    } catch (error) {
      console.log('❌ Error fetching lead offers:', error.message);
    }

    // Test 4: Check provider authentication
    console.log('\n4. Testing provider authentication...');
    try {
      // Try to login as a provider
      const loginResponse = await fetch('http://localhost:3000/api/provider/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Provider login successful');
        console.log('Provider ID:', loginData.provider?.id);
        
        // Test 5: Check provider leads
        console.log('\n5. Testing provider leads endpoint...');
        const leadsResponse = await fetch('http://localhost:3000/api/provider/leads', {
          headers: {
            'x-provider-id': loginData.provider.id.toString()
          }
        });
        
        if (leadsResponse.ok) {
          const leads = await leadsResponse.json();
          console.log(`📊 Provider has ${leads.length} leads`);
          if (leads.length > 0) {
            console.log('Lead statuses:', leads.map(l => l.status));
            console.log('Sample lead:', {
              requestId: leads[0].requestId,
              status: leads[0].status,
              categoryName: leads[0].categoryName,
              offerType: leads[0].offerType
            });
          }
        } else {
          console.log('❌ Error fetching provider leads:', leadsResponse.status);
        }
      } else {
        console.log('❌ Provider login failed:', loginResponse.status);
      }
    } catch (error) {
      console.log('❌ Error testing provider authentication:', error.message);
    }

    console.log('\n🔍 Debug complete!');
  } catch (error) {
    console.error('💥 Error in test:', error);
  }
}

testLeadDisplay();
