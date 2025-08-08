const fetch = require('node-fetch');

async function testServer() {
  try {
    console.log('Testing server connectivity...');
    
    // Test basic server response
    const response = await fetch('http://localhost:4000/api/service-categories');
    console.log('Server response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Service categories:', data);
    } else {
      console.log('Server error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('Connection error:', error.message);
    console.log('Make sure the server is running on port 4000');
  }
}

testServer(); 