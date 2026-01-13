// Test customer login to get token
const testCustomerLogin = async () => {
  const loginData = {
    email: "test@example.com",
    password: "password123"
  };

  try {
    console.log('🔐 Testing customer login...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('📡 Login response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Customer login successful!');
      console.log('📦 Token:', result.token);
      return result.token;
    } else {
      const error = await response.text();
      console.log('❌ Customer login failed:', error);
      
      // Try to create a test customer first
      console.log('🔄 Trying to create test customer...');
      await createTestCustomer();
    }
  } catch (error) {
    console.error('❌ Error testing customer login:', error);
  }
};

const createTestCustomer = async () => {
  const customerData = {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "Customer",
    phoneNumber: "0412345678"
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    if (response.ok) {
      console.log('✅ Test customer created successfully!');
      // Now try login again
      await testCustomerLogin();
    } else {
      const error = await response.text();
      console.log('❌ Customer creation failed:', error);
    }
  } catch (error) {
    console.error('❌ Error creating test customer:', error);
  }
};

testCustomerLogin();
