const https = require('https');
const http = require('http');

async function testRegionAPI() {
  try {
    console.log('🔍 Testing API for region field...');
    
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/potential-customers', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('Raw response:', data);
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            console.log('Parse error:', e.message);
            reject(e);
          }
        });
      });
      req.on('error', reject);
    });
    
    console.log('📊 Total customers:', response.length);
    
    if (response.length > 0) {
      const firstCustomer = response[0];
      console.log('👤 First customer fields:', Object.keys(firstCustomer));
      console.log('🏠 Region field exists:', firstCustomer.hasOwnProperty('region'));
      console.log('📍 Region value:', firstCustomer.region);
      
      // Check customers with Brisbane regions
      const brisbaneCustomers = response.filter(c => c.region && c.region.includes('Brisbane'));
      console.log('🏙️ Brisbane customers:', brisbaneCustomers.length);
      brisbaneCustomers.forEach(c => {
        console.log(`  - ${c.name}: ${c.region}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRegionAPI();
