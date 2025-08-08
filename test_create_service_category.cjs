const fetch = require('node-fetch');

async function testCreateServiceCategory() {
  try {
    console.log('Testing create service category...');
    
    const testCategory = {
      name: 'Test Service Type',
      description: 'This is a test service type',
      icon: 'home',
      active: true,
      popular: false
    };
    
    console.log('Sending data:', testCategory);
    
    const response = await fetch('http://localhost:4000/api/admin/service-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'test'
      },
      body: JSON.stringify(testCategory)
    });
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCreateServiceCategory(); 