// Debug customer request flow
const debugCustomerRequest = async () => {
  try {
    console.log('🔍 Debugging customer request flow...');
    
    // Step 1: Check if we can create a customer
    console.log('📝 Step 1: Creating test customer...');
    const customerData = {
      email: "debugcustomer@example.com",
      password: "password123",
      firstName: "Debug",
      lastName: "Customer",
      phoneNumber: "0412345678"
    };
    
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    
    console.log('📡 Register response:', registerResponse.status);
    
    if (registerResponse.ok) {
      console.log('✅ Customer created successfully!');
    } else {
      console.log('⚠️ Customer might already exist, continuing...');
    }
    
    // Step 2: Login
    console.log('📝 Step 2: Logging in...');
    const loginData = {
      email: "debugcustomer@example.com",
      password: "password123"
    };
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('📡 Login response:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('📦 Token length:', loginResult.token ? loginResult.token.length : 0);
      
      // Step 3: Create service request
      console.log('📝 Step 3: Creating service request...');
      const requestData = {
        categoryId: 1,
        description: "DEBUG: Test service request for notification - " + new Date().toISOString(),
        suburb: "Sydney",
        postcode: "2000",
        customerFirstName: "Debug",
        customerLastName: "Customer",
        customerPhoneNumber: "0412345678",
        customerEmail: "debugcustomer@example.com"
      };
      
      console.log('📦 Request data:', JSON.stringify(requestData, null, 2));
      
      const requestResponse = await fetch('http://localhost:3000/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginResult.token}`
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('📡 Request response status:', requestResponse.status);
      
      if (requestResponse.ok) {
        const requestResult = await requestResponse.json();
        console.log('✅ Service request created successfully!');
        console.log('📦 Request ID:', requestResult.id);
        console.log('🎉 Check server logs for notification sending...');
        console.log('💡 Look for: "Notifying X providers of new customer request"');
      } else {
        const error = await requestResponse.text();
        console.log('❌ Service request failed:', error);
      }
      
    } else {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Error debugging customer request:', error);
  }
};

debugCustomerRequest();
