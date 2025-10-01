console.log('🧪 Testing Real-Time Updates...\n');

async function testRealtimeUpdates() {
  const fetch = (await import('node-fetch')).default;
  try {
    // Test 1: Check current leads
    console.log('1️⃣ Testing current leads API...');
    const leadsResponse = await fetch('http://localhost:3000/api/provider/leads', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-provider-1'
      }
    });

    if (!leadsResponse.ok) {
      throw new Error(`Leads API failed: ${leadsResponse.status}`);
    }

    const leads = await leadsResponse.json();
    console.log(`✅ Current leads: ${leads.length}`);
    console.log(`   Pending leads: ${leads.filter(l => l.status === 'pending').length}`);
    console.log(`   Purchased leads: ${leads.filter(l => l.status === 'purchased').length}`);

    // Test 2: Check notification polling
    console.log('\n2️⃣ Testing notification polling...');
    const notificationResponse = await fetch('http://localhost:3000/api/provider/notifications/poll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-provider-id': '1'
      }
    });

    if (!notificationResponse.ok) {
      throw new Error(`Notification API failed: ${notificationResponse.status}`);
    }

    const notifications = await notificationResponse.json();
    console.log(`✅ Notifications: ${notifications.notifications?.length || 0}`);

    // Test 3: Simulate customer request to trigger new lead
    console.log('\n3️⃣ Testing customer request flow...');
    const customerRequestResponse = await fetch('http://localhost:3000/api/customer/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-customer-1'
      },
      body: JSON.stringify({
        categoryId: 1,
        description: 'Test real-time update - urgent plumbing needed',
        preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        urgency: 'high',
        budget: 500,
        suburb: 'Melbourne',
        postcode: '3000'
      })
    });

    if (!customerRequestResponse.ok) {
      const errorText = await customerRequestResponse.text();
      console.log(`⚠️ Customer request failed: ${customerRequestResponse.status} - ${errorText}`);
    } else {
      const requestResult = await customerRequestResponse.json();
      console.log(`✅ Customer request created: ${requestResult.requestId}`);
      
      // Wait a moment for lead distribution
      console.log('⏳ Waiting 3 seconds for lead distribution...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check leads again
      console.log('\n4️⃣ Checking leads after customer request...');
      const updatedLeadsResponse = await fetch('http://localhost:3000/api/provider/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token-provider-1'
        }
      });

      if (updatedLeadsResponse.ok) {
        const updatedLeads = await updatedLeadsResponse.json();
        console.log(`✅ Updated leads: ${updatedLeads.length}`);
        console.log(`   Pending leads: ${updatedLeads.filter(l => l.status === 'pending').length}`);
        
        const newLeads = updatedLeads.filter(l => l.status === 'pending');
        if (newLeads.length > leads.filter(l => l.status === 'pending').length) {
          console.log('🎉 SUCCESS: New leads detected! Real-time updates working!');
          console.log('   New leads:', newLeads.map(l => ({ id: l.requestId, category: l.categoryName, urgency: l.urgency })));
        } else {
          console.log('⚠️ No new leads detected - may need to check lead distribution');
        }
      }
    }

    console.log('\n✅ Real-time update test completed!');
    console.log('\n📱 Provider App Changes Made:');
    console.log('   - Reduced staleTime from 5 minutes to 30 seconds');
    console.log('   - Added auto-refetch every 60 seconds');
    console.log('   - Added refetch when app comes to foreground');
    console.log('   - Added enhanced polling every 30 seconds');
    console.log('   - Updated both NewLeadsScreen and DashboardScreen');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRealtimeUpdates();
