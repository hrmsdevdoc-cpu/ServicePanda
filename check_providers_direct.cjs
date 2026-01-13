// Check providers directly from database
const checkProviders = async () => {
  try {
    console.log('🔍 Checking providers in database...');
    
    // Test if we can access the database directly
    const response = await fetch('http://localhost:3000/api/service-categories');
    
    if (response.ok) {
      console.log('✅ Server is working');
      
      // Try to get providers with a different approach
      console.log('📋 Testing different endpoints...');
      
      // Test 1: Try with different path
      const test1 = await fetch('http://localhost:3000/api/service-providers/');
      console.log('Test 1 - /api/service-providers/:', test1.status);
      
      // Test 2: Try with query params
      const test2 = await fetch('http://localhost:3000/api/service-providers?status=approved');
      console.log('Test 2 - with query params:', test2.status);
      
      // Test 3: Try with different method
      const test3 = await fetch('http://localhost:3000/api/service-providers', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Test 3 - with headers:', test3.status);
      
      const text = await test3.text();
      if (text.includes('DOCTYPE')) {
        console.log('❌ Still getting HTML - server needs restart');
        console.log('💡 Solution: Restart your server!');
      } else {
        console.log('✅ Getting JSON response');
        const data = JSON.parse(text);
        console.log('📊 Providers found:', data.length);
      }
      
    } else {
      console.log('❌ Server not working');
    }
    
  } catch (error) {
    console.error('❌ Error checking providers:', error);
  }
};

checkProviders();
