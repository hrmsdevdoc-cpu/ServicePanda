// Test customer request endpoint
const testCustomerRequest = async () => {
  const requestData = {
    customerId: "test-customer-123",
    categoryId: 1,
    description: "Test service request for notification",
    suburb: "Sydney",
    postcode: "2000",
    customerFirstName: "Test",
    customerLastName: "Customer",
    customerPhoneNumber: "0412345678",
    customerEmail: "test@example.com"
  };

  try {
    console.log('🧪 Testing customer request endpoint...');
    console.log('📦 Request data:', JSON.stringify(requestData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // You might need a real token
      },
      body: JSON.stringify(requestData)
    });

    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Customer request created successfully!');
      console.log('📦 Request ID:', result.id);
      console.log('📦 Full response:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ Customer request failed:', error);
    }
  } catch (error) {
    console.error('❌ Error testing customer request:', error);
  }
};

testCustomerRequest();
