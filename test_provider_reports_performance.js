async function testProviderReportsAPI() {
  console.log('Testing provider reports API performance...');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:4000/api/admin/reports/providers', {
      headers: {
        'x-admin-token': 'test-token'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`API Response Time: ${duration}ms`);
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Data received:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testProviderReportsAPI();
