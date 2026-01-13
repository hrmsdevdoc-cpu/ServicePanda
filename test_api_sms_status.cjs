const fetch = require('node-fetch');

async function testApiSmsStatus() {
  try {
    console.log('🔍 Testing API response for potential providers...');
    
    // First, login to get admin token
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
      console.error('❌ Login failed:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('✅ Login successful');
    
    // Get potential providers
    const providersResponse = await fetch('http://localhost:3000/api/admin/potential-providers', {
      headers: {
        'x-admin-token': token
      }
    });
    
    if (!providersResponse.ok) {
      console.error('❌ Failed to get providers:', providersResponse.status);
      return;
    }
    
    const providers = await providersResponse.json();
    console.log(`📋 Found ${providers.length} providers`);
    
    // Find Lavi kumar
    const lavi = providers.find(p => 
      p.firstName?.toLowerCase().includes('lavi') || 
      p.lastName?.toLowerCase().includes('kumar') ||
      p.phone === '0485901939'
    );
    
    if (lavi) {
      console.log('\n👤 Lavi kumar found:');
      console.log(`   ID: ${lavi.id}`);
      console.log(`   Name: ${lavi.firstName} ${lavi.lastName}`);
      console.log(`   Phone: ${lavi.phone}`);
      console.log(`   Status: ${lavi.status}`);
      console.log(`   SMS Status: ${lavi.smsDeliveryStatus}`);
      console.log(`   1st SMS Sent: ${lavi.firstSmsSentAt}`);
      console.log(`   2nd SMS Sent: ${lavi.secondSmsSentAt}`);
      
      // Check if SMS status fields exist
      console.log('\n🔍 Available fields:');
      Object.keys(lavi).forEach(key => {
        if (key.toLowerCase().includes('sms')) {
          console.log(`   ${key}: ${lavi[key]}`);
        }
      });
    } else {
      console.log('❌ Lavi kumar not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testApiSmsStatus().catch(console.error);
