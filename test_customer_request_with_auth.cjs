// Test customer request with proper authentication
const testCustomerRequest = async () => {
  try {
    console.log('🧪 Testing customer request with authentication...');
    
    // First, try to create a test customer
    const registerData = {
      email: "testcustomer@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "Customer",
      phoneNumber: "0412345678"
    };
    
    console.log('📝 Step 1: Creating test customer...');
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });
    
    if (registerResponse.ok) {
      console.log('✅ Test customer created successfully!');
    } else {
      console.log('⚠️ Customer might already exist, trying login...');
    }
    
    // Now try to login
    console.log('📝 Step 2: Logging in...');
    const loginData = {
      email: "testcustomer@example.com",
      password: "password123"
    };
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('📦 Token received:', loginResult.token ? 'Yes' : 'No');
      
      // Now create service request
      console.log('📝 Step 3: Creating service request...');
      const requestData = {
        categoryId: 1,
        description: "Test service request for notification - " + new Date().toISOString(),
        suburb: "Sydney",
        postcode: "2000",
        customerFirstName: "Test",
        customerLastName: "Customer",
        customerPhoneNumber: "0412345678",
        customerEmail: "testcustomer@example.com"
      };
      
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
        console.log('🎉 Notification should be sent to providers now!');
      } else {
        const error = await requestResponse.text();
        console.log('❌ Service request failed:', error);
      }
      
    } else {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Error testing customer request:', error);
  }
};

testCustomerRequest();
