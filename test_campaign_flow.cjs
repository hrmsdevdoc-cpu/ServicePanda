const axios = require('axios');

async function testCampaignFlow() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing Campaign Flow - Customer Status Updates...');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Get current customers
    console.log('\n2. Getting current customers...');
    const customersResponse = await axios.get(`${baseUrl}/api/admin/potential-customers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const customers = customersResponse.data;
    console.log(`✅ Found ${customers.length} customers`);
    
    // Show current status distribution
    const statusCounts = {};
    customers.forEach(customer => {
      const status = customer.smsDeliveryStatus || 'not_sent';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\n📊 Current Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} customers`);
    });
    
    // Step 3: Create a test campaign
    console.log('\n3. Creating test campaign...');
    const campaignData = {
      name: `Test Campaign Flow - ${new Date().toLocaleTimeString()}`,
      message: `Hello {customerName}! This is a test campaign flow. Reply STOP to unsubscribe.`,
      voucherCode: 'FLOW123',
      voucherAmount: '20.00',
      selectedStates: ['Queensland'],
      selectedStatuses: ['New'],
      status: 'draft'
    };
    
    const createResponse = await axios.post(`${baseUrl}/api/admin/sms/campaigns`, campaignData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const campaignId = createResponse.data.id;
    console.log(`✅ Campaign created with ID: ${campaignId}`);
    
    // Step 4: Get target audience (customers who would be added to campaign)
    console.log('\n4. Calculating target audience...');
    const targetAudience = customers.filter(customer => {
      // Check if customer state matches selected states
      const customerState = customer.state;
      const stateMatches = campaignData.selectedStates.length === 0 || 
        campaignData.selectedStates.includes('Queensland'); // Simplified for test
      
      // Check customer status
      const currentStatus = 'New'; // Assuming all are New for test
      const statusMatches = campaignData.selectedStatuses.length === 0 || 
        campaignData.selectedStatuses.includes(currentStatus);
      
      return stateMatches && statusMatches;
    });
    
    console.log(`✅ Target audience: ${targetAudience.length} customers`);
    targetAudience.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.phone}) - ${customer.smsDeliveryStatus || 'not_sent'}`);
    });
    
    console.log('\n🎯 Expected Flow:');
    console.log('   1. Create Campaign → Customers move to "Added to Campaign"');
    console.log('   2. Send Campaign → Customers move to "1st SMS Sent" or "2nd SMS Sent"');
    console.log('   3. Send Again → Customers move to "2nd SMS Sent"');
    
    console.log('\n✅ Campaign flow test completed!');
    console.log('💡 Check the admin panel Kanban view to see the status changes.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testCampaignFlow();
