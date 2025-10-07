const axios = require('axios');

async function testCustomerStatus() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing Customer Status Functionality...');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Get customers
    console.log('\n2. Getting customers...');
    const customersResponse = await axios.get(`${baseUrl}/api/admin/potential-customers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const customers = customersResponse.data;
    console.log(`✅ Found ${customers.length} customers`);
    
    // Show customer details
    console.log('\n📊 Customer Details:');
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name} (ID: ${customer.id})`);
      console.log(`   - Phone: ${customer.phone}`);
      console.log(`   - SMS Status: ${customer.smsDeliveryStatus || 'not_sent'}`);
      console.log(`   - State: ${customer.state}`);
      console.log('');
    });
    
    console.log('🎯 Expected Behavior:');
    console.log('   - All customers should have "New" status by default');
    console.log('   - Status dropdown should show "New" as selected');
    console.log('   - Green dot indicator should appear when status is set');
    console.log('   - Dropdown should have green border when status is selected');
    
    console.log('\n💡 Check the admin panel list view to see if:');
    console.log('   1. Customer status dropdowns show "New" as selected');
    console.log('   2. Green indicators appear next to dropdowns');
    console.log('   3. Dropdowns have proper styling');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testCustomerStatus();
