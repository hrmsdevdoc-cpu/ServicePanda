// Debug eligible providers
const debugEligibleProviders = async () => {
  try {
    console.log('🔍 Debugging eligible providers...');
    
    // Test with sample data
    const categoryId = 1;
    const postcode = "2000";
    
    console.log(`📋 Looking for providers for category ${categoryId} in postcode ${postcode}`);
    
    // Check if we have any providers in the system
    const response = await fetch('http://localhost:3000/api/service-providers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const providers = await response.json();
      console.log(`📊 Total providers in system: ${providers.length}`);
      
      if (providers.length > 0) {
        console.log('📋 Sample providers:');
        providers.slice(0, 3).forEach((provider, index) => {
          console.log(`  ${index + 1}. ${provider.firstName} ${provider.lastName} (ID: ${provider.id})`);
          console.log(`     Status: ${provider.status}, Provider Status: ${provider.providerStatus}`);
        });
      } else {
        console.log('❌ No providers found in system!');
      }
    } else {
      console.log('❌ Failed to fetch providers:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error debugging providers:', error);
  }
};

debugEligibleProviders();
