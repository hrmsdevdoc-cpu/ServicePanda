const fetch = require('node-fetch');

async function testAdminAuth() {
  try {
    console.log('Testing Admin Authentication...\n');

    // First, try to login as admin
    const loginResponse = await fetch('http://localhost:4000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    console.log('Login response status:', loginResponse.status);

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful, token received');
      
      // Now test the potential providers API with the token
      const providersResponse = await fetch('http://localhost:4000/api/admin/potential-providers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': loginData.token
        }
      });

      console.log('Providers API response status:', providersResponse.status);

      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        console.log('✅ Potential Providers API working!');
        console.log(`Found ${providersData.length} providers:`);
        providersData.forEach((provider, index) => {
          console.log(`${index + 1}. ${provider.firstName} ${provider.lastName} - ${provider.status}`);
        });
      } else {
        const errorText = await providersResponse.text();
        console.log('❌ Potential Providers API failed:', errorText);
      }
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
    }

  } catch (error) {
    console.error('❌ Error testing admin auth:', error.message);
  }
}

testAdminAuth();
