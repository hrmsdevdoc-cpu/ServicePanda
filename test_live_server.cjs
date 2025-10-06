// Test live server instead of localhost
const testLiveServer = async () => {
  try {
    console.log('🌐 Testing live server...');
    
    // Replace with your actual live server URL
    const liveServerUrl = 'https://your-live-server.com'; // Update this with your actual URL
    
    console.log('📝 Testing service categories on live server...');
    const categoriesResponse = await fetch(`${liveServerUrl}/api/service-categories`);
    
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('✅ Live server categories working:', categories.length);
      
      // Test providers
      console.log('📝 Testing service providers on live server...');
      const providersResponse = await fetch(`${liveServerUrl}/api/service-providers`);
      
      if (providersResponse.ok) {
        const providers = await providersResponse.json();
        console.log('✅ Live server providers working:', providers.length);
        
        if (providers.length > 0) {
          console.log('📊 Sample provider:', providers[0].firstName, providers[0].lastName);
        }
        
        console.log('🎉 Live server is ready!');
        console.log('💡 Make sure your mobile app is pointing to live server URL!');
        
      } else {
        console.log('❌ Live server providers not working:', providersResponse.status);
      }
      
    } else {
      console.log('❌ Live server categories not working:', categoriesResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Error testing live server:', error);
    console.log('💡 Make sure to update the liveServerUrl variable with your actual URL!');
  }
};

testLiveServer();
