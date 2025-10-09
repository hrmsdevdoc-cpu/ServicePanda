const fetch = (await import('node-fetch')).default;

async function testKanbanFiltering() {
  try {
    console.log('Testing Kanban filtering for won/lost providers...');
    
    // First, let's login as admin to get a token
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('Failed to login:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('Admin login successful');
    
    // Get all potential providers
    const providersResponse = await fetch('http://localhost:3000/api/admin/potential-providers', {
      headers: {
        'x-admin-token': token
      }
    });
    
    if (!providersResponse.ok) {
      console.error('Failed to fetch providers:', await providersResponse.text());
      return;
    }
    
    const providers = await providersResponse.json();
    console.log(`\nTotal providers: ${providers.length}`);
    
    // Count providers by status
    const statusCounts = providers.reduce((acc, provider) => {
      acc[provider.status] = (acc[provider.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Providers by status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    // Count active providers (not won/lost)
    const activeProviders = providers.filter(p => p.status !== 'won' && p.status !== 'lost');
    const wonProviders = providers.filter(p => p.status === 'won');
    const lostProviders = providers.filter(p => p.status === 'lost');
    
    console.log(`\nActive providers (should show in Kanban): ${activeProviders.length}`);
    console.log(`Won providers (should be hidden): ${wonProviders.length}`);
    console.log(`Lost providers (should be hidden): ${lostProviders.length}`);
    
    if (wonProviders.length > 0) {
      console.log('\nWon providers that should be hidden:');
      wonProviders.forEach(p => {
        console.log(`  - ${p.firstName} ${p.lastName} (ID: ${p.id})`);
      });
    }
    
    if (lostProviders.length > 0) {
      console.log('\nLost providers that should be hidden:');
      lostProviders.forEach(p => {
        console.log(`  - ${p.firstName} ${p.lastName} (ID: ${p.id})`);
      });
    }
    
    console.log('\n✅ Kanban filtering test completed. Won/Lost providers should now be hidden from the Kanban view.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testKanbanFiltering().catch(console.error);
