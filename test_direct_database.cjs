// Test direct database query for providers
const testDirectDatabase = async () => {
  try {
    console.log('🔍 Testing direct database query...');
    
    // Test if we can get providers directly from database
    const response = await fetch('http://localhost:3000/api/service-categories');
    
    if (response.ok) {
      const categories = await response.json();
      console.log('✅ Service categories working:', categories.length);
      
      // Now test a simple endpoint that should work
      const testResponse = await fetch('http://localhost:3000/api/service-providers', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Providers response status:', testResponse.status);
      console.log('📡 Providers response headers:', Object.fromEntries(testResponse.headers.entries()));
      
      const text = await testResponse.text();
      console.log('📡 Response preview:', text.substring(0, 200));
      
      if (text.includes('DOCTYPE')) {
        console.log('❌ Server returning HTML instead of JSON - server needs restart');
      } else {
        console.log('✅ Server returning JSON');
        const data = JSON.parse(text);
        console.log('📊 Providers found:', data.length);
      }
      
    } else {
      console.log('❌ Service categories failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error testing database:', error);
  }
};

testDirectDatabase();
