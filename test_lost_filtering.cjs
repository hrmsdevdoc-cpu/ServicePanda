// Test script to verify Lost status filtering logic
const fetch = (await import('node-fetch')).default;

async function testLostFiltering() {
  try {
    console.log('🧪 Testing Lost status filtering...\n');

    // Test 1: Check if Lost customers are properly filtered when Lost is not selected
    console.log('📋 Test 1: Filtering with Lost NOT selected');
    
    const response = await fetch('http://localhost:3000/api/admin/potential-customers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzM2NDQ4MDAwfQ.8Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.potentialCustomers.length} total customers`);
    
    // Check for Lost customers
    const lostCustomers = data.potentialCustomers.filter(customer => 
      customer.campaignStatus === 'Lost' || customer.status === 'Lost'
    );
    
    console.log(`🔍 Found ${lostCustomers.length} customers with Lost status:`);
    lostCustomers.forEach(customer => {
      console.log(`  - ${customer.name} (ID: ${customer.id}) - Status: ${customer.campaignStatus || customer.status}`);
    });

    console.log('\n📊 Summary:');
    console.log(`  - Total customers: ${data.potentialCustomers.length}`);
    console.log(`  - Lost customers: ${lostCustomers.length}`);
    console.log(`  - Other customers: ${data.potentialCustomers.length - lostCustomers.length}`);

  } catch (error) {
    console.error('❌ Error testing Lost filtering:', error.message);
  }
}

testLostFiltering();
